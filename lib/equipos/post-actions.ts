"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getModeratorSession } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { equipmentPost } from "@/lib/db/schema"
import { upsertContactFromSubmission } from "@/lib/contacts/upsert"
import { postStatusSchema, type PostStatus } from "@/lib/posts/shared"

/**
 * Comments about the equipment rental section: simplified compared to
 * muro/camping/boulder posts (no visit date, category, urgency or media),
 * see lib/db/schema.ts::equipmentPost.
 */
const submitSchema = z.object({
  authorName: z.string().trim().min(2).max(100),
  comment: z.string().trim().min(5).max(2000),
  contactInfo: z.string().trim().min(3).max(200),
  rating: z.number().int().min(1).max(5),
})

export type EquipmentPostInput = z.infer<typeof submitSchema>

export async function submitEquipmentPostAction(
  data: EquipmentPostInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = submitSchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: "Datos inválidos" }

  try {
    const contactId = await upsertContactFromSubmission({
      raw: parsed.data.contactInfo,
      name: parsed.data.authorName,
      source: "equipos",
    })

    await db.insert(equipmentPost).values({
      id: crypto.randomUUID(),
      authorName: parsed.data.authorName,
      comment: parsed.data.comment,
      contactInfo: parsed.data.contactInfo,
      contactId,
      rating: parsed.data.rating,
      status: "pending",
    })
    return { ok: true }
  } catch {
    return { ok: false, error: "Error al guardar" }
  }
}

// ── Moderation (administrador / staff only) ──────────────────────────────────

export async function updateEquipmentPostStatusAction(
  id: string,
  status: PostStatus
): Promise<{ ok: boolean }> {
  if (!(await getModeratorSession())) return { ok: false }
  if (!postStatusSchema.safeParse(status).success) return { ok: false }

  try {
    await db.update(equipmentPost).set({ status }).where(eq(equipmentPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch (error) {
    console.error("[equipos] updateEquipmentPostStatusAction failed:", error)
    return { ok: false }
  }
}

export async function deleteEquipmentPostAction(id: string): Promise<{ ok: boolean }> {
  if (!(await getModeratorSession())) return { ok: false }

  try {
    await db.delete(equipmentPost).where(eq(equipmentPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch (error) {
    console.error("[equipos] deleteEquipmentPostAction failed:", error)
    return { ok: false }
  }
}
