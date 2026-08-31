import { getSession } from "@/lib/auth/session"
import type { AppSession } from "@/lib/auth/session"
import type { Role } from "@/lib/auth/roles"

/**
 * Authorization guards for Server Actions and Route Handlers.
 *
 * Page-level protection lives in `requireRole` (lib/auth/session.ts), which redirects.
 * Server Actions are independent HTTP endpoints, so they must re-check permissions
 * themselves — a protected page does NOT protect the actions it imports.
 */

/** Returns the session only if it has one of `allowed` roles and no pending password change. */
export async function getAuthorizedSession(
  allowed: readonly Role[],
): Promise<AppSession | null> {
  const session = await getSession()
  if (!session) return null
  if (session.user.mustChangePassword) return null
  if (!allowed.includes(session.user.role)) return null
  return session
}

/** Content moderation (publicaciones y comentarios) is allowed for admin and staff. */
export const MODERATOR_ROLES = ["administrador", "staff"] as const

export async function getModeratorSession(): Promise<AppSession | null> {
  return getAuthorizedSession(MODERATOR_ROLES)
}

export async function getAdminSession(): Promise<AppSession | null> {
  return getAuthorizedSession(["administrador"])
}
