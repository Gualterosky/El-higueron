import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

const AUTH_ONLY_PREFIXES = [
  "/admin",
  "/staff",
  "/cuenta",
  "/cambiar-contrasena",
] as const

function stripLocale(pathname: string): { locale: string; path: string } {
  const match = pathname.match(/^\/(es|en)(?=\/|$)/)
  if (!match) {
    return { locale: routing.defaultLocale, path: pathname || "/" }
  }
  const locale = match[1]
  const path = pathname.slice(locale.length + 1) || "/"
  return { locale, path }
}

export default function proxy(request: NextRequest) {
  const { locale, path } = stripLocale(request.nextUrl.pathname)
  const needsAuth = AUTH_ONLY_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )

  if (needsAuth) {
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set("next", path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
}
