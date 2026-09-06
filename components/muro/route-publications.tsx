import { unstable_noStore as noStore } from "next/cache"
import { getTranslations } from "next-intl/server"
import { getApprovedPostsByRoute } from "@/lib/muro/post-queries"
import { getApprovedRepliesByPosts } from "@/lib/replies/reply-queries"
import { normalizePostCategory, type UrgencyLevel } from "@/lib/posts/shared"
import { SocialEmbed } from "@/components/muro/social-embed"
import { PostMediaGallery } from "@/components/muro/post-media-gallery"
import { PostRepliesSection } from "@/components/posts/post-reply-section"
import { PostFeed, type FeedPost } from "@/components/posts/post-feed"

type Props = {
  routeId: string
  locale: string
}

export async function RoutePublications({ routeId, locale }: Props) {
  noStore()
  const [posts, t] = await Promise.all([
    getApprovedPostsByRoute(routeId),
    getTranslations({ locale, namespace: "MuroRoute" }),
  ])

  const replies = await getApprovedRepliesByPosts("muro", posts.map((p) => p.id))
  const repliesByPost = Object.groupBy(replies, (r) => r.postId)

  const feedPosts: FeedPost[] = posts.map((post) => {
    const dashIdx = post.routeId.indexOf("-")
    const level = dashIdx !== -1 ? post.routeId.slice(dashIdx + 1) : null
    return {
      id: post.id,
      category: normalizePostCategory(post.category),
      urgencyLevel: post.urgencyLevel as UrgencyLevel | null,
      rating: post.rating,
      authorName: post.authorName,
      comment: post.comment,
      meta: (
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{post.ascentDate}</p>
          {level && (
            <span className="rounded-full bg-forest/10 px-2 py-0.5 text-xs font-medium text-forest">
              {level}
            </span>
          )}
        </div>
      ),
      media: (
        <>
          {post.socialMediaUrl && <SocialEmbed url={post.socialMediaUrl} className="mt-1" />}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <PostMediaGallery mediaUrls={post.mediaUrls} />
          )}
        </>
      ),
      replies: (
        <PostRepliesSection
          postId={post.id}
          postType="muro"
          initialReplies={repliesByPost[post.id] ?? []}
        />
      ),
    }
  })

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {t("publicationsTitle")}
      </h3>
      <PostFeed posts={feedPosts} emptyLabel={t("publicationsEmpty")} />
    </div>
  )
}
