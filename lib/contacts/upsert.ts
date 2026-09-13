"use server"

import { randomUUID } from "crypto"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { contact } from "@/lib/db/schema"
import { normalizeContact } from "./normalize"
import type { ContactSource } from "./types"

type UpsertContactInput = {
  raw: string
  name?: string
  source: ContactSource
}

/**
 * Upsert a contact from any public form submission.
 * Returns the contact id or null when the raw string cannot be normalized.
 * Never throws — failures are logged and swallowed so the original submission
 * is never blocked.
 */
export async function upsertContactFromSubmission(
  input: UpsertContactInput,
): Promise<string | null> {
  const normalized = normalizeContact(input.raw)
  if (!normalized) return null

  const { kind, value } = normalized
  const cleanName = input.name?.trim() || null

  try {
    const existingRows = await db
      .select()
      .from(contact)
      .where(kind === "email" ? eq(contact.email, value) : eq(contact.phone, value))
      .limit(1)
    const existing = existingRows[0]

    const now = new Date()

    if (existing) {
      await db
        .update(contact)
        .set({
          name: existing.name ?? cleanName,
          lastSeenAt: now,
          submissionCount: sql`${contact.submissionCount} + 1`,
          updatedAt: now,
        })
        .where(eq(contact.id, existing.id))
      return existing.id
    }

    const id = randomUUID()
    await db.insert(contact).values({
      id,
      email: kind === "email" ? value : null,
      phone: kind === "phone" ? value : null,
      name: cleanName,
      emailVerified: false,
      phoneVerified: false,
      source: input.source,
      firstSeenAt: now,
      lastSeenAt: now,
      submissionCount: 1,
      createdAt: now,
      updatedAt: now,
    })
    return id
  } catch (error) {
    console.error("[contacts] upsertContactFromSubmission failed:", error)
    return null
  }
}
