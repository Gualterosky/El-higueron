"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Ban, Clock, MapPin, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  COMMUNITY_ACTIVITIES,
  type CommunityActivity,
  type CommunityDisplayStatus,
  type ExperienceLevel,
} from "@/lib/comunidad/shared"
import { ContactReveal } from "@/components/comunidad/contact-reveal"

export type CommunityFeedPost = {
  id: string
  activity: CommunityActivity
  eventDate: string
  displayStatus: CommunityDisplayStatus
  locationText: string
  level: ExperienceLevel | null
  gradeDetail: string | null
  logisticsTags: string[]
  maxParticipants: number | null
  notes: string | null
  authorName: string
  /** Already stripped server-side (null) for cancelled/expired plans. */
  contactInfo: string | null
  replies: ReactNode
}

type Props = {
  posts: CommunityFeedPost[]
}

const STATUS_BADGE: Record<CommunityDisplayStatus, string> = {
  open: "border-forest/40 bg-forest/10 text-forest",
  expired: "border-muted-foreground/30 bg-muted text-muted-foreground",
  cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
}

export function CommunityFeed({ posts }: Props) {
  const t = useTranslations("Comunidad.feed")
  const tActivities = useTranslations("Comunidad.activities")
  const [activeActivity, setActiveActivity] = useState<"all" | CommunityActivity>("all")

  const counts = useMemo(() => {
    const map = new Map<CommunityActivity, number>()
    for (const post of posts) map.set(post.activity, (map.get(post.activity) ?? 0) + 1)
    return map
  }, [posts])

  const visiblePosts = useMemo(() => {
    const base = activeActivity === "all" ? posts : posts.filter((p) => p.activity === activeActivity)
    // Upcoming ("open") plans first, soonest first; expired/cancelled sink to
    // the bottom, most recent first. `posts` already arrives sorted by
    // eventDate asc from the server, so we only need a stable partition.
    return [...base].sort((a, b) => {
      const priorityA = a.displayStatus === "open" ? 1 : 0
      const priorityB = b.displayStatus === "open" ? 1 : 0
      if (priorityA !== priorityB) return priorityB - priorityA
      if (priorityA === 1) return a.eventDate < b.eventDate ? -1 : 1
      return a.eventDate > b.eventDate ? -1 : 1
    })
  }, [posts, activeActivity])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={activeActivity === "all"}
          onClick={() => setActiveActivity("all")}
          label={`${t("filterAll")} (${posts.length})`}
        />
        {COMMUNITY_ACTIVITIES.map((activity) => {
          const count = counts.get(activity) ?? 0
          if (count === 0) return null
          return (
            <FilterButton
              key={activity}
              active={activeActivity === activity}
              onClick={() => setActiveActivity(activity)}
              label={`${tActivities(activity)} (${count})`}
            />
          )
        })}
      </div>

      {visiblePosts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="space-y-4">
          {visiblePosts.map((post) => (
            <CommunityCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

function CommunityCard({ post }: { post: CommunityFeedPost }) {
  const t = useTranslations("Comunidad.feed")
  const tActivities = useTranslations("Comunidad.activities")
  const tLevels = useTranslations("Comunidad.levels")
  const tTags = useTranslations("Comunidad.logisticsTags")
  const tStatus = useTranslations("Comunidad.eventStatus")

  return (
    <article
      className={cn(
        "space-y-3 rounded-xl border bg-white p-4",
        post.displayStatus === "open" ? "border-border/60" : "opacity-80"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">{post.authorName}</p>
            <Badge variant="outline" className="border-forest/40 text-forest">
              {tActivities(post.activity)}
            </Badge>
            {post.displayStatus !== "open" && (
              <Badge className={cn("gap-1 border", STATUS_BADGE[post.displayStatus])}>
                {post.displayStatus === "cancelled" ? (
                  <Ban className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {tStatus(post.displayStatus)}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.eventDate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {post.locationText || t("noLocation")}
            </span>
            {post.maxParticipants && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {t("maxParticipantsLabel", { count: post.maxParticipants })}
              </span>
            )}
          </div>
        </div>
      </div>

      {(post.level || post.gradeDetail) && (
        <p className="text-sm text-muted-foreground">
          {post.level && (
            <>
              <span className="font-medium text-foreground">{t("levelLabel")}:</span>{" "}
              {tLevels(post.level)}
            </>
          )}
          {post.level && post.gradeDetail && " · "}
          {post.gradeDetail}
        </p>
      )}

      {post.logisticsTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.logisticsTags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-orange/40 text-orange">
              {tTags(tag as Parameters<typeof tTags>[0])}
            </Badge>
          ))}
        </div>
      )}

      {post.notes && <p className="text-sm leading-relaxed text-muted-foreground">{post.notes}</p>}

      {post.displayStatus === "open" && post.contactInfo ? (
        <ContactReveal contactInfo={post.contactInfo} />
      ) : post.displayStatus !== "open" ? (
        <p className="text-xs italic text-muted-foreground">
          {post.displayStatus === "cancelled" ? t("cancelledNotice") : t("expiredNotice")}
        </p>
      ) : null}

      {post.replies}
    </article>
  )
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-forest bg-forest text-white"
          : "border-border text-muted-foreground hover:bg-muted/50"
      )}
    >
      {label}
    </button>
  )
}
