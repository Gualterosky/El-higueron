import { desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { reservation } from "@/lib/db/schema"

export type ReservationRow = typeof reservation.$inferSelect

export async function getAllReservations(): Promise<ReservationRow[]> {
  try {
    return await db
      .select()
      .from(reservation)
      .orderBy(desc(reservation.createdAt))
  } catch (error) {
    console.error("[reservas] getAllReservations failed:", error)
    return []
  }
}
