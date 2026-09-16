"use client"

import { useMemo, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import {
  Ban,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  EyeOff,
  MessageSquare,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CommunityPost, PostReply } from "@/lib/db/schema"
import {
  deleteCommunityPostAction,
  updateCommunityEventStatusAction,
  updateCommunityPostStatusAction,
} from "@/lib/comunidad/post-actions"
import { deleteReplyAction, updateReplyStatusAction } from "@/lib/replies/reply-actions"
import {
  COMMUNITY_ACTIVITIES,
  getCommunityDisplayStatus,
  isCommunityActivity,
  isExperienceLevel,
  type CommunityActivity,
  type CommunityDisplayStatus,
} from "@/lib/comunidad/shared"

type TFunc = ReturnType<typeof useTranslations>
type AppRouter = ReturnType<typeof useRouter>
type RepliesMap = Partial<Record<string, PostReply[]>>

type Props = {
  initialPosts: CommunityPost[]
  initialReplies: PostReply[]
}

export function AdminCommunityPanel({ initialPosts, initialReplies }: Props) {
  const t = useTranslations("Panel.comunidad")
  const router = useRouter()
  const repliesByPostId = Object.groupBy(initialReplies, (r) => r.postId)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <CommunityPostsList
        initialPosts={initialPosts}
        repliesByPostId={repliesByPostId}
        t={t}
        router={router}
      />
    </div>
  )
}

// ── Activity filter (all / escalada_deportiva / boulder / ...) ──────────────

function useActivityFilter(posts: CommunityPost[]) {
  const [activeFilter, setActiveFilter] = useState<"all" | CommunityActivity>("all")

  const counts = useMemo(() => {
    const map = new Map<CommunityActivity, number>()
    for (const post of posts) {
      const activity = isCommunityActivity(post.activity) ? post.activity : "otro"
      map.set(activity, (map.get(activity) ?? 0) + 1)
    }
    return map
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return posts
    return posts.filter((post) => post.activity === activeFilter)
  }, [posts, activeFilter])

  return { activeFilter, setActiveFilter, counts, filteredPosts }
}

function ActivityFilterBar({
  activeFilter,
  onChange,
  counts,
  total,
  t,
}: {
  activeFilter: "all" | CommunityActivity
  onChange: (filter: "all" | CommunityActivity) => void
  counts: Map<CommunityActivity, number>
  total: number
  t: TFunc
}) {
  const tActivities = useTranslations("Comunidad.activities")

  return (
    <div className="flex flex-wrap gap-2">
      <FilterButton active={activeFilter === "all"} onClick={() => onChange("all")} label={`${t("filterAll")} (${total})`} />
      {COMMUNITY_ACTIVITIES.map((activity) => {
        const count = counts.get(activity) ?? 0
        if (count === 0) return null
        return (
          <FilterButton
            key={activity}
            active={activeFilter === activity}
            onClick={() => onChange(activity)}
            label={`${tActivities(activity)} (${count})`}
          />
        )
      })}
    </div>
  )
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active ? "border-forest bg-forest text-white" : "border-border text-muted-foreground hover:bg-muted/50"
      )}
    >
      {label}
    </button>
  )
}

// ── Posts list ────────────────────────────────────────────────────────────

function CommunityPostsList({
  initialPosts,
  repliesByPostId,
  t,
  router,
}: {
  initialPosts: CommunityPost[]
  repliesByPostId: RepliesMap
  t: TFunc
  router: AppRouter
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [, startTransition] = useTransition()
  const { activeFilter, setActiveFilter, counts, filteredPosts } = useActivityFilter(posts)

  function handleStatus(id: string, status: "approved" | "hidden" | "pending") {
    startTransition(async () => {
      const result = await updateCommunityPostStatusAction(id, status)
      if (result.ok) {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
        router.refresh()
      }
    })
  }

  function handleEventStatus(id: string, eventStatus: "open" | "cancelled") {
    startTransition(async () => {
      const result = await updateCommunityEventStatusAction(id, eventStatus)
      if (result.ok) {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, eventStatus } : p)))
        router.refresh()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCommunityPostAction(id)
      if (result.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id))
        router.refresh()
      }
    })
  }

  if (posts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
        {t("noResults")}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <ActivityFilterBar activeFilter={activeFilter} onChange={setActiveFilter} counts={counts} total={posts.length} t={t} />
      {filteredPosts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        filteredPosts.map((post) => {
          const displayStatus = getCommunityDisplayStatus(post)
          return (
            <article
              key={post.id}
              className={cn(
                "flex flex-col gap-4 rounded-xl border p-4 sm:p-5",
                post.status === "pending"
                  ? "border-amber-400/60 bg-amber-50/40 dark:bg-amber-950/10"
                  : "border-border/60 bg-beige/20"
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-forest">{post.authorName}</h3>
                    <StatusBadge status={post.status as "pending" | "approved" | "hidden"} t={t} />
                    <EventStatusBadge status={displayStatus} t={t} />
                    <Badge variant="outline" className="border-forest/40 text-forest">
                      <ActivityLabel activity={post.activity} />
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("dateLabel")}: {post.eventDate} · {t("locationLabel")}:{" "}
                    {post.locationText || "—"} · {t("submittedOn")}{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  {(post.level || post.gradeDetail) && (
                    <p className="text-sm text-muted-foreground">
                      {post.level && isExperienceLevel(post.level) && (
                        <>
                          {t("levelLabel")}: <LevelLabel level={post.level} />
                        </>
                      )}
                      {post.level && post.gradeDetail && " · "}
                      {post.gradeDetail && `${t("gradeDetailLabel")}: ${post.gradeDetail}`}
                    </p>
                  )}
                  {post.logisticsTags && post.logisticsTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.logisticsTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-orange/40 text-orange">
                          <TagLabel tag={tag} />
                        </Badge>
                      ))}
                    </div>
                  )}
                  {post.maxParticipants && (
                    <p className="text-sm text-muted-foreground">
                      {t("maxParticipantsLabel")}: {post.maxParticipants}
                    </p>
                  )}
                  {post.notes && (
                    <p className="text-sm leading-relaxed text-foreground">{post.notes}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">{t("authorLabel")}:</span> {post.authorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">{t("contactLabel")}:</span> {post.contactInfo}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <PostActions
                    status={post.status as "pending" | "approved" | "hidden"}
                    onApprove={() => handleStatus(post.id, "approved")}
                    onHide={() => handleStatus(post.id, "hidden")}
                    onDelete={() => handleDelete(post.id)}
                    t={t}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() =>
                      handleEventStatus(post.id, post.eventStatus === "cancelled" ? "open" : "cancelled")
                    }
                  >
                    {post.eventStatus === "cancelled" ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        {t("reopenEvent")}
                      </>
                    ) : (
                      <>
                        <Ban className="h-3.5 w-3.5" />
                        {t("cancelEvent")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <AdminRepliesSection
                postId={post.id}
                initialReplies={repliesByPostId[post.id] ?? []}
                router={router}
              />
            </article>
          )
        })
      )}
    </div>
  )
}

