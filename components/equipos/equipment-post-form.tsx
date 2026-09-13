"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Star, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ContactField } from "@/components/contact-field"
import { submitEquipmentPostAction } from "@/lib/equipos/post-actions"

export function EquipmentPostForm() {
  const t = useTranslations("EquipmentPost")
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [hovered, setHovered] = useState(0)

  const schema = z.object({
    authorName: z.string().min(2, t("form.errorMin2")).max(100),
    comment: z.string().min(5, t("form.errorMin5")).max(2000),
    contactInfo: z.string().min(3, t("form.errorRequired")).max(200),
    rating: z.number().int().min(1, t("form.errorRating")).max(5),
  })

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 0,
    },
  })

  const rating = form.watch("rating")

  async function onSubmit(data: FormValues) {
    setServerError(null)
    try {
      const result = await submitEquipmentPostAction(data)
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
      <div className="space-y-1.5">
        <Label htmlFor="equipmentAuthorName">
          {t("form.authorName")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="equipmentAuthorName"
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
        <Label htmlFor="equipmentComment">
          {t("form.comment")} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="equipmentComment"
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

      <ContactField
        control={form.control}
        name="contactInfo"
        label={`${t("form.contactInfo")} *`}
        placeholder={t("form.contactInfoPlaceholder")}
        hint={t("form.contactInfoHint")}
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
        {form.formState.isSubmitting ? t("form.submitting") : t("form.submit")}
      </Button>
    </form>
  )
}
