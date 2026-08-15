"use client"

import { useState, useTransition } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Construction } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ComingSoonBadge } from "@/components/admin/coming-soon-badge"
import { setMaintenanceModeAction } from "@/lib/site-settings/actions"

const SECTIONS = ["escalada", "camping", "equipos", "visita", "galeria"] as const

type SectionKey = (typeof SECTIONS)[number]

export function AdminContentPanel({
  initialMaintenance = false,
}: {
  initialMaintenance?: boolean
}) {
  const t = useTranslations("Panel.content")
  const router = useRouter()
  const [hidden, setHidden] = useState<Record<SectionKey, boolean>>({
    escalada: false,
    camping: false,
    equipos: false,
    visita: false,
    galeria: false,
  })
  const [maintenance, setMaintenance] = useState(initialMaintenance)
  const [maintenanceError, setMaintenanceError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggleSection(key: SectionKey, value: boolean) {
    setHidden((prev) => ({ ...prev, [key]: value }))
  }

  function onMaintenanceChange(checked: boolean) {
    const previous = maintenance
    setMaintenance(checked)
    setMaintenanceError(null)

    startTransition(async () => {
      const result = await setMaintenanceModeAction(checked)
      if (!result.ok) {
        setMaintenance(previous)
        setMaintenanceError(t("maintenanceError"))
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        </div>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-medium text-forest">{t("sectionsTitle")}</h3>
          <ComingSoonBadge />
        </div>
        <p className="text-sm text-muted-foreground">{t("sectionsDescription")}</p>

        <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
          {SECTIONS.map((section) => (
            <li
              key={section}
              className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5"
            >
              <div>
                <Label htmlFor={`section-${section}`} className="text-sm font-medium">
                  {t(`sections.${section}`)}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {hidden[section] ? t("sectionHidden") : t("sectionVisible")}
                </p>
              </div>
              <Switch
                id={`section-${section}`}
                checked={hidden[section]}
                onCheckedChange={(checked) => toggleSection(section, checked)}
                aria-label={t(`sections.${section}`)}
              />
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">{t("previewNote")}</p>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-forest">{t("maintenanceTitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("maintenanceDescription")}</p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3 sm:px-5">
          <div>
            <Label htmlFor="maintenance-mode" className="text-sm font-medium">
              {t("maintenanceToggle")}
            </Label>
            <p className="text-xs text-muted-foreground">
              {isPending
                ? t("maintenanceSaving")
                : maintenance
                  ? t("maintenanceOn")
                  : t("maintenanceOff")}
            </p>
            {maintenanceError ? (
              <p className="mt-1 text-xs text-destructive" role="alert">
                {maintenanceError}
              </p>
            ) : null}
          </div>
          <Switch
            id="maintenance-mode"
            checked={maintenance}
            disabled={isPending}
            onCheckedChange={onMaintenanceChange}
            aria-label={t("maintenanceToggle")}
          />
        </div>

        {maintenance ? (
          <div className="overflow-hidden rounded-xl border border-amber-700/30 bg-stone-800 text-beige">
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center sm:px-10">
              <Construction className="h-10 w-10 text-orange" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-beige/70">
                El Higuerón
              </p>
              <h4 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("bannerTitle")}
              </h4>
              <p className="max-w-md text-sm leading-relaxed text-beige/80">
                {t("bannerBody")}
              </p>
            </div>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">
            {t("bannerIdle")}
          </p>
        )}
      </section>
    </div>
  )
}
