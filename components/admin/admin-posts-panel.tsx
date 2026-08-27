"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import {
  Check,
  ChevronDown,
  ChevronUp,
  EyeOff,
  MessageSquare,
  Star,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ClimbPost, CampingPost, BoulderPost, PostReply } from "@/lib/db/schema"
import { deletePostAction, updatePostStatusAction } from "@/lib/muro/post-actions"
import {
  deleteCampingPostAction,
  updateCampingPostStatusAction,
} from "@/lib/camping/post-actions"
import {
  deleteBoulderPostAction,
  updateBoulderPostStatusAction,
} from "@/lib/boulder/post-actions"
import {
  deleteReplyAction,
  updateReplyStatusAction,
} from "@/lib/replies/reply-actions"
import { SocialEmbed } from "@/components/muro/social-embed"
import { PostMediaGallery } from "@/components/muro/post-media-gallery"

type Props = {
  initialPosts: ClimbPost[]
  initialCampingPosts: CampingPost[]
  initialBoulderPosts: BoulderPost[]
  initialReplies: PostReply[]
}

export function AdminPostsPanel({
  initialPosts,
  initialCampingPosts,
  initialBoulderPosts,
  initialReplies,
}: Props) {
  const t = useTranslations("Panel.posts")
  const router = useRouter()

  // Group all replies by postId so each list can access them per post
  const repliesByPostId = Object.groupBy(initialReplies, (r) => r.postId)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <Tabs defaultValue="muro">
        <TabsList>
          <TabsTrigger value="muro">
            {t("tabs.muro")} ({initialPosts.length})
          </TabsTrigger>
          <TabsTrigger value="camping">
            {t("tabs.camping")} ({initialCampingPosts.length})
          </TabsTrigger>
          <TabsTrigger value="boulder">
            {t("tabs.boulder")} ({initialBoulderPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="muro" className="mt-4">
          <MuroPostsList
            initialPosts={initialPosts}
            repliesByPostId={repliesByPostId}
            t={t}
            router={router}
          />
        </TabsContent>

        <TabsContent value="camping" className="mt-4">
          <CampingPostsList
            initialPosts={initialCampingPosts}
            repliesByPostId={repliesByPostId}
            t={t}
            router={router}
          />
        </TabsContent>

        <TabsContent value="boulder" className="mt-4">
          <BoulderPostsList
            initialPosts={initialBoulderPosts}
            repliesByPostId={repliesByPostId}
            t={t}
            router={router}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── Muro posts list ──────────────────────────────────────────────────────────

type RepliesMap = Partial<Record<string, PostReply[]>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MuroPostsList({ initialPosts, repliesByPostId, t, router }: { initialPosts: ClimbPost[]; repliesByPostId: RepliesMap; t: any; router: any }) {
  const [posts, setPosts] = useState(initialPosts)
  const [, startTransition] = useTransition()

  function handleStatus(id: string, status: "approved" | "hidden" | "pending") {
    startTransition(async () => {
      const result = await updatePostStatusAction(id, status)
      if (result.ok) {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
        router.refresh()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deletePostAction(id)
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
      {posts.map((post) => (
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
              </div>
              <p className="text-sm text-muted-foreground">
                {post.routeId} · {post.ascentDate} · {t("submittedOn")}{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <StarRating rating={post.rating} />
              <p className="text-sm leading-relaxed text-foreground">{post.comment}</p>
              {post.socialMediaUrl && (
                <SocialEmbed url={post.socialMediaUrl} className="mt-1" />
              )}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <PostMediaGallery mediaUrls={post.mediaUrls} />
              )}
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">{t("contactLabel")}:</span> {post.contactInfo}
              </p>
            </div>
            <PostActions
              status={post.status as "pending" | "approved" | "hidden"}
              onApprove={() => handleStatus(post.id, "approved")}
              onHide={() => handleStatus(post.id, "hidden")}
              onDelete={() => handleDelete(post.id)}
              t={t}
            />
          </div>
          <AdminRepliesSection
            postId={post.id}
            initialReplies={repliesByPostId[post.id] ?? []}
            router={router}
          />
        </article>
      ))}
    </div>
  )
}

// ── Camping posts list ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CampingPostsList({ initialPosts, repliesByPostId, t, router }: { initialPosts: CampingPost[]; repliesByPostId: RepliesMap; t: any; router: any }) {
  const [posts, setPosts] = useState(initialPosts)
  const [, startTransition] = useTransition()

  function handleStatus(id: string, status: "approved" | "hidden" | "pending") {
    startTransition(async () => {
      const result = await updateCampingPostStatusAction(id, status)
      if (result.ok) {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
        router.refresh()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCampingPostAction(id)
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
      {posts.map((post) => (
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
              </div>
              <p className="text-sm text-muted-foreground">
                {post.visitDate} · {t("submittedOn")}{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <StarRating rating={post.rating} />
              <p className="text-sm leading-relaxed text-foreground">{post.comment}</p>
              {post.socialMediaUrl && (
                <SocialEmbed url={post.socialMediaUrl} className="mt-1" />
              )}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <PostMediaGallery mediaUrls={post.mediaUrls} />
              )}
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">{t("contactLabel")}:</span> {post.contactInfo}
              </p>
            </div>
            <PostActions
              status={post.status as "pending" | "approved" | "hidden"}
              onApprove={() => handleStatus(post.id, "approved")}
              onHide={() => handleStatus(post.id, "hidden")}
              onDelete={() => handleDelete(post.id)}
              t={t}
            />
          </div>
          <AdminRepliesSection
            postId={post.id}
            initialReplies={repliesByPostId[post.id] ?? []}
            router={router}
          />
        </article>
      ))}
    </div>
  )
}

// ── Boulder posts list ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BoulderPostsList({ initialPosts, repliesByPostId, t, router }: { initialPosts: BoulderPost[]; repliesByPostId: RepliesMap; t: any; router: any }) {
  const [posts, setPosts] = useState(initialPosts)
  const [, startTransition] = useTransition()

  function handleStatus(id: string, status: "approved" | "hidden" | "pending") {
    startTransition(async () => {
      const result = await updateBoulderPostStatusAction(id, status)
      if (result.ok) {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
        router.refresh()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteBoulderPostAction(id)
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
      {posts.map((post) => (
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
              </div>
              <p className="text-sm text-muted-foreground">
                {post.boulderName} · {post.routeName} · {post.visitDate} · {t("submittedOn")}{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <StarRating rating={post.rating} />
              <p className="text-sm leading-relaxed text-foreground">{post.comment}</p>
              {post.socialMediaUrl && (
                <SocialEmbed url={post.socialMediaUrl} className="mt-1" />
              )}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <PostMediaGallery mediaUrls={post.mediaUrls} />
              )}
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">{t("contactLabel")}:</span> {post.contactInfo}
              </p>
            </div>
            <PostActions
              status={post.status as "pending" | "approved" | "hidden"}
              onApprove={() => handleStatus(post.id, "approved")}
              onHide={() => handleStatus(post.id, "hidden")}
              onDelete={() => handleDelete(post.id)}
              t={t}
            />
          </div>
          <AdminRepliesSection
            postId={post.id}
            initialReplies={repliesByPostId[post.id] ?? []}
            router={router}
          />
        </article>
      ))}
    </div>
  )
}

// ── Inline replies section (inside each post card) ───────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AdminRepliesSection({ initialReplies, router }: { postId: string; initialReplies: PostReply[]; router: any }) {
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
            {expanded ? (
              <ChevronUp className="ml-auto h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="ml-auto h-3.5 w-3.5" />
            )}
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
                      <span className="text-xs font-medium text-foreground">
                        {reply.authorName}
                      </span>
                      <StatusBadge
                        status={reply.status as "pending" | "approved" | "hidden"}
                        t={t}
                        small
                      />
                      <span className="text-xs text-muted-foreground">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {reply.comment}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      <span className="font-medium">{t("contactLabel")}:</span>{" "}
                      {reply.contactInfo}
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "h-3.5 w-3.5",
            s <= rating ? "fill-orange text-orange" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatusBadge({ status, t, small }: { status: "pending" | "approved" | "hidden"; t: any; small?: boolean }) {
  return (
    <Badge
      variant={
        status === "approved" ? "default" : status === "hidden" ? "secondary" : "outline"
      }
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
}

function PostActions({ status, onApprove, onHide, onDelete, t }: PostActionsProps) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onApprove}
        disabled={status === "approved"}
        aria-label={t("approve")}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onHide}
        disabled={status === "hidden"}
        aria-label={t("hide")}
      >
        <EyeOff className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDelete}
        aria-label={t("delete")}
        className="text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
