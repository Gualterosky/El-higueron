import { and, desc, eq, inArray, ne } from "drizzle-orm"
import { db } from "@/lib/db"
import { postReply } from "@/lib/db/schema"
import type { PostType } from "@/lib/posts/shared"

/**
 * Replies for a batch of posts of the same type.
 * The whole filter runs in SQL (single round-trip, no full-table scan) — callers
 * pass every post id on the page at once, so this is never an N+1.
 */
export async function getApprovedRepliesByPosts(
  postType: PostType,
  postIds: string[]
) {
  if (postIds.length === 0) return []
  return db
    .select()
    .from(postReply)
    .where(
      and(
        eq(postReply.postType, postType),
        inArray(postReply.postId, postIds),
        ne(postReply.status, "hidden")
      )
    )
    .orderBy(desc(postReply.createdAt))
}

export async function getAllReplies() {
  return db.select().from(postReply).orderBy(desc(postReply.createdAt))
}
