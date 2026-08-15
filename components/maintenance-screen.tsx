"use client"

import { Construction } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export function MaintenanceScreen() {
  const t = useTranslations("Maintenance")

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-stone-800 px-4 text-beige">
      <div className="flex max-w-lg flex-col items-center gap-4 text-center">
        <Construction className="h-12 w-12 text-orange" aria-hidden />
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-beige/70">
          El Higuerón
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="text-sm leading-relaxed text-beige/80 sm:text-base">
          {t("body")}
        </p>
        <Link
          href="/login"
          className="mt-4 text-sm font-medium text-orange underline-offset-4 hover:underline"
        >
          {t("loginLink")}
        </Link>
      </div>
    </main>
  )
}
