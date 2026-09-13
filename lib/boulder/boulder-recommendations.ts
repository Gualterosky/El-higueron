import { BOULDERS, type BoulderMeta } from "@/lib/boulder/boulders"

export type RecommendationCategory = "similar" | "progression" | "relax"

/** Parses a single V-grade string (e.g. "V4") into a comparable number.
 *  Returns `null` for anything that isn't a plain V-grade. */
export function parseVGrade(level: string): number | null {
  const match = level.trim().match(/^V(\d+)$/i)
  return match ? Number(match[1]) : null
}

/** A boulder block can hold problems of different grades (e.g. BLDR04 has
 *  V4/V6/V8 problems), so unlike a Muro route it doesn't have a single grade
 *  — it has a range. `min`/`max` are the easiest/hardest parsed grade among
 *  its problems; `null` if none of its problems have a parseable V-grade. */
export function getBoulderGradeRange(boulder: BoulderMeta): { min: number; max: number } | null {
  const grades = boulder.problems.map((p) => parseVGrade(p.level)).filter((g): g is number => g !== null)
  if (grades.length === 0) return null
  return { min: Math.min(...grades), max: Math.max(...grades) }
}

type RankedBoulder = { boulder: BoulderMeta; range: { min: number; max: number } | null }

/** Orders `boulders` so that any id present in `completedBoulderIds` is
 *  pushed to the end instead of removed — lets already-visited blocks
 *  surface last rather than not at all. No caller wires this up to real user
 *  data yet (there is no login-linked session history in the app today); it
 *  only keeps the API ready for when that exists. */
function deprioritizeCompleted(
  boulders: BoulderMeta[],
  completedBoulderIds?: string[]
): BoulderMeta[] {
  if (!completedBoulderIds?.length) return boulders
  const completed = new Set(completedBoulderIds)
  return [...boulders].sort((a, b) => Number(completed.has(a.id)) - Number(completed.has(b.id)))
}

const MAX_PER_CATEGORY = 2

/** Builds up to 3 buckets of recommended boulder blocks for a block's detail
 *  page:
 *  - similar: other blocks whose grade range overlaps the current one's.
 *  - progression: other blocks that start harder than the current one's
 *    hardest problem, closest ones first.
 *  - relax: other blocks that top out easier than the current one's easiest
 *    problem, closest ones first.
 *  Empty buckets are omitted. */
export function getBoulderRecommendations(
  boulderId: string,
  opts?: { completedBoulderIds?: string[] }
): { category: RecommendationCategory; boulders: BoulderMeta[] }[] {
  const current = BOULDERS.find((b) => b.id === boulderId)
  if (!current) return []
  const currentRange = getBoulderGradeRange(current)
  if (!currentRange) return []

  const ranked: RankedBoulder[] = BOULDERS.filter((b) => b.id !== boulderId).map((boulder) => ({
    boulder,
    range: getBoulderGradeRange(boulder),
  }))

  const withRange = ranked.filter(
    (r): r is { boulder: BoulderMeta; range: { min: number; max: number } } => r.range !== null
  )

  const similar = withRange
    .filter((r) => r.range.min <= currentRange.max && r.range.max >= currentRange.min)
    .map((r) => r.boulder)
    .slice(0, MAX_PER_CATEGORY)

  const progression = withRange
    .filter((r) => r.range.min > currentRange.max)
    .sort((a, b) => a.range.min - b.range.min)
    .map((r) => r.boulder)
    .slice(0, MAX_PER_CATEGORY)

  const relax = withRange
    .filter((r) => r.range.max < currentRange.min)
    .sort((a, b) => b.range.max - a.range.max)
    .map((r) => r.boulder)
    .slice(0, MAX_PER_CATEGORY)

  const buckets: { category: RecommendationCategory; boulders: BoulderMeta[] }[] = []
  if (similar.length) buckets.push({ category: "similar", boulders: similar })
  if (progression.length) buckets.push({ category: "progression", boulders: progression })
  if (relax.length) buckets.push({ category: "relax", boulders: relax })

  return buckets.map((bucket) => ({
    ...bucket,
    boulders: deprioritizeCompleted(bucket.boulders, opts?.completedBoulderIds),
  }))
}
