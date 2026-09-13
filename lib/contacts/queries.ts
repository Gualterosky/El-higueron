"use server"

import { desc, isNotNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { contact, user } from "@/lib/db/schema"

export type AdminContact = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  userId: string | null
  userName: string | null
  lastSeenAt: Date | null
  submissionCount: number
}

export async function getContactsForAdmin(): Promise<AdminContact[]> {
  return db
    .select({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      userId: contact.userId,
      userName: user.name,
      lastSeenAt: contact.lastSeenAt,
      submissionCount: contact.submissionCount,
    })
    .from(contact)
    .leftJoin(user, sql`${contact.userId} = ${user.id}`)
    .orderBy(desc(contact.lastSeenAt))
}

export async function countContactsWithAccounts(): Promise<{ withAccount: number; total: number }> {
  const [withAccount, total] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(contact)
      .where(isNotNull(contact.userId))
      .then((rows) => Number(rows[0]?.count ?? 0)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(contact)
      .then((rows) => Number(rows[0]?.count ?? 0)),
  ])
  return { withAccount, total }
}
