"use client"

import { useTranslations } from "next-intl"
import { CalendarDays, Newspaper } from "lucide-react"
import { Link } from "@/i18n/navigation"

const CATEGORIES = [
  {
    href: "/cuenta/publicaciones",
    labelKey: "posts",
    icon: Newspaper,
  },
  {
    href: "/cuenta/reservas",
    labelKey: "reservations",
    icon: CalendarDays,
  },
] as const

type Props = {
  userName: string
}

export function CuentaHomePanel({ userName }: Props) {
  const t = useTranslations("Cuenta")

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("welcome", { name: userName })}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      {/* Stats */}
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {t("home.statsTitle")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-beige/20 px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest">
              <Newspaper className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-forest">0</p>
              <p className="text-sm text-muted-foreground">{t("home.postsLabel")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-beige/20 px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-forest">0</p>
              <p className="text-sm text-muted-foreground">{t("home.reservationsLabel")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick-access cards */}
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {t("home.quickAccess")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 rounded-xl border border-border/60 bg-beige/20 px-4 py-4 transition-colors hover:border-forest/40 hover:bg-beige/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-forest group-hover:underline">
                    {t(`home.categories.${item.labelKey}.title`)}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {t(`home.categories.${item.labelKey}.description`)}
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
