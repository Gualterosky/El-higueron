"use server"

import { desc, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { boulderPost } from "@/lib/db/schema"

const submitSchema = z.object({
  authorName: z.string().min(2).max(100),
  visitDate: z.string().min(1),
  boulderName: z.string().min(1).max(200),
  routeName: z.string().min(1).max(200),
  comment: z.string().min(5).max(2000),
  contactInfo: z.string().min(3).max(200),
  rating: z.number().int().min(1).max(5),
  socialMediaUrl: z.string().optional().nullable(),
  mediaUrls: z.array(z.string()).optional().nullable(),
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

export async function getApprovedBoulderPostsAction() {
  return db
    .select()
    .from(boulderPost)
    .where(ne(boulderPost.status, "hidden"))
    .orderBy(desc(boulderPost.createdAt))
}

export async function getAllBoulderPostsAction() {
  return db.select().from(boulderPost).orderBy(desc(boulderPost.createdAt))
}

export async function updateBoulderPostStatusAction(
  id: string,
  status: "approved" | "hidden" | "pending"
): Promise<{ ok: boolean }> {
  try {
    await db.update(boulderPost).set({ status }).where(eq(boulderPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

export async function deleteBoulderPostAction(id: string): Promise<{ ok: boolean }> {
  try {
    await db.delete(boulderPost).where(eq(boulderPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
