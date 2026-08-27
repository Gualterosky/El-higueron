"use server"

import { desc, eq, inArray, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { postReply } from "@/lib/db/schema"

const submitSchema = z.object({
  postType: z.enum(["muro", "camping", "boulder"]),
  postId: z.string().min(1),
  authorName: z.string().min(2).max(100),
  comment: z.string().min(5).max(2000),
  contactInfo: z.string().min(3).max(200),
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
  } catch {
    return { ok: false, error: "Error al guardar" }
  }
}

export async function getApprovedRepliesByPostsAction(
  postType: string,
  postIds: string[]
) {
  if (postIds.length === 0) return []
  return db
    .select()
    .from(postReply)
    .where(
      ne(postReply.status, "hidden")
    )
    .orderBy(desc(postReply.createdAt))
    .then((rows) =>
      rows.filter((r) => r.postType === postType && postIds.includes(r.postId))
    )
}

export async function getAllRepliesAction() {
  return db.select().from(postReply).orderBy(desc(postReply.createdAt))
}

export async function updateReplyStatusAction(
  id: string,
  status: "approved" | "hidden" | "pending"
): Promise<{ ok: boolean }> {
  try {
    await db.update(postReply).set({ status }).where(eq(postReply.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

export async function deleteReplyAction(id: string): Promise<{ ok: boolean }> {
  try {
    await db.delete(postReply).where(eq(postReply.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
