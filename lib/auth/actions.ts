"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { homePathForRole, isRole } from "@/lib/auth/roles"
import { normalizeContact } from "@/lib/contacts/normalize"
import { linkContactsToUser } from "@/lib/contacts/link"

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

export type RegisterResult =
  | { ok: true; method: "email" | "phone"; identifier: string }
  | { ok: false; error: "validation" | "taken" | "phone_unavailable" | "failed" }

export async function registerWithEmailOrPhone(input: {
  name: string
  identifier: string
  password: string
}): Promise<RegisterResult> {
  const contact = normalizeContact(input.identifier)
  if (!contact || !input.name.trim() || input.password.length < 8) {
    return { ok: false, error: "validation" }
  }

  const name = input.name.trim()

  try {
    if (contact.kind === "email") {
      const result = (await auth.api.signUpEmail({
        body: {
          name,
          email: contact.value,
          password: input.password,
        },
      })) as { user: { id: string } }

      await linkContactsToUser({ userId: result.user.id, email: contact.value })

      return { ok: true, method: "email", identifier: contact.value }
    }

    // phone registration fallback: create a technical email placeholder,
    // then set the phone number on the user row. OTP verification is pending.
    const existingPhone = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.phoneNumber, contact.value))
      .limit(1)

    if (existingPhone.length > 0) {
      return { ok: false, error: "taken" }
    }

    const digits = contact.value.replace(/\D/g, "")
    const placeholderEmail = `phone-${digits}@phone.elhigueron.xyz`

    const result = (await auth.api.signUpEmail({
      body: {
        name,
        email: placeholderEmail,
        password: input.password,
      },
    })) as { user: { id: string } }

    await db
      .update(user)
      .set({
        phoneNumber: contact.value,
        updatedAt: new Date(),
      })
      .where(eq(user.id, result.user.id))

    await linkContactsToUser({ userId: result.user.id, phone: contact.value })

    return { ok: true, method: "phone", identifier: contact.value }
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (
      message.toLowerCase().includes("already exists") ||
      message.toLowerCase().includes("duplicate") ||
      message.toLowerCase().includes("unique") ||
      message.includes("USER_ALREADY_EXISTS")
    ) {
      return { ok: false, error: "taken" }
    }
    console.error("[auth] registerWithEmailOrPhone failed:", error)
    return { ok: false, error: "failed" }
  }
}
