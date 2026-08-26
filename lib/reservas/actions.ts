"use server"

import { randomUUID } from "crypto"
import { db } from "@/lib/db"
import { reservation } from "@/lib/db/schema"

export type ReservationInput = {
  type: "camping" | "muro" | "boulder"
  name: string
  contactInfo: string
  numberOfPeople: number
  arrivalDate: string
  departureDate?: string
  mayStayExtra?: boolean
  notes?: string
}

export type SubmitReservationResult =
  | { ok: true; id: string }
  | { ok: false; error: "validation" | "failed" }

export async function submitReservationAction(
  input: ReservationInput,
): Promise<SubmitReservationResult> {
  // Basic validation
  if (
    !input.name?.trim() ||
    !input.contactInfo?.trim() ||
    !input.arrivalDate?.trim() ||
    input.numberOfPeople < 1 ||
    !["camping", "muro", "boulder"].includes(input.type)
  ) {
    return { ok: false, error: "validation" }
  }

  try {
    const id = randomUUID()
    await db.insert(reservation).values({
      id,
      type: input.type,
      name: input.name.trim(),
      contactInfo: input.contactInfo.trim(),
      numberOfPeople: input.numberOfPeople,
      arrivalDate: input.arrivalDate,
      departureDate: input.departureDate ?? null,
      mayStayExtra: input.mayStayExtra ?? false,
      notes: input.notes?.trim() ?? null,
      status: "pending",
    })
    return { ok: true, id }
  } catch (error) {
    console.error("[reservas] submitReservationAction failed:", error)
    return { ok: false, error: "failed" }
  }
}
