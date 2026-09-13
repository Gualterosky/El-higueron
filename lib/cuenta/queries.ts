"use server"

import { eq, inArray, desc } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  climbPost,
  campingPost,
  boulderPost,
  postReply,
  reservation,
  contact,
} from "@/lib/db/schema"

async function getUserContactIds(userId: string): Promise<string[]> {
  const rows = await db.select({ id: contact.id }).from(contact).where(eq(contact.userId, userId))
  return rows.map((r) => r.id)
}

export type MyReservation = {
  id: string
  type: string
  arrivalDate: string
  numberOfPeople: number
  status: string
  createdAt: Date
}

export async function getMyReservations(userId: string): Promise<MyReservation[]> {
  const contactIds = await getUserContactIds(userId)
  if (!contactIds.length) return []

  const rows = await db
    .select({
      id: reservation.id,
      type: reservation.type,
      arrivalDate: reservation.arrivalDate,
      numberOfPeople: reservation.numberOfPeople,
      status: reservation.status,
      createdAt: reservation.createdAt,
    })
    .from(reservation)
    .where(inArray(reservation.contactId, contactIds))
    .orderBy(desc(reservation.createdAt))

  return rows
}

export type MyPublication =
  | {
      id: string
      kind: "muro"
      date: string
      content: string
      status: string
      createdAt: Date
    }
  | {
      id: string
      kind: "camping" | "boulder"
      date: string
      content: string
      status: string
      createdAt: Date
    }
  | {
      id: string
      kind: "reply"
      targetType: string
      targetId: string
      content: string
      status: string
      createdAt: Date
    }

export async function getMyPublications(userId: string): Promise<MyPublication[]> {
  const contactIds = await getUserContactIds(userId)
  if (!contactIds.length) return []

  const [climb, camping, boulder, replies] = await Promise.all([
    db
      .select({
        id: climbPost.id,
        date: climbPost.ascentDate,
        content: climbPost.comment,
        status: climbPost.status,
        createdAt: climbPost.createdAt,
      })
      .from(climbPost)
      .where(inArray(climbPost.contactId, contactIds))
      .orderBy(desc(climbPost.createdAt)),
    db
      .select({
        id: campingPost.id,
        date: campingPost.visitDate,
        content: campingPost.comment,
        status: campingPost.status,
        createdAt: campingPost.createdAt,
      })
      .from(campingPost)
      .where(inArray(campingPost.contactId, contactIds))
      .orderBy(desc(campingPost.createdAt)),
    db
      .select({
        id: boulderPost.id,
        date: boulderPost.visitDate,
        content: boulderPost.comment,
        status: boulderPost.status,
        createdAt: boulderPost.createdAt,
      })
      .from(boulderPost)
      .where(inArray(boulderPost.contactId, contactIds))
      .orderBy(desc(boulderPost.createdAt)),
    db
      .select({
        id: postReply.id,
        targetType: postReply.postType,
        targetId: postReply.postId,
        content: postReply.comment,
        status: postReply.status,
        createdAt: postReply.createdAt,
      })
      .from(postReply)
      .where(inArray(postReply.contactId, contactIds))
      .orderBy(desc(postReply.createdAt)),
  ])

  const publications: MyPublication[] = [
    ...climb.map((r) => ({ ...r, kind: "muro" as const })),
    ...camping.map((r) => ({ ...r, kind: "camping" as const })),
    ...boulder.map((r) => ({ ...r, kind: "boulder" as const })),
    ...replies.map((r) => ({ ...r, kind: "reply" as const })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return publications
}
