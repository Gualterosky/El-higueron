import { z } from "zod"
import type { ContactChannel, NormalizedContact } from "./types"

/**
 * Best-effort normalization of free-form contact strings (email or phone).
 * Colombia is the default country for phone numbers; explicit "+" prefixes
 * are preserved for international visitors.
 */

const emailSchema = z.string().email()

export function normalizeEmail(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed) return null
  if (!emailSchema.safeParse(trimmed).success) return null
  return trimmed
}

/**
 * Normalize a phone number to E.164 (+573001234567).
 * Returns null when the value cannot be interpreted as a phone number.
 */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const hasPlus = trimmed.startsWith("+")
  const digits = trimmed.replace(/[^\d]/g, "")

  if (!digits || digits.length < 7) return null

  if (hasPlus) {
    // Already has country code; just ensure it starts with + and is all digits.
    if (/^\+\d{7,15}$/.test(`+${digits}`)) {
      return `+${digits}`
    }
    return null
  }

  // Colombian mobile numbers: 10 digits starting with 3.
  if (digits.length === 10 && digits.startsWith("3")) {
    return `+57${digits}`
  }

  // If the user typed the full country code without the plus (e.g. 573001234567).
  if (digits.length === 12 && digits.startsWith("57") && digits[2] === "3") {
    return `+${digits}`
  }

  // Could not confidently normalize; do not pollute the contact table.
  return null
}

export function detectContactChannel(raw: string): ContactChannel {
  if (normalizeEmail(raw) !== null) return "email"
  if (normalizePhone(raw) !== null) return "phone"
  return "unknown"
}

export function normalizeContact(raw: string): NormalizedContact | null {
  const email = normalizeEmail(raw)
  if (email) return { kind: "email", value: email }

  const phone = normalizePhone(raw)
  if (phone) return { kind: "phone", value: phone }

  return null
}

/**
 * Pretty-print a normalized E.164 phone number for the UI.
 * Example: +573001234567 -> +57 300 123 4567
 */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("57")) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }
  if (digits.length > 3) {
    return `+${digits.slice(0, digits.length - 9)} ${digits.slice(-9, -6)} ${digits.slice(-6, -3)} ${digits.slice(-3)}`
  }
  return phone
}
