"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { REVIEW_SOURCES, type ReviewSort, type ReviewSource } from "@/lib/reviews/types"

type PlainReview = {
  id: string
  source: ReviewSource
  rating: number
  comment: string
  authorName: string
  createdAt: string
}

type Props = {
  reviews: PlainReview[]
  averageRating: number
}

const PAGE_SIZE = 6

export function PublicReviewsClient({ reviews, averageRating }: Props) {
  const t = useTranslations("Home.reviews")
  const tSources = useTranslations("Home.reviews.sources")

  const [sort, setSort] = useState<ReviewSort>("recent")
  const [sourceFilter, setSourceFilter] = useState<"all" | ReviewSource>("all")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filteredAndSorted = useMemo(() => {
    const filtered =
      sourceFilter === "all" ? reviews : reviews.filter((r) => r.source === sourceFilter)

    return [...filtered].sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating
      if (sort === "lowest") return a.rating - b.rating
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [reviews, sourceFilter, sort])

  const visibleReviews = filteredAndSorted.slice(0, visibleCount)

  return (
    <div>
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-forest">{averageRating.toFixed(1)}</span>
          <StarRow rating={Math.round(averageRating)} />
        </div>
        <p className="text-sm text-muted-foreground">{t("basedOn", { count: reviews.length })}</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v as "all" | ReviewSource); setVisibleCount(PAGE_SIZE) }}>
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder={t("filterLabel")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            {REVIEW_SOURCES.map((source) => (
              <SelectItem key={source} value={source}>
                {tSources(source)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as ReviewSort)}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder={t("sortLabel")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">{t("sort.recent")}</SelectItem>
            <SelectItem value="highest">{t("sort.highest")}</SelectItem>
            <SelectItem value="lowest">{t("sort.lowest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {visibleReviews.length === 0 ? (
        <p className="text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map((review) => (
            <Card key={`${review.source}-${review.id}`} className="border-none bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <StarRow rating={review.rating} size="sm" />
                  <Badge variant="secondary">{tSources(review.source)}</Badge>
                </div>
                <p className="mb-4 line-clamp-4 text-sm text-muted-foreground">{review.comment}</p>
                <p className="text-sm font-semibold text-forest">{review.authorName}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {visibleCount < filteredAndSorted.length ? (
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            className="border-forest text-forest hover:bg-forest hover:text-white"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            {t("showMore")}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function StarRow({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "h-4 w-4" : "h-6 w-6"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(starSize, s <= rating ? "fill-orange text-orange" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  )
}
