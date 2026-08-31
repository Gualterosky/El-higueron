"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getModeratorSession } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { postReply } from "@/lib/db/schema"
import { postStatusSchema, postTypeSchema, type PostStatus } from "@/lib/posts/shared"

const submitSchema = z.object({
  postType: postTypeSchema,
  postId: z.string().trim().min(1).max(100),
  authorName: z.string().trim().min(2).max(100),
  comment: z.string().trim().min(5).max(2000),
  contactInfo: z.string().trim().min(3).max(200),
})

export type ReplyInput = z.infer<typeof submitSchema>

export async function submitReplyAction(
  data: ReplyInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = submitSchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: "Datos inválidos" }

  try {
    await db.insert(postReply).values({
      id: crypto.randomUUID(),
      postType: parsed.data.postType,
      postId: parsed.data.postId,
      authorName: parsed.data.authorName,
      comment: parsed.data.comment,
      contactInfo: parsed.data.contactInfo,
      status: "pending",
    })
    return { ok: true }
  } catch (error) {
    console.error("[replies] submitReplyAction failed:", error)
    return { ok: false, error: "Error al guardar" }
  }
}

// ── Moderation (administrador / staff only) ──────────────────────────────────

export async function updateReplyStatusAction(
  id: string,
  status: PostStatus
): Promise<{ ok: boolean }> {
  if (!(await getModeratorSession())) return { ok: false }
  if (!postStatusSchema.safeParse(status).success) return { ok: false }

  try {
    await db.update(postReply).set({ status }).where(eq(postReply.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch (error) {
    console.error("[replies] updateReplyStatusAction failed:", error)
    return { ok: false }
  }
}

export async function deleteReplyAction(id: string): Promise<{ ok: boolean }> {
  if (!(await getModeratorSession())) return { ok: false }

  try {
    await db.delete(postReply).where(eq(postReply.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch (error) {
    console.error("[replies] deleteReplyAction failed:", error)
    return { ok: false }
  }
}
