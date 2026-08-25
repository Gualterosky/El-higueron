"use server"

import { and, desc, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { climbPost } from "@/lib/db/schema"

const submitSchema = z.object({
  authorName: z.string().min(2).max(100),
  ascentDate: z.string().min(1),
  routeId: z.string().min(1),
  comment: z.string().min(5).max(2000),
  contactInfo: z.string().min(3).max(200),
  rating: z.number().int().min(1).max(5),
  socialMediaUrl: z.string().optional().nullable(),
  mediaUrls: z.array(z.string()).optional().nullable(),
})

export type ClimbPostInput = z.infer<typeof submitSchema>

export async function submitClimbPostAction(
  data: ClimbPostInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = submitSchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: "Datos inválidos" }

  try {
    await db.insert(climbPost).values({
      id: crypto.randomUUID(),
      authorName: parsed.data.authorName,
      ascentDate: parsed.data.ascentDate,
      routeId: parsed.data.routeId,
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

export async function getApprovedPostsByRouteAction(routeId: string) {
  return db
    .select()
    .from(climbPost)
    .where(and(eq(climbPost.routeId, routeId), ne(climbPost.status, "hidden")))
    .orderBy(desc(climbPost.createdAt))
}

export async function getAllPostsAction() {
  return db.select().from(climbPost).orderBy(desc(climbPost.createdAt))
}

export async function updatePostStatusAction(
  id: string,
  status: "approved" | "hidden" | "pending"
): Promise<{ ok: boolean }> {
  try {
    await db.update(climbPost).set({ status }).where(eq(climbPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

export async function deletePostAction(id: string): Promise<{ ok: boolean }> {
  try {
    await db.delete(climbPost).where(eq(climbPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
