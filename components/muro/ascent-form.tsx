"use client"

import { useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Star, CheckCircle2, Link2, CheckCircle, Upload } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getMuroRouteOptions } from "@/lib/muro/routes"
import { submitClimbPostAction } from "@/lib/muro/post-actions"
import { MultiSelectPopover } from "@/components/posts/multi-select-popover"
import { detectPlatform } from "@/components/muro/social-embed"
import { MediaUploader } from "@/components/muro/media-uploader"
import { PostCategoryField, UrgencyLevelField } from "@/components/posts/post-category-field"
import {
  CATEGORY_REQUIRES_RATING,
  CATEGORY_REQUIRES_URGENCY,
  type PostCategory,
  type UrgencyLevel,
} from "@/lib/posts/shared"

type Props = {
  /** Route(s) preselected when this form is embedded in a specific route page.
   *  Left empty (or omitted) on the aggregated /muro form, where tagging a
   *  route is optional and the visitor can pick several. */
  defaultRouteIds?: string[]
}

/** Mirrors the zod schema built inside AscentForm (translated error messages only affect
 *  validation messages, not the shape), so it can be shared with child components. */
type AscentFormValues = {
  authorName: string
  ascentDate: string
  routeIds: string[]
  category: PostCategory
  comment: string
  contactInfo: string
  rating: number
  urgencyLevel?: UrgencyLevel
  socialMediaUrl?: string
}

