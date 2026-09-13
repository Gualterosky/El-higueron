"use server"

import { eq, inArray, or } from "drizzle-orm"
import { db } from "@/lib/db"
import { contact } from "@/lib/db/schema"
import { normalizeEmail, normalizePhone } from "./normalize"

type LinkContactsInput = {
  userId: string
  email?: string
  phone?: string
  /**
   * When true, only verified contacts are eligible for automatic linking.
   * Verification requires a mail/SMS provider (currently pending).
   */
  requireVerified?: boolean
}

/**
 * Link a freshly-created user to any existing contacts that match the
 * identifiers provided during registration. Returns the matched contact ids
 * or null when none were found.
 */
export async function linkContactsToUser(
  input: LinkContactsInput,
): Promise<string[] | null> {
  const { userId } = input
  const email = input.email ? normalizeEmail(input.email) : null
  const phone = input.phone ? normalizePhone(input.phone) : null

  if (!email && !phone) return null

  const conditions = []
  if (email) conditions.push(eq(contact.email, email))
  if (phone) conditions.push(eq(contact.phone, phone))

  try {
    const matches = await db
      .select()
      .from(contact)
      .where(or(...conditions))

    if (!matches.length) return null

    const eligible = matches.filter((c) => {
      if (c.userId && c.userId !== userId) return false
      if (input.requireVerified) {
        if (c.email && c.email === email && !c.emailVerified) return false
        if (c.phone && c.phone === phone && !c.phoneVerified) return false
      }
      return true
    })

    if (!eligible.length) return null

    const ids = eligible.map((c) => c.id)
    await db
      .update(contact)
      .set({ userId, updatedAt: new Date() })
      .where(inArray(contact.id, ids))

    return ids
  } catch (error) {
    console.error("[contacts] linkContactsToUser failed:", error)
    return null
  }
}

/**
 * Find the primary contact for a user, preferring one linked to a verified email.
 */
export async function getPrimaryContactForUser(userId: string) {
  try {
    const rows = await db
      .select()
      .from(contact)
      .where(eq(contact.userId, userId))
      .orderBy(contact.createdAt)
    return rows[0] ?? null
  } catch {
    return null
  }
}
