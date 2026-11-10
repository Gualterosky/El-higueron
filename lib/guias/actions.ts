"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { eq, inArray, max } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { guide, guideLink } from "@/lib/db/schema"
import { getModeratorSession } from "@/lib/auth/guards"
import { isR2Configured, missingR2EnvVars, uploadToR2 } from "@/lib/storage/r2"
import { GUIDE_LINK_ICONS, MAX_GUIDE_LINKS } from "@/lib/guias/types"

/**
 * Server actions for the "Guías Profesionales" section (added 2026-11).
 * Every mutation verifies getModeratorSession() (admin + staff) — see
 * system_architecture.md section 4.
 */

// ── Image upload ──────────────────────────────────────────────────────────────

const R2_PREFIX = "Guias"
const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}

export type UploadGuideLogoResult =
  | { ok: true; url: string }
  | {
      ok: false
      error:
        | "unauthorized"
        | "missing_file"
        | "invalid_type"
        | "too_large"
        | "not_configured"
        | "failed"
      message?: string
    }

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
}

export async function uploadGuideLogoAction(
  formData: FormData,
): Promise<UploadGuideLogoResult> {
  if (!(await getModeratorSession())) {
    return { ok: false, error: "unauthorized" }
  }

  if (!isR2Configured()) {
    const missing = missingR2EnvVars()
    console.error("[guias] uploadGuideLogoAction: faltan variables R2:", missing.join(", "))
    return {
      ok: false,
      error: "not_configured",
      message: `Faltan variables de entorno: ${missing.join(", ")}`,
    }
  }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "missing_file" }
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type]
  if (!extension) {
    return { ok: false, error: "invalid_type" }
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "too_large" }
  }

  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "guia"
  const fileName = `${baseName}-${Date.now()}.${extension}`

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadToR2(`${R2_PREFIX}/${fileName}`, buffer, file.type)
    return { ok: true, url }
  } catch (error) {
    console.error("[guias] uploadGuideLogoAction failed:", error)
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, error: "failed", message }
  }
}

// ── CRUD + reorder ────────────────────────────────────────────────────────────

type GuideActionError = "unauthorized" | "validation" | "not_found" | "failed"

export type GuideActionResult =
  | { ok: true; id: string }
  | { ok: false; error: GuideActionError }

export type GuideSimpleResult = { ok: true } | { ok: false; error: GuideActionError }

const linkSchema = z.object({
  label: z.string().trim().min(1).max(40),
  url: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .refine((value) => /^(https?:\/\/|mailto:|tel:)/i.test(value), "invalid_url"),
  icon: z.enum(GUIDE_LINK_ICONS).default("web"),
})

const guideSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .refine((value) => value.replace(/\D/g, "").length >= 6, "invalid_phone"),
  logoUrl: z.string().trim().max(500).optional().nullable(),
  links: z.array(linkSchema).max(MAX_GUIDE_LINKS).default([]),
})

export type GuideInput = z.infer<typeof guideSchema>

function revalidateGuidesPaths() {
  revalidatePath("/", "layout")
}

export async function createGuideAction(input: GuideInput): Promise<GuideActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  const parsed = guideSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    const id = randomUUID()
    await db.transaction(async (tx) => {
      const [row] = await tx.select({ value: max(guide.position) }).from(guide)
      const position = (row?.value ?? 0) + 1
      await tx.insert(guide).values({
        id,
        name: data.name,
        logoUrl: data.logoUrl || null,
        phone: data.phone,
        position,
      })
      for (let i = 0; i < data.links.length; i++) {
        const link = data.links[i]
        await tx.insert(guideLink).values({
          id: randomUUID(),
          guideId: id,
          label: link.label,
          url: link.url,
          icon: link.icon,
          position: i,
        })
      }
    })

    revalidateGuidesPaths()
    return { ok: true, id }
  } catch (error) {
    console.error("[guias] createGuideAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function updateGuideAction(
  id: string,
  input: GuideInput,
): Promise<GuideSimpleResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  const parsed = guideSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    const [existing] = await db.select({ id: guide.id }).from(guide).where(eq(guide.id, id))
    if (!existing) return { ok: false, error: "not_found" }

    await db.transaction(async (tx) => {
      await tx
        .update(guide)
        .set({
          name: data.name,
          logoUrl: data.logoUrl || null,
          phone: data.phone,
          updatedAt: new Date(),
        })
        .where(eq(guide.id, id))

      await tx.delete(guideLink).where(eq(guideLink.guideId, id))
      for (let i = 0; i < data.links.length; i++) {
        const link = data.links[i]
        await tx.insert(guideLink).values({
          id: randomUUID(),
          guideId: id,
          label: link.label,
          url: link.url,
          icon: link.icon,
          position: i,
        })
      }
    })

    revalidateGuidesPaths()
    return { ok: true }
  } catch (error) {
    console.error("[guias] updateGuideAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function deleteGuideAction(id: string): Promise<GuideSimpleResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  try {
    const result = await db.delete(guide).where(eq(guide.id, id)).returning({ id: guide.id })
    if (result.length === 0) return { ok: false, error: "not_found" }

    revalidateGuidesPaths()
    return { ok: true }
  } catch (error) {
    console.error("[guias] deleteGuideAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function reorderGuidesAction(orderedIds: string[]): Promise<GuideSimpleResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { ok: false, error: "validation" }
  }
  const ids = orderedIds.map((value) => String(value))
  if (new Set(ids).size !== ids.length) return { ok: false, error: "validation" }

  try {
    const existing = await db.select({ id: guide.id }).from(guide).where(inArray(guide.id, ids))
    const existingIds = new Set(existing.map((row) => row.id))
    if (ids.some((id) => !existingIds.has(id))) return { ok: false, error: "not_found" }

    await db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
        await tx
          .update(guide)
          .set({ position: i, updatedAt: new Date() })
          .where(eq(guide.id, ids[i]))
      }
    })

    revalidateGuidesPaths()
    return { ok: true }
  } catch (error) {
    console.error("[guias] reorderGuidesAction failed:", error)
    return { ok: false, error: "failed" }
  }
}