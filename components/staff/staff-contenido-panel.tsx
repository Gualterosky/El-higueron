"use client"

import { useTranslations } from "next-intl"
import { Construction, PanelsTopLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const SKELETON_SECTIONS = [
  "escalada",
  "muro",
  "boulder",
  "camping",
  "equipos",
  "galeria",
  "reservas",
]

export function StaffContenidoPanel() {
  const t = useTranslations("Panel")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold text-forest">
            {t("staff.contenido.title")}
          </h2>
          <Badge variant="secondary">{t("comingSoon")}</Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          {t("staff.contenido.description")}
        </p>
      </div>

      {/* Draft banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50/60 px-4 py-3">
        <Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <p className="text-sm text-amber-800">{t("draftBanner")}</p>
      </div>

      {/* Skeleton section toggles */}
      <section className="space-y-3 opacity-40">
        <div className="flex items-center gap-2">
          <PanelsTopLeft className="h-4 w-4 text-muted-foreground/60" />
          <div className="h-4 w-28 rounded-md bg-muted/60" />
        </div>
        <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
          {SKELETON_SECTIONS.map((s) => (
            <li
              key={s}
              className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5"
            >
              <div className="space-y-1">
                <div className="h-3.5 w-36 rounded-md bg-muted/60" />
                <div className="h-3 w-20 rounded-md bg-muted/40" />
              </div>
              {/* Fake toggle */}
              <div className="h-5 w-9 shrink-0 rounded-full bg-muted/60" />
            </li>
          ))}
        </ul>
      </section>

      {/* Skeleton maintenance toggle */}
      <section className="space-y-3 opacity-40">
        <div className="h-4 w-40 rounded-md bg-muted/60" />
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3 sm:px-5">
          <div className="space-y-1">
            <div className="h-3.5 w-24 rounded-md bg-muted/60" />
            <div className="h-3 w-32 rounded-md bg-muted/40" />
          </div>
          <div className="h-5 w-9 shrink-0 rounded-full bg-muted/60" />
        </div>
      </section>
    </div>
  )
}
