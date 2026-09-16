"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { AlertTriangle, Star } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { REVIEW_SOURCES, type ReviewSource, type ReviewStats, type UnifiedReview } from "@/lib/reviews/types"

type Props = {
  initialReviews: UnifiedReview[]
  stats: ReviewStats
}

const RATINGS = [5, 4, 3, 2, 1] as const

export function AdminReviewsPanel({ initialReviews, stats }: Props) {
  const t = useTranslations("Panel.reviews")
  const tSources = useTranslations("Panel.reviews.sources")

  const [sourceFilter, setSourceFilter] = useState<"all" | ReviewSource>("all")
  const [ratingFilter, setRatingFilter] = useState<"all" | string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const filteredReviews = useMemo(() => {
    return initialReviews.filter((review) => {
      if (sourceFilter !== "all" && review.source !== sourceFilter) return false
      if (ratingFilter !== "all" && review.rating !== Number(ratingFilter)) return false
      if (dateFrom && review.createdAt < new Date(dateFrom)) return false
      if (dateTo && review.createdAt > new Date(`${dateTo}T23:59:59`)) return false
      return true
    })
  }, [initialReviews, sourceFilter, ratingFilter, dateFrom, dateTo])

  const trendConfig = {
    averageRating: { label: t("charts.averageRating"), color: "var(--color-forest, #2f4a3c)" },
  }

  const sourceBarData = REVIEW_SOURCES.map((source) => ({
    source: tSources(source),
    count: stats.bySource[source].count,
    averageRating: Number(stats.bySource[source].averageRating.toFixed(2)),
  }))

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      {/* ── Stats overview ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("stats.average")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-forest">
                {stats.averageRating.toFixed(1)}
              </span>
              <StarRow rating={Math.round(stats.averageRating)} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("stats.totalCount", { count: stats.totalCount })}
            </p>
          </CardContent>
        </Card>

        {REVIEW_SOURCES.map((source) => (
          <Card key={source}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {tSources(source)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-forest">
                  {stats.bySource[source].averageRating.toFixed(1)}
                </span>
                <StarRow rating={Math.round(stats.bySource[source].averageRating)} size="sm" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("stats.totalCount", { count: stats.bySource[source].count })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("charts.trendTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.monthlyTrend.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noResults")}</p>
            ) : (
              <ChartContainer config={trendConfig} className="h-64 w-full">
                <LineChart data={stats.monthlyTrend}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} tickLine={false} axisLine={false} width={24} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="averageRating"
                    stroke="var(--color-forest, #2f4a3c)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("charts.bySourceTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-64 w-full">
              <BarChart data={sourceBarData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="source" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} tickLine={false} axisLine={false} width={24} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="averageRating" fill="var(--color-orange, #e07a3e)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Negative feedback alerts ───────────────────────────────── */}
      {stats.negativeAlerts.length > 0 ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {t("alerts.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.negativeAlerts.map((review) => (
              <div
                key={`${review.source}-${review.id}`}
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="gap-1">
                      <StarRow rating={review.rating} size="sm" />
                    </Badge>
                    <span className="text-sm font-medium">{review.authorName}</span>
                    <Badge variant="secondary">{tSources(review.source)}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {/* ── Filters ────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 pt-6">
          <div className="space-y-1">
            <Label>{t("filters.source")}</Label>
            <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as "all" | ReviewSource)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allSources")}</SelectItem>
                {REVIEW_SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {tSources(source)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>{t("filters.rating")}</Label>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allRatings")}</SelectItem>
                {RATINGS.map((rating) => (
                  <SelectItem key={rating} value={String(rating)}>
                    {rating} ★
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>{t("filters.dateFrom")}</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[160px]" />
          </div>

          <div className="space-y-1">
            <Label>{t("filters.dateTo")}</Label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[160px]" />
          </div>
        </CardContent>
      </Card>

      {/* ── Unified table ──────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.source")}</TableHead>
              <TableHead>{t("columns.author")}</TableHead>
              <TableHead>{t("columns.rating")}</TableHead>
              <TableHead>{t("columns.comment")}</TableHead>
              <TableHead>{t("columns.status")}</TableHead>
              <TableHead className="text-right">{t("columns.date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  {t("noResults")}
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={`${review.source}-${review.id}`}>
                  <TableCell>
                    <Badge variant="secondary">{tSources(review.source)}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{review.authorName}</TableCell>
                  <TableCell>
                    <StarRow rating={review.rating} size="sm" />
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={review.comment}>
                    {review.comment}
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.status === "hidden" ? "destructive" : "outline"}>
                      {t(`status.${review.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right text-sm text-muted-foreground">
                    {review.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function StarRow({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5"
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
