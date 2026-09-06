import { z } from "zod"

/**
 * Validation primitives shared by the three post flows (muro, camping, boulder)
 * and by replies. Keeping them here avoids the schemas drifting apart.
 */

export const POST_STATUSES = ["pending", "approved", "hidden"] as const

export type PostStatus = (typeof POST_STATUSES)[number]

export const postStatusSchema = z.enum(POST_STATUSES)

/** The three post families a reply can be attached to. */
export const POST_TYPES = ["muro", "camping", "boulder"] as const

export type PostType = (typeof POST_TYPES)[number]

export const postTypeSchema = z.enum(POST_TYPES)

/**
 * Category selected by the visitor when filling out a post form. Drives which
 * extra fields are shown/required (rating for "review", urgency for "incident")
 * and how the post is prioritized/filtered in the public feed and admin panel.
 *
 * "suggestion" existed as its own category until 2026-09 and was merged into
 * "review": a visitor's opinion and their suggestions for improvement are the
 * same kind of feedback, so having two separate buttons in the form was
 * confusing. `normalizePostCategory` below keeps any already-stored
 * "suggestion" rows rendering correctly as "review".
 */
export const POST_CATEGORIES = ["incident", "review", "tip", "question"] as const

export type PostCategory = (typeof POST_CATEGORIES)[number]

export const postCategorySchema = z.enum(POST_CATEGORIES)

/**
 * `category` is stored as a free-text column (see schema.ts note), so any
 * value read from the DB must be treated as untrusted. This also maps the
 * retired "suggestion" category to "review" for posts created before the
 * 2026-09 merge, and falls back to "review" for any other unexpected value.
 */
export function normalizePostCategory(value: string): PostCategory {
  if ((POST_CATEGORIES as readonly string[]).includes(value)) return value as PostCategory
  return "review"
}

/** Only "review" posts carry a star rating; the rest store 0 (not applicable). */
export const CATEGORY_REQUIRES_RATING: PostCategory = "review"

/** Only "incident" posts carry an urgency level. */
export const CATEGORY_REQUIRES_URGENCY: PostCategory = "incident"

export const URGENCY_LEVELS = ["low", "medium", "high", "critical"] as const

export type UrgencyLevel = (typeof URGENCY_LEVELS)[number]

export const urgencyLevelSchema = z.enum(URGENCY_LEVELS)

/** Higher rank sorts first when prioritizing incidents. */
export const URGENCY_RANK: Record<UrgencyLevel, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

/** Ids are generated with crypto.randomUUID(); reject anything that is not one. */
export const postIdSchema = z.string().uuid()

/** Optional social embed link. Only https is allowed to avoid javascript:/data: URLs. */
export const httpsUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || /^https:\/\//i.test(value), {
    message: "invalid_url",
  })
  .optional()
  .nullable()

/** Cloudinary URLs produced by MediaUploader: max 3 images + 1 video. */
export const mediaUrlsSchema = z
  .array(z.string().trim().url().max(500))
  .max(4)
  .optional()
  .nullable()

export type ActionOk = { ok: true }
export type ActionError = { ok: false; error: string }
export type ActionResult = ActionOk | ActionError

export const UNAUTHORIZED: ActionError = { ok: false, error: "unauthorized" }
export const INVALID_INPUT: ActionError = { ok: false, error: "Datos inválidos" }
export const SAVE_FAILED: ActionError = { ok: false, error: "Error al guardar" }