function ActivityLabel({ activity }: { activity: string }) {
  const t = useTranslations("Comunidad.activities")
  return <>{isCommunityActivity(activity) ? t(activity) : activity}</>
}

function LevelLabel({ level }: { level: string }) {
  const t = useTranslations("Comunidad.levels")
  return <>{isExperienceLevel(level) ? t(level) : level}</>
}

function TagLabel({ tag }: { tag: string }) {
  const t = useTranslations("Comunidad.logisticsTags")
  return <>{t(tag as Parameters<typeof t>[0])}</>
}

function EventStatusBadge({ status, t }: { status: CommunityDisplayStatus; t: TFunc }) {
  if (status === "open") return null
  return (
    <Badge
      className={cn(
        "gap-1",
        status === "cancelled"
          ? "border-transparent bg-destructive text-white"
          : "border-transparent bg-muted-foreground/80 text-white"
      )}
    >
      {status === "cancelled" ? <Ban className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
      {t(`eventStatus.${status}`)}
    </Badge>
  )
}

// ── Inline replies section (mirrors admin-posts-panel.tsx) ───────────────────

function AdminRepliesSection({
  initialReplies,
  router,
}: {
  postId: string
  initialReplies: PostReply[]
  router: AppRouter
}) {
  const t = useTranslations("Panel.replies")
  const [replies, setReplies] = useState(initialReplies)
  const [expanded, setExpanded] = useState(false)
  const [, startTransition] = useTransition()

  function handleStatus(id: string, status: "approved" | "hidden" | "pending") {
    startTransition(async () => {
      const result = await updateReplyStatusAction(id, status)
      if (result.ok) {
        setReplies((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
        router.refresh()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteReplyAction(id)
      if (result.ok) {
        setReplies((prev) => prev.filter((r) => r.id !== id))
        router.refresh()
      }
    })
  }

  return (
    <div className="border-t border-border/40 pt-2">
      {replies.length === 0 ? (
        <p className="text-xs text-muted-foreground/50">{t("noResults")}</p>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{t("count", { count: replies.length })}</span>
            {expanded ? <ChevronUp className="ml-auto h-3.5 w-3.5" /> : <ChevronDown className="ml-auto h-3.5 w-3.5" />}
          </button>

          {expanded && (
            <div className="mt-2 space-y-2 border-l-2 border-border/50 pl-3">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className={cn(
                    "flex items-start justify-between gap-2 rounded-lg bg-background/60 px-2 py-1.5",
                    reply.status === "hidden" && "opacity-50"
                  )}
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-medium text-foreground">{reply.authorName}</span>
                      <StatusBadge status={reply.status as "pending" | "approved" | "hidden"} t={t} small />
                      <span className="text-xs text-muted-foreground">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{reply.comment}</p>
                    <p className="text-xs text-muted-foreground/60">
                      <span className="font-medium">{t("contactLabel")}:</span> {reply.contactInfo}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleStatus(reply.id, "approved")}
                      disabled={reply.status === "approved"}
                      aria-label={t("approve")}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleStatus(reply.id, "hidden")}
                      disabled={reply.status === "hidden"}
                      aria-label={t("hide")}
                    >
                      <EyeOff className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleDelete(reply.id)}
                      aria-label={t("delete")}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Shared sub-components ────────────────────────────────────────────────────

function StatusBadge({ status, t, small }: { status: "pending" | "approved" | "hidden"; t: TFunc; small?: boolean }) {
  return (
    <Badge
      variant={status === "approved" ? "default" : status === "hidden" ? "secondary" : "outline"}
      className={cn(
        status === "approved"
          ? "border-transparent bg-forest text-white"
          : status === "pending"
            ? "border-amber-400 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
            : undefined,
        small && "px-1.5 py-0 text-[10px]"
      )}
    >
      {t(`status.${status}`)}
    </Badge>
  )
}

type PostActionsProps = {
  status: "pending" | "approved" | "hidden"
  onApprove: () => void
  onHide: () => void
  onDelete: () => void
  t: TFunc
}

function PostActions({ status, onApprove, onHide, onDelete, t }: PostActionsProps) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button type="button" variant="ghost" size="icon" onClick={onApprove} disabled={status === "approved"} aria-label={t("approve")}>
        <Check className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onHide} disabled={status === "hidden"} aria-label={t("hide")}>
        <EyeOff className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onDelete} aria-label={t("delete")} className="text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
