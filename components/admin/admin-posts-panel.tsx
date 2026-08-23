"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Check, EyeOff, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ClimbPost } from "@/lib/db/schema"
import { deletePostAction, updatePostStatusAction } from "@/lib/muro/post-actions"

export function AdminPostsPanel({ initialPosts }: { initialPosts: ClimbPost[] }) {
  const t = useTranslations("Panel.posts")
  const router = useRouter()
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

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-4 rounded-xl border border-border/60 bg-beige/20 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-forest">{post.authorName}</h3>
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
                    {t(`status.${post.status as "pending" | "approved" | "hidden"}`)}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {post.routeId} · {post.ascentDate} · {t("submittedOn")}{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-3.5 w-3.5",
                        s <= post.rating ? "fill-orange text-orange" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-foreground">{post.comment}</p>

                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">{t("contactLabel")}:</span> {post.contactInfo}
                </p>
              </div>

              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStatus(post.id, "approved")}
                  disabled={post.status === "approved"}
                  aria-label={t("approve")}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStatus(post.id, "hidden")}
                  disabled={post.status === "hidden"}
                  aria-label={t("hide")}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(post.id)}
                  aria-label={t("delete")}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