export function AscentForm({ defaultRouteIds = [] }: Props) {
  const t = useTranslations("MuroRoute")
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [hovered, setHovered] = useState(0)
  const [showSocialInput, setShowSocialInput] = useState(false)
  const [showUploadInput, setShowUploadInput] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(defaultRouteIds)

  const routeOptions = getMuroRouteOptions()

  const schema = z
    .object({
      authorName: z.string().min(2, t("ascentForm.errorMin2")).max(100),
      ascentDate: z.string().min(1, t("ascentForm.errorRequired")),
      routeIds: z.array(z.string()).max(20),
      category: z.enum(["incident", "review", "tip", "question"]),
      comment: z.string().min(5, t("ascentForm.errorMin5")).max(2000),
      contactInfo: z.string().min(3, t("ascentForm.errorRequired")).max(200),
      rating: z.number().int().min(0).max(5),
      urgencyLevel: z.enum(["low", "medium", "high", "critical"]).optional(),
      socialMediaUrl: z
        .string()
        .refine((v) => !v || v.startsWith("https://"), {
          message: t("ascentForm.errorUrlInvalid"),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.category === CATEGORY_REQUIRES_RATING && (data.rating < 1 || data.rating > 5)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rating"],
          message: t("ascentForm.errorRating"),
        })
      }
      if (data.category === CATEGORY_REQUIRES_URGENCY && !data.urgencyLevel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["urgencyLevel"],
          message: t("ascentForm.errorRequired"),
        })
      }
    })

  const form = useForm<AscentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      routeIds: defaultRouteIds,
      category: "review",
      rating: 0,
    },
  })

  const rating = form.watch("rating")
  const category = form.watch("category")

  function handleRoutesChange(next: string[]) {
    setSelectedRoutes(next)
    form.setValue("routeIds", next, { shouldValidate: true })
  }

  async function onSubmit(data: AscentFormValues) {
    setServerError(null)
    try {
      const result = await submitClimbPostAction({
        ...data,
        mediaUrls: uploadedUrls.length > 0 ? uploadedUrls : null,
      })
      if (result.ok) {
        setSubmitted(true)
      } else {
        setServerError("error" in result ? result.error : t("ascentForm.errorGeneral"))
      }
    } catch {
      setServerError(t("ascentForm.errorGeneral"))
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-forest/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-forest" />
        <h4 className="mb-2 font-semibold text-forest">{t("ascentForm.successTitle")}</h4>
        <p className="text-sm text-muted-foreground">{t("ascentForm.successBody")}</p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <PostCategoryField
        value={category}
        onChange={(v) => form.setValue("category", v, { shouldValidate: true })}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="authorName">
            {t("ascentForm.authorName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="authorName"
            placeholder={t("ascentForm.authorNamePlaceholder")}
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
          <Label htmlFor="ascentDate">
            {t("ascentForm.ascentDate")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ascentDate"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            suppressHydrationWarning
            {...form.register("ascentDate")}
          />
          {form.formState.errors.ascentDate && (
            <p className="text-xs text-destructive" role="alert">
              {form.formState.errors.ascentDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t("ascentForm.routeIds")}</Label>
        <p className="text-xs text-muted-foreground">{t("ascentForm.routeIdsHint")}</p>
        <MultiSelectPopover
          options={routeOptions.map((option) => ({
            value: option.value,
            label: `${t(`${option.baseId}.routeName` as Parameters<typeof t>[0])}${option.subLevel ? ` ${option.subLevel}` : ""}`,
          }))}
          selected={selectedRoutes}
          onChange={handleRoutesChange}
          placeholder={t("ascentForm.routeSelectPlaceholder")}
          selectedLabel={(count) => t("ascentForm.routeSelectedCount", { count })}
        />
        {form.formState.errors.routeIds && (
          <p className="text-xs text-destructive" role="alert">
            {form.formState.errors.routeIds.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="comment">
          {t("ascentForm.comment")} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="comment"
          placeholder={t("ascentForm.commentPlaceholder")}
          rows={4}
          {...form.register("comment")}
        />
        {form.formState.errors.comment && (
          <p className="text-xs text-destructive" role="alert">
            {form.formState.errors.comment.message}
          </p>
        )}
      </div>

      {category === CATEGORY_REQUIRES_RATING && (
        <div className="space-y-2">
          <Label>
            {t("ascentForm.rating")} <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => form.setValue("rating", star, { shouldValidate: true })}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`${star} de 5 estrellas`}
                className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hovered || rating) >= star
                      ? "fill-orange text-orange"
                      : "text-muted-foreground/40"
                  )}
                />
              </button>
            ))}
          </div>
          {form.formState.errors.rating && (
            <p className="text-xs text-destructive" role="alert">
              {form.formState.errors.rating.message}
            </p>
          )}
        </div>
      )}

      {category === CATEGORY_REQUIRES_URGENCY && (
        <UrgencyLevelField
          value={form.watch("urgencyLevel")}
          onChange={(v) => form.setValue("urgencyLevel", v, { shouldValidate: true })}
          error={form.formState.errors.urgencyLevel?.message}
        />
      )}

      <div className="space-y-1.5">
        <Label htmlFor="contactInfo">
          {t("ascentForm.contactInfo")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contactInfo"
          placeholder={t("ascentForm.contactInfoPlaceholder")}
          suppressHydrationWarning
          autoComplete="off"
          {...form.register("contactInfo")}
        />
        <p className="text-xs text-muted-foreground">{t("ascentForm.contactInfoHint")}</p>
        {form.formState.errors.contactInfo && (
          <p className="text-xs text-destructive" role="alert">
            {form.formState.errors.contactInfo.message}
          </p>
        )}
      </div>

      {/* ── Multimedia ── */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{t("ascentForm.mediaSection")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (showSocialInput) form.setValue("socialMediaUrl", "")
              setShowSocialInput((v) => !v)
            }}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              showSocialInput
                ? "border-forest bg-forest/10 text-forest"
                : "border-border text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Link2 className="h-4 w-4" />
            {t("ascentForm.mediaTypeSocial")}
          </button>

          <button
            type="button"
            onClick={() => {
              if (showUploadInput) setUploadedUrls([])
              setShowUploadInput((v) => !v)
            }}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              showUploadInput
                ? "border-forest bg-forest/10 text-forest"
                : "border-border text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Upload className="h-4 w-4" />
            {t("ascentForm.mediaTypeUpload")}
          </button>
        </div>

        {showSocialInput && <SocialUrlField form={form} t={t} />}
        {showUploadInput && <MediaUploader onUrlsChange={setUploadedUrls} />}
      </div>

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
        {form.formState.isSubmitting ? t("ascentForm.submitting") : t("ascentForm.submit")}
      </Button>
    </form>
  )
}

type SocialUrlFieldProps = {
  form: UseFormReturn<AscentFormValues>
  t: ReturnType<typeof useTranslations>
}

function SocialUrlField({ form, t }: SocialUrlFieldProps) {
  const url: string = form.watch("socialMediaUrl") ?? ""
  const platform = url.startsWith("https://") ? detectPlatform(url) : null

  const platformLabels: Record<string, string> = {
    youtube: t("ascentForm.socialPlatformYoutube"),
    instagram: t("ascentForm.socialPlatformInstagram"),
    facebook: t("ascentForm.socialPlatformFacebook"),
    tiktok: t("ascentForm.socialPlatformTiktok"),
    vimeo: t("ascentForm.socialPlatformVimeo"),
    unknown: t("ascentForm.socialPlatformUnknown"),
  }

  return (
    <div className="space-y-1.5 pt-1">
      <Input
        type="url"
        placeholder={t("ascentForm.socialMediaUrlPlaceholder")}
        suppressHydrationWarning
        {...form.register("socialMediaUrl")}
      />
      {platform && (
        <p className="flex items-center gap-1 text-xs text-forest">
          <CheckCircle className="h-3 w-3" />
          {platformLabels[platform]}
        </p>
      )}
      <p className="text-xs text-muted-foreground">{t("ascentForm.socialMediaUrlHint")}</p>
      {form.formState.errors.socialMediaUrl && (
        <p className="text-xs text-destructive" role="alert">
          {form.formState.errors.socialMediaUrl.message}
        </p>
      )}
    </div>
  )
}
