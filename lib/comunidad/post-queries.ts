import { asc, desc, ne } from "drizzle-orm"
import { db } from "@/lib/db"
import { communityPost } from "@/lib/db/schema"

/** Approved community posts for the public feed, soonest plan first. The feed
 *  component re-sorts open plans ahead of expired/cancelled ones on top of
 *  this base ordering (see components/comunidad/community-feed.tsx). */
export async function getApprovedCommunityPosts() {
  return db
    .select()
    .from(communityPost)
    .where(ne(communityPost.status, "hidden"))
    .orderBy(asc(communityPost.eventDate))
}

export async function getAllCommunityPosts() {
  return db.select().from(communityPost).orderBy(desc(communityPost.createdAt))
}
