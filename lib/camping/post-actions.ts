"use server"

import { desc, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { campingPost } from "@/lib/db/schema"

const submitSchema = z.object({
  authorName: z.string().min(2).max(100),
  visitDate: z.string().min(1),
  comment: z.string().min(5).max(2000),
  contactInfo: z.string().min(3).max(200),
  rating: z.number().int().min(1).max(5),
  socialMediaUrl: z.string().optional().nullable(),
  mediaUrls: z.array(z.string()).optional().nullable(),
})

export type CampingPostInput = z.infer<typeof submitSchema>

export async function submitCampingPostAction(
  data: CampingPostInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = submitSchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: "Datos inválidos" }

  try {
    await db.insert(campingPost).values({
      id: crypto.randomUUID(),
      authorName: parsed.data.authorName,
      visitDate: parsed.data.visitDate,
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

export async function getApprovedCampingPostsAction() {
  return db
    .select()
    .from(campingPost)
    .where(ne(campingPost.status, "hidden"))
    .orderBy(desc(campingPost.createdAt))
}

export async function getAllCampingPostsAction() {
  return db.select().from(campingPost).orderBy(desc(campingPost.createdAt))
}

export async function updateCampingPostStatusAction(
  id: string,
  status: "approved" | "hidden" | "pending"
): Promise<{ ok: boolean }> {
  try {
    await db.update(campingPost).set({ status }).where(eq(campingPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

export async function deleteCampingPostAction(id: string): Promise<{ ok: boolean }> {
  try {
    await db.delete(campingPost).where(eq(campingPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
