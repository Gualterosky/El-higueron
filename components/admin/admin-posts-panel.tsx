"use client"

import { useTranslations } from "next-intl"
import { Check, EyeOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ComingSoonBadge } from "@/components/admin/coming-soon-badge"

const MOCK_POSTS = [
  {
    id: "1",
    author: "Natalia Quintero",
    title: "Atardecer desde la zona alta",
    excerpt:
      "Compartimos unas fotos del cielo naranja sobre el camping. ¡Imperdible al final del día!",
    date: "2026-08-08",
    status: "pending",
  },
  {
    id: "2",
    author: "Felipe Castro",
    title: "Primera vez en el muro MBS09",
    excerpt:
      "Logramos completar la vía después de un par de intentos. El equipo de apoyo fue excelente.",
    date: "2026-08-05",
    status: "approved",
  },
  {
    id: "3",
    author: "Elena Marín",
    title: "Tips para acampar con niños",
    excerpt:
      "Llevamos a nuestros hijos el fin de semana y estas son las cosas que nos facilitaron la estadía.",
    date: "2026-07-30",
    status: "hidden",
  },
] as const

export function AdminPostsPanel() {
  const t = useTranslations("Panel.posts")

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
        {MOCK_POSTS.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-4 rounded-xl border border-border/60 bg-beige/20 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5"
          >
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-forest">{post.title}</h3>
                <Badge
                  variant={
                    post.status === "approved"
                      ? "default"
                      : post.status === "hidden"
                        ? "secondary"
                        : "outline"
                  }
                  className={
                    post.status === "approved"
                      ? "border-transparent bg-forest text-white"
                      : undefined
                  }
                >
                  {t(`status.${post.status}`)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {post.author} · {post.date}
              </p>
              <p className="text-sm leading-relaxed text-foreground">{post.excerpt}</p>
            </div>

            <div className="flex shrink-0 gap-1">
              <Button type="button" variant="ghost" size="icon" disabled aria-label={t("approve")}>
                <Check className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" disabled aria-label={t("hide")}>
                <EyeOff className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled
                aria-label={t("delete")}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
