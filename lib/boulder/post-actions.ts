"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getModeratorSession } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { boulderPost } from "@/lib/db/schema"
import {
  httpsUrlSchema,
  mediaUrlsSchema,
  postStatusSchema,
  type PostStatus,
} from "@/lib/posts/shared"

const submitSchema = z.object({
  authorName: z.string().trim().min(2).max(100),
  visitDate: z.string().min(1),
  boulderName: z.string().trim().min(1).max(200),
  routeName: z.string().trim().min(1).max(200),
  comment: z.string().trim().min(5).max(2000),
  contactInfo: z.string().trim().min(3).max(200),
  rating: z.number().int().min(1).max(5),
  socialMediaUrl: httpsUrlSchema,
  mediaUrls: mediaUrlsSchema,
})

export type BoulderPostInput = z.infer<typeof submitSchema>

export async function submitBoulderPostAction(
  data: BoulderPostInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = submitSchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: "Datos inválidos" }

  try {
    await db.insert(boulderPost).values({
      id: crypto.randomUUID(),
      authorName: parsed.data.authorName,
      visitDate: parsed.data.visitDate,
      boulderName: parsed.data.boulderName,
      routeName: parsed.data.routeName,
      comment: parsed.data.comment,
      contactInfo: parsed.data.contactInfo,
      rating: parsed.data.rating,
      socialMediaUrl: parsed.data.socialMediaUrl?.trim() || null,
      mediaUrls: parsed.data.mediaUrls?.length ? parsed.data.mediaUrls : null,
      status: "pending",
    })
    return { ok: true }
  } catch {
    return { ok: false, error: "Error al guardar" }
  }
}

// ── Moderation (administrador / staff only) ──────────────────────────────────

export async function updateBoulderPostStatusAction(
  id: string,
  status: PostStatus
): Promise<{ ok: boolean }> {
  if (!(await getModeratorSession())) return { ok: false }
  if (!postStatusSchema.safeParse(status).success) return { ok: false }

  try {
    await db.update(boulderPost).set({ status }).where(eq(boulderPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch (error) {
    console.error("[boulder] updateBoulderPostStatusAction failed:", error)
    return { ok: false }
  }
}

export async function deleteBoulderPostAction(id: string): Promise<{ ok: boolean }> {
  if (!(await getModeratorSession())) return { ok: false }

  try {
    await db.delete(boulderPost).where(eq(boulderPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch (error) {
    console.error("[boulder] deleteBoulderPostAction failed:", error)
    return { ok: false }
  }
}
