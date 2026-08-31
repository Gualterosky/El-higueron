"use server"

import { randomUUID } from "crypto"
import { z } from "zod"
import { db } from "@/lib/db"
import { reservation } from "@/lib/db/schema"
import { RESERVATION_TYPES, type ReservationType } from "@/lib/reservas/types"

/** ISO calendar date (YYYY-MM-DD) that the browser <input type="date"> produces. */
const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "invalid_date")

/**
 * Server-side contract for the booking form.
 * Mirrors the client schema in components/reservation-form.tsx — the client copy
 * exists for instant feedback, this one is the source of truth.
 */
const reservationSchema = z
  .object({
    type: z.enum(RESERVATION_TYPES),
    name: z.string().trim().min(2).max(100),
    contactInfo: z.string().trim().min(5).max(200),
    numberOfPeople: z.number().int().min(1).max(50),
    arrivalDate: isoDateSchema,
    departureDate: isoDateSchema.optional().nullable(),
    mayStayExtra: z.boolean().optional(),
    notes: z.string().trim().max(500).optional().nullable(),
  })
  .refine(
    (data) => !data.departureDate || data.departureDate >= data.arrivalDate,
    { path: ["departureDate"], message: "departure_before_arrival" },
  )
  .refine((data) => data.arrivalDate >= todayIso(), {
    path: ["arrivalDate"],
    message: "arrival_in_the_past",
  })

/** Today in UTC as YYYY-MM-DD. Server and client may sit in different timezones,
 *  so we only reject dates that are unambiguously in the past. */
function todayIso(): string {
  const now = new Date()
  now.setUTCDate(now.getUTCDate() - 1)
  return now.toISOString().slice(0, 10)
}

export type ReservationInput = {
  type: ReservationType
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
  const parsed = reservationSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }

  const data = parsed.data

  try {
    const id = randomUUID()
    await db.insert(reservation).values({
      id,
      type: data.type,
      name: data.name,
      contactInfo: data.contactInfo,
      numberOfPeople: data.numberOfPeople,
      arrivalDate: data.arrivalDate,
      // Departure only applies to camping stays.
      departureDate: data.type === "camping" ? (data.departureDate ?? null) : null,
      mayStayExtra: data.type === "camping" && Boolean(data.mayStayExtra),
      notes: data.notes || null,
      status: "pending",
    })
    return { ok: true, id }
  } catch (error) {
    console.error("[reservas] submitReservationAction failed:", error)
    return { ok: false, error: "failed" }
  }
}
