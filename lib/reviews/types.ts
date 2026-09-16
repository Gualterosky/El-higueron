import type { PostStatus } from "@/lib/posts/shared"

/**
 * Unified review vocabulary. This does NOT introduce a new database table:
 * reviews are aggregated in memory from the 4 existing review sources
 * (climbPost, campingPost, boulderPost, equipmentPost) — see
 * lib/reviews/aggregate.ts and system_architecture.md.
 */
export const REVIEW_SOURCES = ["muro", "camping", "boulder", "equipos"] as const

export type ReviewSource = (typeof REVIEW_SOURCES)[number]

/** A single review normalized to a common shape, regardless of which of the
 *  4 tables it came from. Only rows with category = "review" (rating > 0)
 *  are included — see CATEGORY_REQUIRES_RATING in lib/posts/shared.ts. */
export type UnifiedReview = {
  id: string
  source: ReviewSource
  rating: number
  comment: string
  authorName: string
  status: PostStatus
  createdAt: Date
}

export const REVIEW_SORTS = ["recent", "highest", "lowest"] as const

export type ReviewSort = (typeof REVIEW_SORTS)[number]

export type ReviewFilters = {
  sources?: ReviewSource[]
  ratings?: number[]
  dateFrom?: Date
  dateTo?: Date
  statuses?: PostStatus[]
}

export type ReviewStats = {
  totalCount: number
  averageRating: number
  countByRating: Record<number, number>
  bySource: Record<
    ReviewSource,
    { count: number; averageRating: number }
  >
  /** Monthly trend, oldest first. `month` is "YYYY-MM". */
  monthlyTrend: { month: string; averageRating: number; count: number }[]
  /** Most recent reviews with rating <= 2, for the negative-feedback alert list. */
  negativeAlerts: UnifiedReview[]
}
