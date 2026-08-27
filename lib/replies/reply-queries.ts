import { desc, ne } from "drizzle-orm"
import { db } from "@/lib/db"
import { postReply } from "@/lib/db/schema"

export async function getApprovedRepliesByPosts(
  postType: string,
  postIds: string[]
) {
  if (postIds.length === 0) return []
  const rows = await db
    .select()
    .from(postReply)
    .where(ne(postReply.status, "hidden"))
    .orderBy(desc(postReply.createdAt))
  return rows.filter((r) => r.postType === postType && postIds.includes(r.postId))
}

export async function getAllReplies() {
  return db.select().from(postReply).orderBy(desc(postReply.createdAt))
}
