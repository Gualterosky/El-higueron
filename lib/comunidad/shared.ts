import { z } from "zod"

/**
 * Validation primitives and vocabulary for the community matchmaking module
 * (`/comunidad`). A visitor announces a future plan (climbing, bouldering,
 * hiking, camping...) so others can find them and coordinate. This is a
 * single unified table/vocabulary across activities (see
 * system_architecture.md) rather than one table per activity like
 * climbPost/campingPost/boulderPost — a matchmaking post is always about a
 * future event, not a review of a past visit, so it doesn't belong in those
 * families.
 */

export const COMMUNITY_ACTIVITIES = [
  "escalada_deportiva",
  "boulder",
  "senderismo",
  "camping",
  "otro",
] as const

export type CommunityActivity = (typeof COMMUNITY_ACTIVITIES)[number]

export const communityActivitySchema = z.enum(COMMUNITY_ACTIVITIES)

export function isCommunityActivity(value: string): value is CommunityActivity {
  return (COMMUNITY_ACTIVITIES as readonly string[]).includes(value)
}

export const EXPERIENCE_LEVELS = ["principiante", "intermedio", "avanzado", "cualquiera"] as const

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]

export const experienceLevelSchema = z.enum(EXPERIENCE_LEVELS)

export function isExperienceLevel(value: string): value is ExperienceLevel {
  return (EXPERIENCE_LEVELS as readonly string[]).includes(value)
}

/** Manually-set lifecycle of the plan. "expired" is never stored — it's
 *  derived from `eventDate` at read time (see getCommunityDisplayStatus). */
export const COMMUNITY_EVENT_STATUSES = ["open", "cancelled"] as const

export type CommunityEventStatus = (typeof COMMUNITY_EVENT_STATUSES)[number]

export const communityEventStatusSchema = z.enum(COMMUNITY_EVENT_STATUSES)

export type CommunityDisplayStatus = "open" | "cancelled" | "expired"

/**
 * Dynamic logistics indicators per activity (e.g. "tengo cuerda", "busco
 * transporte"). Centralizing this map here means adding/adjusting tags for an
 * activity never requires touching the form, feed or admin panel components.
 * Each value is translated under `Comunidad.logisticsTags.<value>`.
 */
export const ACTIVITY_LOGISTICS_TAGS: Record<CommunityActivity, readonly string[]> = {
  escalada_deportiva: [
    "tengo_cuerda",
    "busco_cuerda",
    "tengo_cintas_seguro",
    "busco_companero_asegurar",
  ],
  boulder: ["tengo_crashpad", "busco_crashpad", "tengo_pies_gato_extra"],
  senderismo: ["tengo_vehiculo", "busco_transporte", "conozco_la_ruta"],
  camping: ["tengo_carpa", "aporto_comida", "aporto_lena", "busco_compartir_carpa"],
  otro: [],
}

/** Drops any tag that isn't part of the given activity's vocabulary — the
 *  client sends the activity+tags together, but only the server's mapping is
 *  trusted (same defense-in-depth pattern as postCategorySchema elsewhere). */
export function filterLogisticsTags(activity: CommunityActivity, tags: string[]): string[] {
  const allowed = new Set(ACTIVITY_LOGISTICS_TAGS[activity])
  return tags.filter((tag) => allowed.has(tag))
}

/** ISO YYYY-MM-DD for "today", used both to block past dates on submission
 *  and to detect expired plans. Comparing plain ISO date strings avoids
 *  timezone-of-day issues (no time component is ever stored). */
export function todayIsoDate(): string {
  return new Date().toISOString().split("T")[0]
}

/** A plan is "expired" starting the day after its event date — computed on
 *  every read, never stored, so it can't drift out of sync. */
export function isCommunityEventExpired(eventDate: string, today: string = todayIsoDate()): boolean {
  return eventDate < today
}

/** Effective status shown to visitors/admins: a manually "cancelled" plan
 *  always wins, otherwise it's "expired" once the date has passed, or "open". */
export function getCommunityDisplayStatus(post: {
  eventDate: string
  eventStatus: string
}): CommunityDisplayStatus {
  if (post.eventStatus === "cancelled") return "cancelled"
  if (isCommunityEventExpired(post.eventDate)) return "expired"
  return "open"
}

/** Contact info is only ever shown for open plans — once a plan is cancelled
 *  or expired it's stripped server-side (not just hidden with CSS) before the
 *  data reaches the client component. See system_architecture.md for the
 *  privacy trade-off of showing contact info publicly at all. */
export function isContactVisible(displayStatus: CommunityDisplayStatus): boolean {
  return displayStatus === "open"
}
