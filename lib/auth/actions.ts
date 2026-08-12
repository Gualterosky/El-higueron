"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { homePathForRole, isRole } from "@/lib/auth/roles"

export type ChangePasswordResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string }

export async function completeForcedPasswordChange(input: {
  currentPassword: string
  newPassword: string
}): Promise<ChangePasswordResult> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    return { ok: false, error: "unauthorized" }
  }

  if (!session.user.mustChangePassword) {
    const role = isRole(session.user.role) ? session.user.role : "visitante"
    return { ok: true, redirectTo: homePathForRole(role) }
  }

  if (input.newPassword.length < 8) {
    return { ok: false, error: "too_short" }
  }

  if (input.newPassword === input.currentPassword) {
    return { ok: false, error: "same_password" }
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        revokeOtherSessions: true,
      },
      headers: requestHeaders,
    })
  } catch {
    return { ok: false, error: "invalid_current" }
  }

  await db
    .update(user)
    .set({
      mustChangePassword: false,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id))

  const role = isRole(session.user.role) ? session.user.role : "visitante"
  return { ok: true, redirectTo: homePathForRole(role) }
}
