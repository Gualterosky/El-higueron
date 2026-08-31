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
