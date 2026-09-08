import { and, desc, eq, ne, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { boulderPost } from "@/lib/db/schema"

export async function getApprovedBoulderPosts() {
  return db
    .select()
    .from(boulderPost)
    .where(ne(boulderPost.status, "hidden"))
    .orderBy(desc(boulderPost.createdAt))
}

/** Matches posts tagged with `boulderId` (e.g. "BLDR01"), whether via the
 *  legacy single `boulderName` field (new rows mirror the raw id there, see
 *  schema.ts note) or the newer `problemIds` array. Pre-2026-09 rows have a
 *  free-text `boulderName` (visitor-typed) that won't match a real
 *  `BOULDERS` id — those simply won't show up when filtering/linking by
 *  boulder, but still appear in the aggregated feed. */
function taggedWithBoulder(boulderId: string) {
  return or(
    eq(boulderPost.boulderName, boulderId),
    sql`EXISTS (
      SELECT 1 FROM unnest(${boulderPost.problemIds}) AS pid
      WHERE pid = ${boulderId} OR pid LIKE ${boulderId + "-%"}
    )`
  )
}

export async function getApprovedBoulderPostsByBoulderId(boulderId: string) {
  return db
    .select()
    .from(boulderPost)
    .where(and(taggedWithBoulder(boulderId), ne(boulderPost.status, "hidden")))
    .orderBy(desc(boulderPost.createdAt))
}

export async function getAllBoulderPosts() {
  return db.select().from(boulderPost).orderBy(desc(boulderPost.createdAt))
}
