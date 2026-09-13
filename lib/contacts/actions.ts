"use server"

import { eq } from "drizzle-orm"
import { getModeratorSession } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { contact } from "@/lib/db/schema"

export async function deleteContactAction(id: string): Promise<{ ok: boolean }> {
  const session = await getModeratorSession()
  if (!session) return { ok: false }

  try {
    await db.delete(contact).where(eq(contact.id, id))
    return { ok: true }
  } catch (error) {
    console.error("[contacts] deleteContactAction failed:", error)
    return { ok: false }
  }
}
