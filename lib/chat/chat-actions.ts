"use server"

import { eq } from "drizzle-orm"
import { getAdminSession } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { chatMessage } from "@/lib/db/schema"

/**
 * Server Action: fetch all messages for a session (used by the admin chat panel).
 * Chat transcripts may contain visitor contact info, so this is admin-only.
 */
export async function getChatMessagesAction(sessionId: string) {
  if (!(await getAdminSession())) return []

  return db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.sessionId, sessionId))
    .orderBy(chatMessage.createdAt)
}
