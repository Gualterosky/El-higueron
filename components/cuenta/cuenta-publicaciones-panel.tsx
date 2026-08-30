"use client"

import { useTranslations } from "next-intl"
import { Construction, Newspaper } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function CuentaPublicacionesPanel() {
  const t = useTranslations("Cuenta")
  const tPanel = useTranslations("Panel")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold text-forest">
            {t("publicaciones.title")}
          </h2>
          <Badge variant="secondary">{tPanel("comingSoon")}</Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">{t("publicaciones.description")}</p>
      </div>

      {/* Draft banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50/60 px-4 py-3">
        <Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <p className="text-sm text-amber-800">{t("publicaciones.draftNote")}</p>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/60 bg-beige/10 px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 text-forest">
          <Newspaper className="h-7 w-7" />
        </span>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{t("publicaciones.emptyTitle")}</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("publicaciones.emptyDescription")}
          </p>
        </div>
        <Button
          disabled
          variant="outline"
          className="mt-1 cursor-not-allowed opacity-50"
        >
          {tPanel("comingSoon")}
        </Button>
      </div>
    </div>
  )
}
