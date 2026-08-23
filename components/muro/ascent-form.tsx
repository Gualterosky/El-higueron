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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MURO_ROUTES } from "@/lib/muro/routes"
import { submitClimbPostAction } from "@/lib/muro/post-actions"

type Props = {
  routeId: string
}

export function AscentForm({ routeId }: Props) {
  const t = useTranslations("MuroRoute")
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [hovered, setHovered] = useState(0)

  const schema = z.object({
    authorName: z.string().min(2, t("ascentForm.errorMin2")).max(100),
    ascentDate: z.string().min(1, t("ascentForm.errorRequired")),
    routeId: z.string().min(1, t("ascentForm.errorRequired")),
    comment: z.string().min(5, t("ascentForm.errorMin5")).max(2000),
    contactInfo: z.string().min(3, t("ascentForm.errorRequired")).max(200),
    rating: z.number().int().min(1, t("ascentForm.errorRating")).max(5),
  })

  type AscentFormValues = z.infer<typeof schema>

  const form = useForm<AscentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      routeId,
      rating: 0,
    },
  })

  const rating = form.watch("rating")

  async function onSubmit(data: AscentFormValues) {
    setServerError(null)
    const result = await submitClimbPostAction(data)
    if (result.ok) {
      setSubmitted(true)
    } else {
      setServerError("error" in result ? result.error : t("ascentForm.errorGeneral"))
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="authorName">
            {t("ascentForm.authorName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="authorName"
            placeholder={t("ascentForm.authorNamePlaceholder")}
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
        <Label>
          {t("ascentForm.routeId")} <span className="text-destructive">*</span>
        </Label>
        <Select
          defaultValue={routeId}
          onValueChange={(v) => form.setValue("routeId", v, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("ascentForm.routeSelectPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {MURO_ROUTES.map((route) => (
              <SelectItem key={route.id} value={route.id}>
                {route.id} — {t(`${route.id}.routeName` as Parameters<typeof t>[0])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.routeId && (
          <p className="text-xs text-destructive" role="alert">
            {form.formState.errors.routeId.message}
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

      <div className="space-y-1.5">
        <Label htmlFor="contactInfo">
          {t("ascentForm.contactInfo")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contactInfo"
          placeholder={t("ascentForm.contactInfoPlaceholder")}
          {...form.register("contactInfo")}
        />
        <p className="text-xs text-muted-foreground">{t("ascentForm.contactInfoHint")}</p>
        {form.formState.errors.contactInfo && (
          <p className="text-xs text-destructive" role="alert">
            {form.formState.errors.contactInfo.message}
          </p>
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
        {form.formState.isSubmitting ? t("ascentForm.submitting") : t("ascentForm.submit")}
      </Button>
    </form>
  )
}
