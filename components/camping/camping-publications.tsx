import { unstable_noStore as noStore } from "next/cache"
import { Star } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import type { CampingPost } from "@/lib/db/schema"
import { getApprovedCampingPosts } from "@/lib/camping/post-queries"
import { getApprovedRepliesByPosts } from "@/lib/replies/reply-queries"
import { SocialEmbed } from "@/components/muro/social-embed"
import { PostMediaGallery } from "@/components/muro/post-media-gallery"
import { PostRepliesSection } from "@/components/posts/post-reply-section"

type Props = {
  locale: string
}

export async function CampingPublications({ locale }: Props) {
  noStore()
  const [posts, t] = await Promise.all([
    getApprovedCampingPosts(),
    getTranslations({ locale, namespace: "CampingPost" }),
  ])

  const replies = await getApprovedRepliesByPosts("camping", posts.map((p) => p.id))
  const repliesByPost = Object.groupBy(replies, (r) => r.postId)

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {t("publicationsTitle")}
      </h3>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {t("publicationsEmpty")}
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post: CampingPost) => (
            <article
              key={post.id}
              className="space-y-3 rounded-xl border border-border/60 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{post.authorName}</p>
                  <p className="text-xs text-muted-foreground">{post.visitDate}</p>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-4 w-4",
                        s <= post.rating
                          ? "fill-orange text-orange"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {post.comment}
              </p>
              {post.socialMediaUrl && (
                <SocialEmbed url={post.socialMediaUrl} className="mt-1" />
              )}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <PostMediaGallery mediaUrls={post.mediaUrls} />
              )}
              <PostRepliesSection
                postId={post.id}
                postType="camping"
                initialReplies={repliesByPost[post.id] ?? []}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
