import { MURO_ROUTES, type MuroRouteMeta } from "@/lib/muro/routes"

export type RecommendationCategory = "similar" | "progression" | "relax"

/** Number of grades that don't take a letter suffix (5.9 and below) vs. the
 *  ones that do (5.10 and up: a/b/c/d). Letters are mapped to a fraction of
 *  the tier so grades keep a stable relative order without claiming to be an
 *  exact climbing standard — this is only used to rank routes against each
 *  other, never shown to the user. */
const GRADE_LETTER_OFFSET: Record<string, number> = { a: 0, b: 0.25, c: 0.5, d: 0.75 }

/** Parses a single YDS grade string (e.g. "5.9", "5.10c") into a comparable
 *  number (9, 10.5, ...). Returns `null` for anything that isn't a plain YDS
 *  grade (e.g. "Proyecto", "Por definir"). */
export function parseGradeRank(level: string): number | null {
  const match = level.trim().match(/^5\.(\d+)([a-d])?$/i)
  if (!match) return null
  const tier = Number(match[1])
  const letter = match[2]?.toLowerCase()
  return tier + (letter ? GRADE_LETTER_OFFSET[letter] : 0)
}

/** A route's rank for recommendation purposes: the lowest of its sub-levels
 *  when it has any (MBS14/MBS15), its own grade otherwise, or `"project"`
 *  when it has no defined YDS grade ("Proyecto") — treated as the hardest,
 *  undefined-grade tier rather than excluded entirely. */
export function getEffectiveRank(route: MuroRouteMeta): number | "project" {
  const candidates = (route.subLevels?.length ? route.subLevels : [route.level])
    .map(parseGradeRank)
    .filter((rank): rank is number => rank !== null)
  if (candidates.length === 0) return "project"
  return Math.min(...candidates)
}

function tierOf(rank: number): number {
  return Math.floor(rank)
}

type RankedRoute = { route: MuroRouteMeta; rank: number | "project" }

function pickByTier(pool: RankedRoute[], tier: number, limit: number): MuroRouteMeta[] {
  return pool
    .filter((r) => r.rank !== "project" && tierOf(r.rank) === tier)
    .map((r) => r.route)
    .slice(0, limit)
}

function pickProjects(pool: RankedRoute[], limit: number): MuroRouteMeta[] {
  return pool.filter((r) => r.rank === "project").map((r) => r.route).slice(0, limit)
}

/** Orders `routes` so that any id present in `completedRouteIds` is pushed to
 *  the end instead of removed — lets already-completed routes surface last
 *  rather than not at all. No caller wires this up to real user data yet
 *  (there is no login-linked ascent history in the app today); it only keeps
 *  the API ready for when that exists. */
function deprioritizeCompleted(
  routes: MuroRouteMeta[],
  completedRouteIds?: string[]
): MuroRouteMeta[] {
  if (!completedRouteIds?.length) return routes
  const completed = new Set(completedRouteIds)
  return [...routes].sort((a, b) => Number(completed.has(a.id)) - Number(completed.has(b.id)))
}

const MAX_PER_CATEGORY = 2

/** Builds up to 3 buckets of recommended routes for the route detail page:
 *  - similar: other routes in the same difficulty tier.
 *  - progression: routes one tier harder (or "Proyecto" routes, if the
 *    current route is already at the hardest defined tier).
 *  - relax: routes one tier easier (or the hardest defined tier, if the
 *    current route is a "Proyecto").
 *  Empty buckets are omitted. */
export function getRouteRecommendations(
  routeId: string,
  opts?: { completedRouteIds?: string[] }
): { category: RecommendationCategory; routes: MuroRouteMeta[] }[] {
  const current = MURO_ROUTES.find((r) => r.id === routeId)
  if (!current) return []

  const ranked: RankedRoute[] = MURO_ROUTES.filter((r) => r.id !== routeId).map((route) => ({
    route,
    rank: getEffectiveRank(route),
  }))

  const currentRank = getEffectiveRank(current)
  const numericTiers = ranked
    .map((r) => r.rank)
    .filter((rank): rank is number => rank !== "project")
    .map(tierOf)
  const maxTier = numericTiers.length ? Math.max(...numericTiers) : null
  const minTier = numericTiers.length ? Math.min(...numericTiers) : null

  const buckets: { category: RecommendationCategory; routes: MuroRouteMeta[] }[] = []

  if (currentRank === "project") {
    const similar = pickProjects(ranked, MAX_PER_CATEGORY)
    if (similar.length) buckets.push({ category: "similar", routes: similar })

    // A "Proyecto" is already the hardest, undefined tier: there is no
    // harder progression to offer.
    if (maxTier !== null) {
      const relax = pickByTier(ranked, maxTier, MAX_PER_CATEGORY)
      if (relax.length) buckets.push({ category: "relax", routes: relax })
    }
  } else {
    const tier = tierOf(currentRank)

    const similar = pickByTier(ranked, tier, MAX_PER_CATEGORY)
    if (similar.length) buckets.push({ category: "similar", routes: similar })

    let progression = pickByTier(ranked, tier + 1, MAX_PER_CATEGORY)
    if (!progression.length && maxTier !== null && tier >= maxTier) {
      // Already at (or above) the hardest defined tier: the "Proyecto"
      // routes are the next challenge.
      progression = pickProjects(ranked, MAX_PER_CATEGORY)
    }
    if (progression.length) buckets.push({ category: "progression", routes: progression })

    const relax = pickByTier(ranked, tier - 1, MAX_PER_CATEGORY)
    if (relax.length) buckets.push({ category: "relax", routes: relax })
    else if (minTier !== null && tier <= minTier) {
      // Already at the easiest defined tier: nothing easier to suggest.
    }
  }

  return buckets.map((bucket) => ({
    ...bucket,
    routes: deprioritizeCompleted(bucket.routes, opts?.completedRouteIds),
  }))
}
