import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { routing, USER_LOCALE_COOKIE, type Locale } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

const AUTH_ONLY_PREFIXES = [
  "/admin",
  "/staff",
  "/cuenta",
  "/cambiar-contrasena",
] as const

function stripLocale(pathname: string): { locale: string | null; path: string } {
  const match = pathname.match(/^\/(es|en)(?=\/|$)/)
  if (!match) {
    return { locale: null, path: pathname || "/" }
  }
  const locale = match[1]
  const path = pathname.slice(locale.length + 1) || "/"
  return { locale, path }
}

function isSupportedLocale(value: string | undefined): value is Locale {
  return !!value && (routing.locales as readonly string[]).includes(value)
}

export default function proxy(request: NextRequest) {
  const { locale: pathLocale, path } = stripLocale(request.nextUrl.pathname)

  // If the request has no explicit locale in the URL, prefer a language the
  // user picked themselves (via the language switcher) over re-detecting
  // from the device. This is the only case where a language choice persists
  // across visits; automatic detection always falls back to the device's
  // Accept-Language (handled by intlMiddleware below).
  if (!pathLocale) {
    const preferred = request.cookies.get(USER_LOCALE_COOKIE)?.value
    if (isSupportedLocale(preferred)) {
      const url = new URL(`/${preferred}${path}`, request.url)
      url.search = request.nextUrl.search
      return NextResponse.redirect(url)
    }
  }

  const locale = pathLocale ?? routing.defaultLocale
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
