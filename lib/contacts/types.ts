export const CONTACT_SOURCES = [
  "muro",
  "camping",
  "boulder",
  "equipos",
  "reply",
  "reserva",
  "renta",
  "registro",
  "backfill-muro",
  "backfill-camping",
  "backfill-boulder",
  "backfill-equipos",
  "backfill-reply",
  "backfill-reserva",
  "backfill-renta",
  "unknown",
] as const

export type ContactSource = (typeof CONTACT_SOURCES)[number]

export type ContactChannel = "email" | "phone" | "unknown"

export type NormalizedContact = {
  kind: Extract<ContactChannel, "email" | "phone">
  value: string
}
