import { desc, ne } from "drizzle-orm"
import { db } from "@/lib/db"
import { boulderPost } from "@/lib/db/schema"

export async function getApprovedBoulderPosts() {
  return db
    .select()
    .from(boulderPost)
    .where(ne(boulderPost.status, "hidden"))
    .orderBy(desc(boulderPost.createdAt))
}

export async function getAllBoulderPosts() {
  return db.select().from(boulderPost).orderBy(desc(boulderPost.createdAt))
}
