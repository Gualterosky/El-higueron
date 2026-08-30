import { and, desc, eq, ne } from "drizzle-orm"
import { db } from "@/lib/db"
import { boulderPost } from "@/lib/db/schema"

export async function getApprovedBoulderPosts() {
  return db
    .select()
    .from(boulderPost)
    .where(ne(boulderPost.status, "hidden"))
    .orderBy(desc(boulderPost.createdAt))
}

export async function getApprovedBoulderPostsByBoulderName(boulderName: string) {
  return db
    .select()
    .from(boulderPost)
    .where(
      and(
        eq(boulderPost.boulderName, boulderName),
        ne(boulderPost.status, "hidden")
      )
    )
    .orderBy(desc(boulderPost.createdAt))
}

export async function getAllBoulderPosts() {
  return db.select().from(boulderPost).orderBy(desc(boulderPost.createdAt))
}
