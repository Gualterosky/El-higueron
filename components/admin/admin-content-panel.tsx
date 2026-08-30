"use client"

import { useState, useTransition } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Construction } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  setHiddenSectionAction,
  setMaintenanceModeAction,
} from "@/lib/site-settings/actions"
import {
  CONTENT_SECTIONS,
  DEFAULT_HIDDEN_SECTIONS,
  type ContentSection,
  type HiddenSections,
} from "@/lib/site-settings/types"

const DEFAULT_HIDDEN = DEFAULT_HIDDEN_SECTIONS

export function AdminContentPanel({
  initialMaintenance = false,
  initialHidden = DEFAULT_HIDDEN,
}: {
  initialMaintenance?: boolean
  initialHidden?: HiddenSections
}) {
  const t = useTranslations("Panel.content")
  const router = useRouter()
  const [hidden, setHidden] = useState<HiddenSections>(initialHidden)
  const [maintenance, setMaintenance] = useState(initialMaintenance)
  const [sectionError, setSectionError] = useState<string | null>(null)
  const [maintenanceError, setMaintenanceError] = useState<string | null>(null)
  const [pendingSection, setPendingSection] = useState<ContentSection | null>(null)
  const [isMaintenancePending, startMaintenanceTransition] = useTransition()
  const [isSectionPending, startSectionTransition] = useTransition()

  function onSectionChange(section: ContentSection, checked: boolean) {
    const previous = hidden[section]
    setHidden((prev) => ({ ...prev, [section]: checked }))
    setSectionError(null)
    setPendingSection(section)

    startSectionTransition(async () => {
      const result = await setHiddenSectionAction(section, checked)
      setPendingSection(null)
      if (!result.ok) {
        setHidden((prev) => ({ ...prev, [section]: previous }))
        setSectionError(t("sectionError"))
        return
      }
      router.refresh()
    })
  }

  function onMaintenanceChange(checked: boolean) {
    const previous = maintenance
    setMaintenance(checked)
    setMaintenanceError(null)

    startMaintenanceTransition(async () => {
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
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-forest">{t("sectionsTitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("sectionsDescription")}</p>
        </div>

        <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
          {CONTENT_SECTIONS.map((section) => (
            <li
              key={section}
              className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5"
            >
              <div>
                <Label htmlFor={`section-${section}`} className="text-sm font-medium">
                  {t(`sections.${section}`)}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isSectionPending && pendingSection === section
                    ? t("sectionSaving")
                    : hidden[section]
                      ? t("sectionHidden")
                      : t("sectionVisible")}
                </p>
              </div>
              <Switch
                id={`section-${section}`}
                checked={!hidden[section]}
                disabled={isSectionPending}
                onCheckedChange={(checked) => onSectionChange(section, !checked)}
                aria-label={t(`sections.${section}`)}
              />
            </li>
          ))}
        </ul>
        {sectionError ? (
          <p className="text-xs text-destructive" role="alert">
            {sectionError}
          </p>
        ) : null}
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
              {isMaintenancePending
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
            checked={!maintenance}
            disabled={isMaintenancePending}
            onCheckedChange={(checked) => onMaintenanceChange(!checked)}
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
