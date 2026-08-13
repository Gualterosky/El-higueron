"use client"

import { useTranslations } from "next-intl"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ComingSoonBadge } from "@/components/admin/coming-soon-badge"

const MOCK_REVIEWS = [
  {
    id: "1",
    author: "María Gómez",
    rating: 5,
    date: "2026-08-02",
    body: "Una experiencia increíble en el muro. El personal fue muy amable y el camping impecable.",
    status: "pending",
    reply: "",
  },
  {
    id: "2",
    author: "Andrés López",
    rating: 4,
    date: "2026-07-28",
    body: "Buen ambiente y rutas divertidas. Solo faltó un poco más de señalización en el acceso.",
    status: "replied",
    reply: "¡Gracias Andrés! Tomamos nota de la señalización para las próximas visitas.",
  },
  {
    id: "3",
    author: "Sofía Vargas",
    rating: 5,
    date: "2026-07-20",
    body: "Perfecto para desconectar. La fogata y las noches estrelladas valen todo el viaje.",
    status: "pending",
    reply: "",
  },
] as const

export function AdminReviewsPanel() {
  const t = useTranslations("Panel.reviews")

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
          <ComingSoonBadge />
        </div>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-4">
        {MOCK_REVIEWS.map((review) => (
          <article
            key={review.id}
            className="space-y-4 rounded-xl border border-border/60 bg-beige/20 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-forest">{review.author}</p>
                <p className="text-sm text-muted-foreground">
                  {t("rating", { count: review.rating })} · {review.date}
                </p>
              </div>
              <Badge
                variant={review.status === "pending" ? "secondary" : "default"}
                className={
                  review.status === "replied"
                    ? "border-transparent bg-forest text-white"
                    : undefined
                }
              >
                {t(`status.${review.status}`)}
              </Badge>
            </div>

            <p className="text-sm leading-relaxed text-foreground">{review.body}</p>

            {review.status === "replied" ? (
              <div className="rounded-lg border border-forest/20 bg-white px-3 py-2">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-forest">
                  {t("replyLabel")}
                </p>
                <p className="text-sm text-muted-foreground">{review.reply}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea
                  disabled
                  placeholder={t("replyPlaceholder")}
                  className="min-h-20 resize-none bg-white"
                />
                <Button
                  type="button"
                  disabled
                  className="gap-2 bg-forest text-white opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {t("sendReply")}
                </Button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
