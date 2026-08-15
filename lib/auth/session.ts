import { headers } from "next/headers"
import { redirect, unstable_rethrow } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  homePathForRole,
  isRole,
  type Role,
} from "@/lib/auth/roles"

export type AppUser = {
  id: string
  name: string
  email: string
  image?: string | null
  role: Role
  mustChangePassword: boolean
}

export type AppSession = {
  session: {
    id: string
    token: string
    userId: string
    expiresAt: Date
  }
  user: AppUser
}

function toAppSession(
  raw: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>,
): AppSession {
  const role = isRole(raw.user.role) ? raw.user.role : "visitante"
  return {
    session: {
      id: raw.session.id,
      token: raw.session.token,
      userId: raw.session.userId,
      expiresAt: raw.session.expiresAt,
    },
    user: {
      id: raw.user.id,
      name: raw.user.name,
      email: raw.user.email,
      image: raw.user.image,
      role,
      mustChangePassword: Boolean(raw.user.mustChangePassword),
    },
  }
}

export async function getSession(): Promise<AppSession | null> {
  // Must stay outside try/catch so Next.js can opt the route into dynamic rendering.
  const requestHeaders = await headers()

  try {
    const raw = await auth.api.getSession({
      headers: requestHeaders,
    })
    if (!raw) return null
    return toAppSession(raw)
  } catch (error) {
    // Re-throw Next.js control-flow errors (dynamic bailout, redirect, notFound).
    unstable_rethrow(error)
    console.error("[auth] getSession failed:", error)
    return null
  }
}

export async function requireSession(locale: string): Promise<AppSession> {
  const session = await getSession()
  if (!session) {
    redirect(`/${locale}/login`)
  }
  return session
}

export async function requireRole(
  locale: string,
  allowed: Role[],
): Promise<AppSession> {
  const session = await requireSession(locale)

  if (session.user.mustChangePassword) {
    redirect(`/${locale}/cambiar-contrasena`)
  }

  if (!allowed.includes(session.user.role)) {
    redirect(`/${locale}${homePathForRole(session.user.role)}`)
  }

  return session
}

export async function requirePasswordChange(locale: string): Promise<AppSession> {
  const session = await requireSession(locale)
  if (!session.user.mustChangePassword) {
    redirect(`/${locale}${homePathForRole(session.user.role)}`)
  }
  return session
}
