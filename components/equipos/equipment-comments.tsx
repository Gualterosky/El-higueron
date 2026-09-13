import { unstable_noStore as noStore } from "next/cache"
import { Star } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import { getApprovedEquipmentPosts } from "@/lib/equipos/post-queries"
import { getApprovedRepliesByPosts } from "@/lib/replies/reply-queries"
import { PostRepliesSection } from "@/components/posts/post-reply-section"

type Props = {
  locale: string
}

export async function EquipmentComments({ locale }: Props) {
  noStore()
  const [posts, t] = await Promise.all([
    getApprovedEquipmentPosts(),
    getTranslations({ locale, namespace: "EquipmentPost" }),
  ])

  const replies = await getApprovedRepliesByPosts("equipos", posts.map((p) => p.id))
  const repliesByPost = Object.groupBy(replies, (r) => r.postId)

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {t("publicationsEmpty")}
        </p>
      ) : (
        posts.map((post) => (
          <article key={post.id} className="space-y-3 rounded-xl border border-border/60 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-foreground">{post.authorName}</p>
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
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{post.comment}</p>
            <PostRepliesSection
              postId={post.id}
              postType="equipos"
              initialReplies={repliesByPost[post.id] ?? []}
            />
          </article>
        ))
      )}
    </div>
  )
}
