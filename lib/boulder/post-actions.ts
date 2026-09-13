"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getModeratorSession } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { boulderPost } from "@/lib/db/schema"
import { upsertContactFromSubmission } from "@/lib/contacts/upsert"
import { getBoulderBaseId, getBoulderProblemId } from "@/lib/boulder/boulders"
import {
  httpsUrlSchema,
  mediaUrlsSchema,
  postCategorySchema,
  postStatusSchema,
  urgencyLevelSchema,
  CATEGORY_REQUIRES_RATING,
  CATEGORY_REQUIRES_URGENCY,
  type PostStatus,
} from "@/lib/posts/shared"

const submitSchema = z
  .object({
    authorName: z.string().trim().min(2).max(100),
    visitDate: z.string().min(1),
    // 0..n problems the visitor tagged. Optional: the aggregated /boulder form
    // lets visitors leave it empty, or pick several problems/boulders.
    problemIds: z.array(z.string().trim().min(1).max(100)).max(20).default([]),
    category: postCategorySchema,
    comment: z.string().trim().min(5).max(2000),
    contactInfo: z.string().trim().min(3).max(200),
    rating: z.number().int().min(0).max(5),
    urgencyLevel: urgencyLevelSchema.optional().nullable(),
    socialMediaUrl: httpsUrlSchema,
    mediaUrls: mediaUrlsSchema,
  })
  .superRefine((data, ctx) => {
    if (data.category === CATEGORY_REQUIRES_RATING && (data.rating < 1 || data.rating > 5)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rating"], message: "invalid_rating" })
    }
    if (data.category === CATEGORY_REQUIRES_URGENCY && !data.urgencyLevel) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["urgencyLevel"], message: "invalid_urgency" })
    }
  })

export type BoulderPostInput = z.infer<typeof submitSchema>

export async function submitBoulderPostAction(
  data: BoulderPostInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = submitSchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: "Datos inválidos" }

  const isReview = parsed.data.category === CATEGORY_REQUIRES_RATING
  const isIncident = parsed.data.category === CATEGORY_REQUIRES_URGENCY

  const firstProblem = parsed.data.problemIds[0]

  try {
    const contactId = await upsertContactFromSubmission({
      raw: parsed.data.contactInfo,
      name: parsed.data.authorName,
      source: "boulder",
    })

    await db.insert(boulderPost).values({
      id: crypto.randomUUID(),
      authorName: parsed.data.authorName,
      visitDate: parsed.data.visitDate,
      // Legacy fields kept for backward compatibility (see schema.ts note):
      // mirror the first tagged problem's ids, or "" when none was selected.
      boulderName: firstProblem ? getBoulderBaseId(firstProblem) : "",
      routeName: firstProblem ? getBoulderProblemId(firstProblem) ?? "" : "",
      problemIds: parsed.data.problemIds.length ? parsed.data.problemIds : null,
      category: parsed.data.category,
      comment: parsed.data.comment,
      contactInfo: parsed.data.contactInfo,
      contactId,
      rating: isReview ? parsed.data.rating : 0,
      urgencyLevel: isIncident ? parsed.data.urgencyLevel ?? null : null,
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
