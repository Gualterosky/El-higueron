"use client"

import { AlertTriangle, HelpCircle, Lightbulb, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { POST_CATEGORIES, URGENCY_LEVELS, type PostCategory, type UrgencyLevel } from "@/lib/posts/shared"

const CATEGORY_ICONS: Record<PostCategory, typeof Star> = {
  incident: AlertTriangle,
  review: Star,
  tip: Lightbulb,
  question: HelpCircle,
}

type Props = {
  value: PostCategory
  onChange: (category: PostCategory) => void
}

/** Category selector shown at the top of every post form (muro/camping/boulder).
 *  Reused so the 5 categories and their copy stay consistent across the 3 flows. */
export function PostCategoryField({ value, onChange }: Props) {
  const t = useTranslations("PostCategories")

  return (
    <div className="space-y-2">
      <Label>{t("categoryLabel")}</Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {POST_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category]
          const selected = value === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center text-xs font-medium transition-colors",
                category === "incident" && selected
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : selected
                    ? "border-forest bg-forest/10 text-forest"
                    : "border-border text-muted-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-5 w-5" />
              {t(`${category}.label`)}
            </button>
          )
        })}
      </div>
      <p
        className={cn(
          "text-xs",
          value === "incident" ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {t(`${value}.description`)}
      </p>
    </div>
  )
}

type UrgencyProps = {
  value: UrgencyLevel | undefined
  onChange: (level: UrgencyLevel) => void
  error?: string
}

/** Urgency level selector, only rendered when category = "incident". */
export function UrgencyLevelField({ value, onChange, error }: UrgencyProps) {
  const t = useTranslations("PostCategories")

  return (
    <div className="space-y-1.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
      <Label>
        {t("urgencyLabel")} <span className="text-destructive">*</span>
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as UrgencyLevel)}>
        <SelectTrigger>
          <SelectValue placeholder={t("urgencyPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {URGENCY_LEVELS.map((level) => (
            <SelectItem key={level} value={level}>
              {t(`urgency.${level}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">{t("urgencyHint")}</p>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
