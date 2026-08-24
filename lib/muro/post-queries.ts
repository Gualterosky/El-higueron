import { and, desc, eq, like, or } from "drizzle-orm"
import { db } from "@/lib/db"
import { climbPost } from "@/lib/db/schema"

export async function getApprovedPostsByRoute(routeId: string) {
  return db
    .select()
    .from(climbPost)
    .where(
      and(
        or(eq(climbPost.routeId, routeId), like(climbPost.routeId, `${routeId}-%`)),
        eq(climbPost.status, "approved")
      )
    )
    .orderBy(desc(climbPost.createdAt))
}

export async function getAllPosts() {
  return db.select().from(climbPost).orderBy(desc(climbPost.createdAt))
}
