"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getModeratorSession } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { communityPost } from "@/lib/db/schema"
import { upsertContactFromSubmission } from "@/lib/contacts/upsert"
import { postStatusSchema, type PostStatus } from "@/lib/posts/shared"
import {
  communityActivitySchema,
  communityEventStatusSchema,
  experienceLevelSchema,
  filterLogisticsTags,
  todayIsoDate,
  type CommunityEventStatus,
} from "@/lib/comunidad/shared"

const submitSchema = z
  .object({
    authorName: z.string().trim().min(2).max(100),
    contactInfo: z.string().trim().min(3).max(200),
    activity: communityActivitySchema,
    eventDate: z.string().min(1),
    locationText: z.string().trim().max(200).default(""),
    level: experienceLevelSchema.optional().nullable(),
    gradeDetail: z.string().trim().max(100).optional().nullable(),
    logisticsTags: z.array(z.string().trim().max(60)).max(20).default([]),
    maxParticipants: z.number().int().min(1).max(50).optional().nullable(),
    notes: z.string().trim().max(2000).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.eventDate < todayIsoDate()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["eventDate"], message: "invalid_date" })
    }
  })

export type CommunityPostInput = z.infer<typeof submitSchema>

export async function submitCommunityPostAction(
  data: CommunityPostInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = submitSchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: "Datos inválidos" }

  try {
    const contactId = await upsertContactFromSubmission({
      raw: parsed.data.contactInfo,
      name: parsed.data.authorName,
      source: "comunidad",
    })

    const logisticsTags = filterLogisticsTags(parsed.data.activity, parsed.data.logisticsTags)

    await db.insert(communityPost).values({
      id: crypto.randomUUID(),
      authorName: parsed.data.authorName,
      contactInfo: parsed.data.contactInfo,
      contactId,
      activity: parsed.data.activity,
      eventDate: parsed.data.eventDate,
      locationText: parsed.data.locationText,
      level: parsed.data.level ?? null,
      gradeDetail: parsed.data.gradeDetail?.trim() || null,
      logisticsTags: logisticsTags.length ? logisticsTags : null,
      maxParticipants: parsed.data.maxParticipants ?? null,
      notes: parsed.data.notes?.trim() || null,
      status: "pending",
      eventStatus: "open",
    })
    return { ok: true }
  } catch (error) {
    console.error("[comunidad] submitCommunityPostAction failed:", error)
    return { ok: false, error: "Error al guardar" }
  }
}

// ── Moderation (administrador / staff only) ──────────────────────────────────

export async function updateCommunityPostStatusAction(
  id: string,
  status: PostStatus
): Promise<{ ok: boolean }> {
  if (!(await getModeratorSession())) return { ok: false }
  if (!postStatusSchema.safeParse(status).success) return { ok: false }

  try {
    await db.update(communityPost).set({ status }).where(eq(communityPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch (error) {
    console.error("[comunidad] updateCommunityPostStatusAction failed:", error)
    return { ok: false }
  }
}

/** Lets a moderator manually cancel/reopen a plan (e.g. the organizer asked
 *  by contact/WhatsApp because they can't get to the automated form). Expired
 *  is never set here — it's always derived from `eventDate`. */
export async function updateCommunityEventStatusAction(
  id: string,
  eventStatus: CommunityEventStatus
): Promise<{ ok: boolean }> {
  if (!(await getModeratorSession())) return { ok: false }
  if (!communityEventStatusSchema.safeParse(eventStatus).success) return { ok: false }

  try {
    await db.update(communityPost).set({ eventStatus }).where(eq(communityPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch (error) {
    console.error("[comunidad] updateCommunityEventStatusAction failed:", error)
    return { ok: false }
  }
}

export async function deleteCommunityPostAction(id: string): Promise<{ ok: boolean }> {
  if (!(await getModeratorSession())) return { ok: false }

  try {
    await db.delete(communityPost).where(eq(communityPost.id, id))
    revalidatePath("/", "layout")
    return { ok: true }
  } catch (error) {
    console.error("[comunidad] deleteCommunityPostAction failed:", error)
    return { ok: false }
  }
}
