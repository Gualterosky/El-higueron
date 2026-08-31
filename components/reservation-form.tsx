"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertTriangle, CheckCircle2, CalendarDays, Users, Info, Mountain, CircleDot } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitReservationAction } from "@/lib/reservas/actions"
import {
  ACTIVITY_CATEGORIES,
  RESERVATION_TYPES,
  type ActivityCategory,
  type ReservationType,
} from "@/lib/reservas/types"

const PRICE_ESCALADA = 8000
const PRICE_CAMPING = 15000

type Props = {
  defaultType?: ActivityCategory
}

export function ReservationForm({ defaultType }: Props) {
  const t = useTranslations("Reservas.form")
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Top-level category chosen in the UI
  const [category, setCategory] = useState<ActivityCategory>(
    defaultType === "escalada" ? "escalada" : "camping",
  )

  // Min date for camping = tomorrow (24h advance). Computed once per mount so the
  // schema identity stays stable across renders.
  const minDate = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }, [])

  const schema = useMemo(
    () =>
      z
        .object({
          type: z.enum(RESERVATION_TYPES),
          name: z.string().min(2, t("errorMin2")).max(100),
          contactInfo: z.string().min(5, t("errorRequired")).max(200),
          numberOfPeople: z.coerce.number().int().min(1, t("errorMin1")).max(50),
          arrivalDate: z.string().min(1, t("errorRequired")),
          departureDate: z.string().optional(),
          mayStayExtra: z.boolean().optional(),
          notes: z.string().max(500).optional(),
        })
        .refine(
          (data) => data.type !== "camping" || data.arrivalDate >= minDate,
          { message: t("errorCampingAdvance"), path: ["arrivalDate"] },
        )
        .refine(
          (data) =>
            !data.departureDate ||
            !data.arrivalDate ||
            data.departureDate >= data.arrivalDate,
          { message: t("errorDepartureBeforeArrival"), path: ["departureDate"] },
        ),
    [t, minDate],
  )

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultType === "escalada" ? undefined : "camping",
      numberOfPeople: 1,
      mayStayExtra: false,
    },
  })

  const type = form.watch("type") as ReservationType | undefined
  const numberOfPeople = form.watch("numberOfPeople") ?? 1
  const arrivalDate = form.watch("arrivalDate")
  const departureDate = form.watch("departureDate")

  const isCamping = type === "camping"
  const isEscalada = type === "muro" || type === "boulder"

  // Nights for camping price estimate
  function calcNights() {
    if (!arrivalDate) return 0
    if (!departureDate) return 1
    const diff = Math.round(
      (new Date(departureDate).getTime() - new Date(arrivalDate).getTime()) /
        (1000 * 60 * 60 * 24),
    )
    return diff > 0 ? diff : 1
  }

  const nights = isCamping ? calcNights() : 1
  const pricePerPerson = isCamping ? PRICE_CAMPING : PRICE_ESCALADA
  const totalPrice = (numberOfPeople > 0 ? numberOfPeople : 0) * pricePerPerson * nights

  // Intl.NumberFormat is expensive to build; keep a single instance per mount.
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }),
    [],
  )
  const formatPrice = (n: number) => priceFormatter.format(n)

  function handleCategoryChange(cat: ActivityCategory) {
    setCategory(cat)
    if (cat === "camping") {
      form.setValue("type", "camping", { shouldValidate: false })
    } else {
      // Clear type so user must pick muro or boulder
      form.setValue("type", undefined as unknown as ReservationType, { shouldValidate: false })
    }
    form.clearErrors("type")
  }

  function handleModalityChange(modality: "muro" | "boulder") {
    form.setValue("type", modality, { shouldValidate: true })
  }

  async function onSubmit(data: FormValues) {
    setServerError(null)
    try {
      const result = await submitReservationAction({
        type: data.type,
        name: data.name,
        contactInfo: data.contactInfo,
        numberOfPeople: data.numberOfPeople,
        arrivalDate: data.arrivalDate,
        departureDate: data.departureDate,
        mayStayExtra: data.mayStayExtra,
        notes: data.notes,
      })
      if (result.ok) {
        setSubmitted(true)
      } else {
        setServerError(t("errorGeneral"))
      }
    } catch {
      setServerError(t("errorGeneral"))
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-forest/10 p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-forest" />
        <h3 className="mb-2 text-xl font-semibold text-forest">{t("successTitle")}</h3>
        <p className="text-muted-foreground">{t("successBody")}</p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Step 1: Activity category ── */}
      <div className="space-y-2">
        <Label>
          {t("type")} <span className="text-destructive">*</span>
        </Label>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACTIVITY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all",
                category === cat
                  ? "border-forest bg-forest/5"
                  : "border-border hover:border-forest/40",
              )}
            >
              <span className="block font-semibold text-foreground">
                {t(`types.${cat}`)}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(`typesHint.${cat}`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Step 2: Escalada modality ── */}
      {category === "escalada" && (
        <div className="space-y-2">
          <Label>
            {t("modality")} <span className="text-destructive">*</span>
          </Label>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleModalityChange("muro")}
              className={cn(
                "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                type === "muro"
                  ? "border-orange bg-orange/5"
                  : "border-border hover:border-orange/40",
              )}
            >
              <Mountain className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden />
              <div>
                <span className="block font-semibold text-foreground">
                  {t("modalities.muro")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("modalitiesHint.muro")}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleModalityChange("boulder")}
              className={cn(
                "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                type === "boulder"
                  ? "border-orange bg-orange/5"
                  : "border-border hover:border-orange/40",
              )}
            >
              <CircleDot className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden />
              <div>
                <span className="block font-semibold text-foreground">
                  {t("modalities.boulder")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("modalitiesHint.boulder")}
                </span>
              </div>
            </button>
          </div>
          {form.formState.errors.type && (
            <p className="text-xs text-destructive" role="alert">
              {t("errorModalityRequired")}
            </p>
          )}
        </div>
      )}

      {/* ── Important note ── */}
      <div className="flex gap-3 rounded-xl border border-orange/30 bg-orange/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden />
        <div>
          <p className="mb-1 text-sm font-semibold text-foreground">{t("importantTitle")}</p>
          <p className="text-sm text-muted-foreground">{t("importantText")}</p>
        </div>
      </div>

      {/* ── Contextual notices ── */}
      {isCamping && (
        <div className="flex gap-3 rounded-xl border border-forest/30 bg-forest/5 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-forest" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("campingAdvanceNote")}</p>
        </div>
      )}
      {isEscalada && (
        <div className="flex gap-3 rounded-xl border border-forest/30 bg-forest/5 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-forest" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("escaladaOptionalNote")}</p>
        </div>
      )}

      {/* ── Name ── */}
      <div className="space-y-1.5">
        <Label htmlFor="name">
          {t("name")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder={t("namePlaceholder")}
          suppressHydrationWarning
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive" role="alert">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* ── Dates ── */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="arrivalDate">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-forest" />
              {t("arrivalDate")} <span className="text-destructive">*</span>
            </span>
          </Label>
          <Input
            id="arrivalDate"
            type="date"
            min={isCamping ? minDate : undefined}
            suppressHydrationWarning
            {...form.register("arrivalDate")}
          />
          {form.formState.errors.arrivalDate && (
            <p className="text-xs text-destructive" role="alert">
              {form.formState.errors.arrivalDate.message}
            </p>
          )}
        </div>

        {isCamping && (
          <div className="space-y-1.5">
            <Label htmlFor="departureDate">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-forest" />
                {t("departureDate")}
              </span>
            </Label>
            <Input
              id="departureDate"
              type="date"
              min={arrivalDate || minDate}
              suppressHydrationWarning
              {...form.register("departureDate")}
            />
            <p className="text-xs text-muted-foreground">{t("departureDateHint")}</p>
            {form.formState.errors.departureDate && (
              <p className="text-xs text-destructive" role="alert">
                {form.formState.errors.departureDate.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── May stay extra day (camping only) ── */}
      {isCamping && (
        <div className="flex items-start gap-3">
          <input
            id="mayStayExtra"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border accent-forest"
            {...form.register("mayStayExtra")}
          />
          <div>
            <Label htmlFor="mayStayExtra" className="cursor-pointer">
              {t("mayStayExtra")}
            </Label>
            <p className="text-xs text-muted-foreground">{t("mayStayExtraHint")}</p>
          </div>
        </div>
      )}

      {/* ── Number of people ── */}
      <div className="space-y-1.5">
        <Label htmlFor="numberOfPeople">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-forest" />
            {t("numberOfPeople")} <span className="text-destructive">*</span>
          </span>
        </Label>
        <Input
          id="numberOfPeople"
          type="number"
          min={1}
          max={50}
          suppressHydrationWarning
          {...form.register("numberOfPeople")}
        />
        {form.formState.errors.numberOfPeople && (
          <p className="text-xs text-destructive" role="alert">
            {form.formState.errors.numberOfPeople.message}
          </p>
        )}
      </div>

      {/* ── Price estimate (shown once type is fully resolved) ── */}
      {(isCamping || isEscalada) && numberOfPeople > 0 && arrivalDate && (
        <div className="rounded-xl border border-border bg-muted/30 px-5 py-4">
          <p className="mb-1 text-sm font-medium text-foreground">{t("priceEstimate")}</p>
          <p className="text-2xl font-bold text-forest">{formatPrice(totalPrice)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isCamping
              ? t("priceBreakdownCamping", {
                  people: numberOfPeople,
                  nights,
                  price: formatPrice(pricePerPerson),
                })
              : t("priceBreakdownEscalada", {
                  people: numberOfPeople,
                  price: formatPrice(pricePerPerson),
                })}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{t("priceNote")}</p>
        </div>
      )}

      {/* ── Notes ── */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">{t("notes")}</Label>
        <Textarea
          id="notes"
          placeholder={t("notesPlaceholder")}
          rows={3}
          {...form.register("notes")}
        />
        <p className="text-xs text-muted-foreground">{t("notesHint")}</p>
      </div>

      {/* ── Contact ── */}
      <div className="space-y-1.5">
        <Label htmlFor="contactInfo">
          {t("contactInfo")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contactInfo"
          placeholder={t("contactInfoPlaceholder")}
          suppressHydrationWarning
          autoComplete="off"
          {...form.register("contactInfo")}
        />
        <p className="text-xs text-muted-foreground">{t("contactInfoHint")}</p>
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
        size="lg"
        className="w-full bg-forest text-white hover:bg-forest/90"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  )
}
