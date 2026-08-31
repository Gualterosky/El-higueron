/**
 * Reservation vocabulary shared between the form (client), the server action and
 * the admin panel. `text` columns in Postgres are not enums, so these lists are
 * the only thing keeping the values consistent.
 */

/** Value actually stored in `reservation.type`. */
export const RESERVATION_TYPES = ["camping", "muro", "boulder"] as const

export type ReservationType = (typeof RESERVATION_TYPES)[number]

/** Top-level category the user picks first in the UI (escalada then splits into muro/boulder). */
export const ACTIVITY_CATEGORIES = ["camping", "escalada"] as const

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number]

export const RESERVATION_STATUSES = ["pending", "confirmed", "cancelled"] as const

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number]

export function isReservationStatus(value: string): value is ReservationStatus {
  return (RESERVATION_STATUSES as readonly string[]).includes(value)
}
