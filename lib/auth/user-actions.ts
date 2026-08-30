"use server"

import { eq, asc } from "drizzle-orm"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import type { Role } from "@/lib/auth/roles"
import { isRole } from "@/lib/auth/roles"

export type UserRow = {
  id: string
  name: string
  email: string
  role: Role
  banned: boolean
  createdAt: Date
}

type ActionResult<T = undefined> =
  | (T extends undefined ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string }

/** Returns the session user or throws if unauthorized / not an admin. */
async function requireAdmin() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session || session.user.role !== "administrador") {
    throw new Error("unauthorized")
  }
  return session
}

// ── List ──────────────────────────────────────────────────────────────────────

export async function listUsersAction(): Promise<ActionResult<UserRow[]>> {
  try {
    await requireAdmin()
    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(asc(user.createdAt))

    const users: UserRow[] = rows.map((r) => ({
      ...r,
      role: isRole(r.role) ? r.role : "visitante",
    }))

    return { ok: true, data: users }
  } catch {
    return { ok: false, error: "fetch_failed" }
  }
}

// ── Create ────────────────────────────────────────────────────────────────────

export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: Role
  mustChangePassword: boolean
}

export async function createUserAction(
  input: CreateUserInput,
): Promise<ActionResult> {
  try {
    const requestHeaders = await headers()

    // The admin plugin's createUser endpoint verifies the caller is an admin
    // and creates the user WITHOUT creating a session — safe to call from server actions.
    const result = await auth.api.createUser({
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
        data: {
          mustChangePassword: input.mustChangePassword,
          emailVerified: true,
        },
      },
      headers: requestHeaders,
    })

    if (!result?.user?.id) {
      return { ok: false, error: "create_failed" }
    }

    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown"
    if (
      message.toLowerCase().includes("unique") ||
      message.toLowerCase().includes("duplicate") ||
      message.toLowerCase().includes("already exists") ||
      message.includes("USER_ALREADY_EXISTS")
    ) {
      return { ok: false, error: "email_taken" }
    }
    return { ok: false, error: "create_failed" }
  }
}

// ── Update ────────────────────────────────────────────────────────────────────

export type UpdateUserInput = {
  id: string
  role: Role
  banned: boolean
}

export async function updateUserAction(
  input: UpdateUserInput,
): Promise<ActionResult> {
  try {
    await requireAdmin()

    const rows = await db.select({ role: user.role }).from(user).where(eq(user.id, input.id)).limit(1)
    if (!rows.length) return { ok: false, error: "not_found" }

    // Prevent stripping admin from the only admin account
    if (rows[0].role === "administrador" && input.role !== "administrador") {
      const adminCount = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.role, "administrador"))
      if (adminCount.length <= 1) {
        return { ok: false, error: "last_admin" }
      }
    }

    await db
      .update(user)
      .set({
        role: input.role,
        banned: input.banned,
        updatedAt: new Date(),
      })
      .where(eq(user.id, input.id))

    return { ok: true }
  } catch {
    return { ok: false, error: "update_failed" }
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteUserAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()

    const rows = await db.select({ role: user.role }).from(user).where(eq(user.id, id)).limit(1)
    if (!rows.length) return { ok: false, error: "not_found" }
    if (rows[0].role === "administrador") {
      return { ok: false, error: "cannot_delete_admin" }
    }

    await db.delete(user).where(eq(user.id, id))

    return { ok: true }
  } catch {
    return { ok: false, error: "delete_failed" }
  }
}
