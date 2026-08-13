"use client"

import { useTranslations } from "next-intl"
import {
  CalendarDays,
  MessageSquareText,
  Newspaper,
  PanelsTopLeft,
  Users,
} from "lucide-react"
import { Link } from "@/i18n/navigation"

const CATEGORIES = [
  {
    href: "/admin/usuarios",
    labelKey: "users",
    icon: Users,
  },
  {
    href: "/admin/resenas",
    labelKey: "reviews",
    icon: MessageSquareText,
  },
  {
    href: "/admin/reservas",
    labelKey: "reservations",
    icon: CalendarDays,
  },
  {
    href: "/admin/publicaciones",
    labelKey: "posts",
    icon: Newspaper,
  },
  {
    href: "/admin/contenido",
    labelKey: "content",
    icon: PanelsTopLeft,
  },
] as const

export function AdminHomePanel() {
  const t = useTranslations("Panel")

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-forest">{t("adminWelcome")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("adminDescription")}</p>
      </div>

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
    </div>
  )
}
