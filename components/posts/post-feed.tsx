"use client"

import { useMemo, useState, type ReactNode } from "react"
import { AlertTriangle, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { POST_CATEGORIES, URGENCY_RANK, type PostCategory, type UrgencyLevel } from "@/lib/posts/shared"

export type FeedPost = {
  id: string
  category: PostCategory
  urgencyLevel: UrgencyLevel | null
  rating: number
  authorName: string
  comment: string
  /** Pre-rendered date/route/boulder-name line, built by the server component. */
  meta: ReactNode
  /** Pre-rendered social embed + media gallery, built by the server component. */
  media: ReactNode
  /** Pre-rendered <PostRepliesSection />. */
  replies: ReactNode
}

type Props = {
  posts: FeedPost[]
  emptyLabel: string
}

const URGENCY_BORDER: Record<UrgencyLevel, string> = {
  critical: "border-destructive bg-destructive/5",
  high: "border-destructive/70 bg-destructive/5",
  medium: "border-orange bg-orange/5",
  low: "border-amber-400 bg-amber-50/40",
}

/** Public feed of posts (muro/camping/boulder) with category filter tabs and
 *  incidents prioritized (sorted by urgency) at the top of the "all" view. */
export function PostFeed({ posts, emptyLabel }: Props) {
  const t = useTranslations("PostCategories")
  const [activeFilter, setActiveFilter] = useState<"all" | PostCategory>("all")

  const counts = useMemo(() => {
    const map = new Map<PostCategory, number>()
    for (const post of posts) map.set(post.category, (map.get(post.category) ?? 0) + 1)
    return map
  }, [posts])

  const visiblePosts = useMemo(() => {
    if (activeFilter !== "all") return posts.filter((p) => p.category === activeFilter)

    // Default order: incidents first (most urgent first), then the rest in their
    // original order (already sorted by createdAt desc by the query).
    return posts
      .map((post, index) => ({ post, index }))
      .sort((a, b) => {
        const priorityA = a.post.category === "incident" ? 100 + URGENCY_RANK[a.post.urgencyLevel ?? "low"] : 0
        const priorityB = b.post.category === "incident" ? 100 + URGENCY_RANK[b.post.urgencyLevel ?? "low"] : 0
        if (priorityA !== priorityB) return priorityB - priorityA
        return a.index - b.index
      })
      .map(({ post }) => post)
  }, [posts, activeFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
          label={`${t("filterAll")} (${posts.length})`}
        />
        {POST_CATEGORIES.map((category) => {
          const count = counts.get(category) ?? 0
          if (count === 0) return null
          return (
            <FilterButton
              key={category}
              active={activeFilter === category}
              onClick={() => setActiveFilter(category)}
              label={`${t(`${category}.label`)} (${count})`}
              destructive={category === "incident"}
            />
          )
        })}
      </div>

      {visiblePosts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <div className="space-y-4">
          {visiblePosts.map((post) => (
            <article
              key={post.id}
              className={cn(
                "space-y-3 rounded-xl border bg-white p-4",
                post.category === "incident"
                  ? URGENCY_BORDER[post.urgencyLevel ?? "low"]
                  : "border-border/60"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{post.authorName}</p>
                    <CategoryBadge category={post.category} urgencyLevel={post.urgencyLevel} t={t} />
                  </div>
                  {post.meta}
                </div>
                {post.category === "review" && (
                  <div className="flex shrink-0 gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "h-4 w-4",
                          s <= post.rating ? "fill-orange text-orange" : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{post.comment}</p>
              {post.media}
              {post.replies}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  label,
  destructive,
}: {
  active: boolean
  onClick: () => void
  label: string
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? destructive
            ? "border-destructive bg-destructive text-white"
            : "border-forest bg-forest text-white"
          : "border-border text-muted-foreground hover:bg-muted/50"
      )}
    >
      {label}
    </button>
  )
}

function CategoryBadge({
  category,
  urgencyLevel,
  t,
}: {
  category: PostCategory
  urgencyLevel: UrgencyLevel | null
  t: ReturnType<typeof useTranslations>
}) {
  if (category === "review") return null

  if (category === "incident") {
    return (
      <Badge className="gap-1 border-transparent bg-destructive text-white">
        <AlertTriangle className="h-3 w-3" />
        {t("incident.label")}
        {urgencyLevel && ` · ${t(`urgency.${urgencyLevel}`)}`}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="border-forest/40 text-forest">
      {t(`${category}.label`)}
    </Badge>
  )
}
