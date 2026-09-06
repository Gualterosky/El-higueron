"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing, USER_LOCALE_COOKIE, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const USER_LOCALE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

// Remember this as an explicit, user-chosen preference so future visits
// (without a locale already in the URL) honor it instead of re-detecting
// from the device's language.
function rememberUserLocale(next: Locale) {
  document.cookie = `${USER_LOCALE_COOKIE}=${next}; path=/; max-age=${USER_LOCALE_MAX_AGE}; SameSite=Lax`
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(next: Locale) {
    if (next === locale) return
    rememberUserLocale(next)
    router.replace(pathname, { locale: next })
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-border/60 bg-background p-0.5 text-xs font-semibold",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          className={cn(
            "rounded px-2 py-1 transition-colors",
            locale === code
              ? "bg-forest text-white"
              : "text-muted-foreground hover:text-forest"
          )}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
