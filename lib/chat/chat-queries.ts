import { count, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { chatMessage, chatSession } from "@/lib/db/schema"

/** All sessions ordered by most recent activity, with message count. */
export async function getAllChatSessions() {
  const sessions = await db
    .select()
    .from(chatSession)
    .orderBy(desc(chatSession.updatedAt))

  const counts = await db
    .select({ sessionId: chatMessage.sessionId, total: count(chatMessage.id) })
    .from(chatMessage)
    .groupBy(chatMessage.sessionId)

  const countMap = new Map(counts.map((c) => [c.sessionId, c.total]))

  return sessions.map((s) => ({
    ...s,
    messageCount: countMap.get(s.id) ?? 0,
  }))
}

/** All messages for a specific session, ordered chronologically. */
export async function getChatSessionMessages(sessionId: string) {
  return db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.sessionId, sessionId))
    .orderBy(chatMessage.createdAt)
}
