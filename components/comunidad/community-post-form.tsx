"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ContactField } from "@/components/contact-field"
import { MultiSelectPopover } from "@/components/posts/multi-select-popover"
import { submitCommunityPostAction } from "@/lib/comunidad/post-actions"
import {
  ACTIVITY_LOGISTICS_TAGS,
  COMMUNITY_ACTIVITIES,
  EXPERIENCE_LEVELS,
  todayIsoDate,
  type CommunityActivity,
  type ExperienceLevel,
} from "@/lib/comunidad/shared"

type FormValues = {
  authorName: string
  contactInfo: string
  activity: CommunityActivity
  eventDate: string
  locationText: string
  level?: ExperienceLevel
  gradeDetail?: string
  logisticsTags: string[]
  maxParticipants?: number
  notes?: string
}

type Props = {
  /** Preselects the activity, e.g. when arriving from a CTA banner on
   *  /muro, /boulder or /camping via ?activity=. */
  defaultActivity?: CommunityActivity
}

export function CommunityPostForm({ defaultActivity }: Props) {
  const t = useTranslations("Comunidad.form")
  const tActivities = useTranslations("Comunidad.activities")
  const tLevels = useTranslations("Comunidad.levels")
  const tTags = useTranslations("Comunidad.logisticsTags")
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const minDate = todayIsoDate()

  const schema = z.object({
    authorName: z.string().min(2, t("errorMin2")).max(100),
    contactInfo: z.string().min(3, t("errorRequired")).max(200),
    activity: z.enum(COMMUNITY_ACTIVITIES),
    eventDate: z.string().min(1, t("errorRequired")).refine((v) => v >= minDate, {
      message: t("errorDatePast"),
    }),
    locationText: z.string().max(200).default(""),
    level: z.enum(EXPERIENCE_LEVELS).optional(),
    gradeDetail: z.string().max(100).optional(),
    logisticsTags: z.array(z.string()).max(20),
    maxParticipants: z.coerce.number().int().min(1).max(50).optional(),
    notes: z.string().max(2000).optional(),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      activity: defaultActivity ?? "escalada_deportiva",
      locationText: "",
      logisticsTags: [],
    },
  })

  const activity = form.watch("activity")
  const logisticsTags = form.watch("logisticsTags") ?? []
  const tagOptions = ACTIVITY_LOGISTICS_TAGS[activity].map((tag) => ({
    value: tag,
    label: tTags(tag as Parameters<typeof tTags>[0]),
  }))

  function handleActivityChange(next: CommunityActivity) {
    form.setValue("activity", next, { shouldValidate: true })
    // Logistics tags are activity-specific; clear stale picks from the previous activity.
    form.setValue("logisticsTags", [], { shouldValidate: true })
  }

  async function onSubmit(data: FormValues) {
    setServerError(null)
    try {
      const result = await submitCommunityPostAction({
        ...data,
        locationText: data.locationText ?? "",
        logisticsTags: data.logisticsTags ?? [],
      })
      if (result.ok) {
        setSubmitted(true)
      } else {
        setServerError("error" in result ? result.error : t("errorGeneral"))
      }
    } catch {
      setServerError(t("errorGeneral"))
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-forest/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-forest" />
        <h4 className="mb-2 font-semibold text-forest">{t("successTitle")}</h4>
        <p className="text-sm text-muted-foreground">{t("successBody")}</p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="communityAuthorName">
            {t("authorName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="communityAuthorName"
            placeholder={t("authorNamePlaceholder")}
            suppressHydrationWarning
            {...form.register("authorName")}
          />
          {form.formState.errors.authorName && (
            <p className="text-xs text-destructive" role="alert">
              {form.formState.errors.authorName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="communityEventDate">
            {t("eventDate")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="communityEventDate"
            type="date"
            min={minDate}
            suppressHydrationWarning
            {...form.register("eventDate")}
          />
          {form.formState.errors.eventDate && (
            <p className="text-xs text-destructive" role="alert">
              {form.formState.errors.eventDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>
          {t("activity")} <span className="text-destructive">*</span>
        </Label>
        <Select value={activity} onValueChange={(v) => handleActivityChange(v as CommunityActivity)}>
          <SelectTrigger>
            <SelectValue placeholder={t("activityPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {COMMUNITY_ACTIVITIES.map((value) => (
              <SelectItem key={value} value={value}>
                {tActivities(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="communityLocation">{t("locationText")}</Label>
        <Input
          id="communityLocation"
          placeholder={t("locationPlaceholder")}
          suppressHydrationWarning
          {...form.register("locationText")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{t("level")}</Label>
          <Select
            value={form.watch("level")}
            onValueChange={(v) => form.setValue("level", v as ExperienceLevel, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("levelPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((value) => (
                <SelectItem key={value} value={value}>
                  {tLevels(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="communityGradeDetail">{t("gradeDetail")}</Label>
          <Input
            id="communityGradeDetail"
            placeholder={t("gradeDetailPlaceholder")}
            suppressHydrationWarning
            {...form.register("gradeDetail")}
          />
        </div>
      </div>

      {tagOptions.length > 0 && (
        <div className="space-y-1.5">
          <Label>{t("logisticsTags")}</Label>
          <p className="text-xs text-muted-foreground">{t("logisticsTagsHint")}</p>
          <MultiSelectPopover
            options={tagOptions}
            selected={logisticsTags}
            onChange={(next) => form.setValue("logisticsTags", next, { shouldValidate: true })}
            placeholder={t("logisticsTagsHint")}
            selectedLabel={(count) => `${count}`}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="communityMaxParticipants">{t("maxParticipants")}</Label>
        <Input
          id="communityMaxParticipants"
          type="number"
          min={1}
          max={50}
          placeholder={t("maxParticipantsPlaceholder")}
          suppressHydrationWarning
          {...form.register("maxParticipants")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="communityNotes">{t("notes")}</Label>
        <Textarea
          id="communityNotes"
          placeholder={t("notesPlaceholder")}
          rows={4}
          {...form.register("notes")}
        />
      </div>

      <ContactField
        control={form.control}
        name="contactInfo"
        label={`${t("contactInfo")} *`}
        placeholder={t("contactInfoPlaceholder")}
        hint={t("contactInfoHint")}
      />

      {serverError && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-orange text-white hover:bg-orange/90"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  )
}
