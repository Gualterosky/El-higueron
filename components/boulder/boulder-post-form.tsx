"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Star, CheckCircle2, Link2, CheckCircle, Upload } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitBoulderPostAction } from "@/lib/boulder/post-actions"
import { detectPlatform } from "@/components/muro/social-embed"
import { MediaUploader } from "@/components/muro/media-uploader"
import { PostCategoryField, UrgencyLevelField } from "@/components/posts/post-category-field"
import { CATEGORY_REQUIRES_RATING, CATEGORY_REQUIRES_URGENCY } from "@/lib/posts/shared"

export function BoulderPostForm() {
  const t = useTranslations("BoulderPost")
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [hovered, setHovered] = useState(0)
  const [showSocialInput, setShowSocialInput] = useState(false)
  const [showUploadInput, setShowUploadInput] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  const schema = z
    .object({
      authorName: z.string().min(2, t("form.errorMin2")).max(100),
      visitDate: z.string().min(1, t("form.errorRequired")),
      boulderName: z.string().min(1, t("form.errorRequired")).max(200),
      routeName: z.string().min(1, t("form.errorRequired")).max(200),
      category: z.enum(["incident", "review", "tip", "question"]),
      comment: z.string().min(5, t("form.errorMin5")).max(2000),
      contactInfo: z.string().min(3, t("form.errorRequired")).max(200),
      rating: z.number().int().min(0).max(5),
      urgencyLevel: z.enum(["low", "medium", "high", "critical"]).optional(),
      socialMediaUrl: z
        .string()
        .refine((v) => !v || v.startsWith("https://"), {
          message: t("form.errorUrlInvalid"),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.category === CATEGORY_REQUIRES_RATING && (data.rating < 1 || data.rating > 5)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rating"], message: t("form.errorRating") })
      }
      if (data.category === CATEGORY_REQUIRES_URGENCY && !data.urgencyLevel) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["urgencyLevel"], message: t("form.errorRequired") })
      }
    })

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "review",
      rating: 0,
    },
  })

  const rating = form.watch("rating")
  const category = form.watch("category")

  async function onSubmit(data: FormValues) {
    setServerError(null)
    try {
      const result = await submitBoulderPostAction({
        ...data,
        mediaUrls: uploadedUrls.length > 0 ? uploadedUrls : null,
      })
      if (result.ok) {
        setSubmitted(true)
      } else {
        setServerError("error" in result ? result.error : t("form.errorGeneral"))
      }
    } catch {
      setServerError(t("form.errorGeneral"))
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-forest/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-forest" />
        <h4 className="mb-2 font-semibold text-forest">{t("form.successTitle")}</h4>
        <p className="text-sm text-muted-foreground">{t("form.successBody")}</p>
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
          <Label htmlFor="boulderAuthorName">
            {t("form.authorName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="boulderAuthorName"
            placeholder={t("form.authorNamePlaceholder")}
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
          <Label htmlFor="boulderVisitDate">
            {t("form.visitDate")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="boulderVisitDate"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            suppressHydrationWarning
            {...form.register("visitDate")}
          />
          {form.formState.errors.visitDate && (
            <p className="text-xs text-destructive" role="alert">
              {form.formState.errors.visitDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="boulderName">
            {t("form.boulderName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="boulderName"
            placeholder={t("form.boulderNamePlaceholder")}
            suppressHydrationWarning
            {...form.register("boulderName")}
          />
          <p className="text-xs text-muted-foreground">{t("form.boulderNameHint")}</p>
          {form.formState.errors.boulderName && (
            <p className="text-xs text-destructive" role="alert">
              {form.formState.errors.boulderName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="routeName">
            {t("form.routeName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="routeName"
            placeholder={t("form.routeNamePlaceholder")}
            suppressHydrationWarning
            {...form.register("routeName")}
          />
          <p className="text-xs text-muted-foreground">{t("form.routeNameHint")}</p>
          {form.formState.errors.routeName && (
            <p className="text-xs text-destructive" role="alert">
              {form.formState.errors.routeName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="boulderComment">
          {t("form.comment")} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="boulderComment"
          placeholder={t("form.commentPlaceholder")}
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
            {t("form.rating")} <span className="text-destructive">*</span>
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
        <Label htmlFor="boulderContactInfo">
          {t("form.contactInfo")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="boulderContactInfo"
          placeholder={t("form.contactInfoPlaceholder")}
          suppressHydrationWarning
          autoComplete="off"
          {...form.register("contactInfo")}
        />
        <p className="text-xs text-muted-foreground">{t("form.contactInfoHint")}</p>
        {form.formState.errors.contactInfo && (
          <p className="text-xs text-destructive" role="alert">
            {form.formState.errors.contactInfo.message}
          </p>
        )}
      </div>

      {/* ── Multimedia ── */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{t("form.mediaSection")}</p>
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
            {t("form.mediaTypeSocial")}
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
            {t("form.mediaTypeUpload")}
          </button>
        </div>

        {showSocialInput && <SocialUrlField form={form} t={t} />}
        {showUploadInput && (
          <MediaUploader
            onUrlsChange={setUploadedUrls}
            labels={{
              notConfigured: t("form.uploadNotConfigured"),
              dropHint: t("form.uploadDrop"),
              fileHint: t("form.uploadHint"),
            }}
          />
        )}
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
        {form.formState.isSubmitting ? t("form.submitting") : t("form.submit")}
      </Button>
    </form>
  )
}

type SocialUrlFieldProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
}

function SocialUrlField({ form, t }: SocialUrlFieldProps) {
  const url: string = form.watch("socialMediaUrl") ?? ""
  const platform = url.startsWith("https://") ? detectPlatform(url) : null

  const platformLabels: Record<string, string> = {
    youtube: "YouTube",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    vimeo: "Vimeo",
    unknown: t("form.socialPlatformUnknown"),
  }

  return (
    <div className="space-y-1.5 pt-1">
      <Input
        type="url"
        placeholder={t("form.socialMediaUrlPlaceholder")}
        suppressHydrationWarning
        {...form.register("socialMediaUrl")}
      />
      {platform && (
        <p className="flex items-center gap-1 text-xs text-forest">
          <CheckCircle className="h-3 w-3" />
          {platformLabels[platform]}
        </p>
      )}
      <p className="text-xs text-muted-foreground">{t("form.socialMediaUrlHint")}</p>
      {form.formState.errors.socialMediaUrl && (
        <p className="text-xs text-destructive" role="alert">
          {form.formState.errors.socialMediaUrl.message}
        </p>
      )}
    </div>
  )
}
