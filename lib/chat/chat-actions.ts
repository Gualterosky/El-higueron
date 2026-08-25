"use server"

import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { chatMessage } from "@/lib/db/schema"

/** Server Action: fetch all messages for a session (callable from Client Components). */
export async function getChatMessagesAction(sessionId: string) {
  return db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.sessionId, sessionId))
    .orderBy(chatMessage.createdAt)
}
