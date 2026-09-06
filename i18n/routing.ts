import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  // Don't let next-intl persist an automatic NEXT_LOCALE cookie: without this,
  // the first time a request resolves to a locale (e.g. via a shared link
  // that happened to land on /en, or an in-app browser sending a misleading
  // Accept-Language) that choice sticks forever, overriding the device's real
  // OS/browser language on every later visit. We manage an explicit,
  // user-chosen preference ourselves (see USER_LOCALE_COOKIE in proxy.ts and
  // components/language-switcher.tsx), so automatic visits always re-detect
  // from the device's Accept-Language header.
  localeCookie: false,
})

export type Locale = (typeof routing.locales)[number]

export const USER_LOCALE_COOKIE = "USER_LOCALE"
