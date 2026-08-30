"use client"

import { useTranslations } from "next-intl"
import { Construction, Newspaper } from "lucide-react"
import { Badge } from "@/components/ui/badge"

/** Ghost post cards to illustrate the eventual layout. */
const SKELETON_POSTS = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
]

export function StaffPublicacionesPanel() {
  const t = useTranslations("Panel")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold text-forest">
            {t("staff.publicaciones.title")}
          </h2>
          <Badge variant="secondary">{t("comingSoon")}</Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          {t("staff.publicaciones.description")}
        </p>
      </div>

      {/* Draft banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50/60 px-4 py-3">
        <Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <p className="text-sm text-amber-800">{t("draftBanner")}</p>
      </div>

      {/* Skeleton post cards */}
      <div className="space-y-3 opacity-40">
        {SKELETON_POSTS.map((post) => (
          <div
            key={post.id}
            className="flex items-start gap-4 rounded-xl border border-border/60 bg-beige/20 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
              <Newspaper className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-4 w-32 rounded-md bg-muted/60" />
                <Badge variant="secondary" className="opacity-60">—</Badge>
              </div>
              <div className="h-3 w-48 rounded-md bg-muted/40" />
              <div className="h-3 w-full max-w-sm rounded-md bg-muted/30" />
            </div>
            <div className="flex shrink-0 gap-1">
              <div className="h-8 w-8 rounded-md bg-muted/40" />
              <div className="h-8 w-8 rounded-md bg-muted/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
