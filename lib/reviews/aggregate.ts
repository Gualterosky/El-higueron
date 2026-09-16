import { db } from "@/lib/db"
import { boulderPost, campingPost, climbPost, equipmentPost } from "@/lib/db/schema"
import { normalizePostCategory, type PostStatus } from "@/lib/posts/shared"
import type { ReviewFilters, ReviewSource, ReviewStats, UnifiedReview } from "@/lib/reviews/types"

/**
 * Aggregates star-rated reviews from the 4 existing review sources
 * (climbPost/muro, campingPost, boulderPost, equipmentPost) into one common
 * shape. There is no unified "review" table — each source keeps its own
 * moderation/mutation flow (see system_architecture.md, "Reseñas
 * unificadas"). Only rows with category = "review" carry a real rating
 * (everything else stores rating = 0, see CATEGORY_REQUIRES_RATING).
 */

async function fetchAllRawReviews(): Promise<UnifiedReview[]> {
  const [muro, camping, boulder, equipos] = await Promise.all([
    db.select().from(climbPost),
    db.select().from(campingPost),
    db.select().from(boulderPost),
    db.select().from(equipmentPost),
  ])

  const toUnified = (
    rows: {
      id: string
      rating: number
      comment: string
      authorName: string
      status: string
      createdAt: Date
      category?: string | null
    }[],
    source: ReviewSource
  ): UnifiedReview[] =>
    rows
      .filter((row) => normalizePostCategory(row.category ?? "review") === "review")
      .map((row) => ({
        id: row.id,
        source,
        rating: row.rating,
        comment: row.comment,
        authorName: row.authorName,
        status: row.status as PostStatus,
        createdAt: row.createdAt,
      }))

  return [
    ...toUnified(muro, "muro"),
    // equipmentPost has no `category` column (see schema.ts) — every row is a review.
    ...toUnified(camping, "camping"),
    ...toUnified(boulder, "boulder"),
    ...toUnified(
      equipos.map((row) => ({ ...row, category: "review" })),
      "equipos"
    ),
  ]
}

function applyFilters(reviews: UnifiedReview[], filters?: ReviewFilters): UnifiedReview[] {
  if (!filters) return reviews
  return reviews.filter((review) => {
    if (filters.sources?.length && !filters.sources.includes(review.source)) return false
    if (filters.ratings?.length && !filters.ratings.includes(review.rating)) return false
    if (filters.statuses?.length && !filters.statuses.includes(review.status)) return false
    if (filters.dateFrom && review.createdAt < filters.dateFrom) return false
    if (filters.dateTo && review.createdAt > filters.dateTo) return false
    return true
  })
}

/** All reviews across the 4 sources, newest first, with optional filters. */
export async function getAllReviewsUnified(filters?: ReviewFilters): Promise<UnifiedReview[]> {
  const all = await fetchAllRawReviews()
  return applyFilters(all, filters).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

/** Reviews visible to the public (never "hidden") — same moderation rule
 *  already used by getApproved*() in each source's post-queries.ts. */
export async function getPublicReviews(filters?: Omit<ReviewFilters, "statuses">) {
  return getAllReviewsUnified({ ...filters, statuses: ["pending", "approved"] })
}

function emptyStatsForSources(sources: readonly ReviewSource[]): ReviewStats["bySource"] {
  return Object.fromEntries(
    sources.map((source) => [source, { count: 0, averageRating: 0 }])
  ) as ReviewStats["bySource"]
}

/** Aggregate metrics for the admin analytics dashboard. Computed in memory
 *  over `getAllReviewsUnified()` — the dataset is small (no pagination
 *  anywhere else in the app either, see system_architecture.md section 3). */
export async function getReviewStats(filters?: ReviewFilters): Promise<ReviewStats> {
  const reviews = await getAllReviewsUnified(filters)
  const sources: ReviewSource[] = ["muro", "camping", "boulder", "equipos"]

  const countByRating: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const bySource = emptyStatsForSources(sources)
  const bySourceSum: Record<ReviewSource, number> = { muro: 0, camping: 0, boulder: 0, equipos: 0 }
  const monthlyBuckets = new Map<string, { sum: number; count: number }>()

  let totalSum = 0

  for (const review of reviews) {
    countByRating[review.rating] = (countByRating[review.rating] ?? 0) + 1
    totalSum += review.rating

    bySource[review.source].count += 1
    bySourceSum[review.source] += review.rating

    const month = review.createdAt.toISOString().slice(0, 7) // "YYYY-MM"
    const bucket = monthlyBuckets.get(month) ?? { sum: 0, count: 0 }
    bucket.sum += review.rating
    bucket.count += 1
    monthlyBuckets.set(month, bucket)
  }

  for (const source of sources) {
    const count = bySource[source].count
    bySource[source].averageRating = count > 0 ? bySourceSum[source] / count : 0
  }

  const monthlyTrend = Array.from(monthlyBuckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { sum, count }]) => ({
      month,
      count,
      averageRating: count > 0 ? sum / count : 0,
    }))

  const negativeAlerts = reviews
    .filter((review) => review.rating <= 2)
    .slice(0, 20)

  return {
    totalCount: reviews.length,
    averageRating: reviews.length > 0 ? totalSum / reviews.length : 0,
    countByRating,
    bySource,
    monthlyTrend,
    negativeAlerts,
  }
}
