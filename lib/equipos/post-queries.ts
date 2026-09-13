import { desc, ne } from "drizzle-orm"
import { db } from "@/lib/db"
import { equipmentPost } from "@/lib/db/schema"

export async function getApprovedEquipmentPosts() {
  return db
    .select()
    .from(equipmentPost)
    .where(ne(equipmentPost.status, "hidden"))
    .orderBy(desc(equipmentPost.createdAt))
}

export async function getAllEquipmentPosts() {
  return db.select().from(equipmentPost).orderBy(desc(equipmentPost.createdAt))
}
