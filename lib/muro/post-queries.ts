import { and, desc, eq, like, ne, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { climbPost } from "@/lib/db/schema"

/** Matches posts tagged with `routeId` (or one of its sub-levels, e.g.
 *  "MBS14-5.9"), whether that came from the legacy single `routeId` column
 *  or the newer `routeIds` array (see schema.ts note). */
function taggedWithRoute(routeId: string) {
  return or(
    eq(climbPost.routeId, routeId),
    like(climbPost.routeId, `${routeId}-%`),
    sql`EXISTS (
      SELECT 1 FROM unnest(${climbPost.routeIds}) AS rid
      WHERE rid = ${routeId} OR rid LIKE ${routeId + "-%"}
    )`
  )
}

export async function getApprovedPostsByRoute(routeId: string) {
  return db
    .select()
    .from(climbPost)
    .where(and(taggedWithRoute(routeId), ne(climbPost.status, "hidden")))
    .orderBy(desc(climbPost.createdAt))
}

/** All approved posts across every route (and posts with no route tagged),
 *  used by the aggregated /muro publications view. */
export async function getApprovedPosts() {
  return db
    .select()
    .from(climbPost)
    .where(ne(climbPost.status, "hidden"))
    .orderBy(desc(climbPost.createdAt))
}

export async function getAllPosts() {
  return db.select().from(climbPost).orderBy(desc(climbPost.createdAt))
}
