import { desc, ne } from "drizzle-orm"
import { db } from "@/lib/db"
import { campingPost } from "@/lib/db/schema"

export async function getApprovedCampingPosts() {
  return db
    .select()
    .from(campingPost)
    .where(ne(campingPost.status, "hidden"))
    .orderBy(desc(campingPost.createdAt))
}

export async function getAllCampingPosts() {
  return db.select().from(campingPost).orderBy(desc(campingPost.createdAt))
}
