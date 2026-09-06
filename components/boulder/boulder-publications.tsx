import { unstable_noStore as noStore } from "next/cache"
import { getTranslations } from "next-intl/server"
import { getApprovedBoulderPosts } from "@/lib/boulder/post-queries"
import { getApprovedRepliesByPosts } from "@/lib/replies/reply-queries"
import type { PostCategory, UrgencyLevel } from "@/lib/posts/shared"
import { SocialEmbed } from "@/components/muro/social-embed"
import { PostMediaGallery } from "@/components/muro/post-media-gallery"
import { PostRepliesSection } from "@/components/posts/post-reply-section"
import { PostFeed, type FeedPost } from "@/components/posts/post-feed"

type Props = {
  locale: string
}

export async function BoulderPublications({ locale }: Props) {
  noStore()
  const [posts, t] = await Promise.all([
    getApprovedBoulderPosts(),
    getTranslations({ locale, namespace: "BoulderPost" }),
  ])

  const replies = await getApprovedRepliesByPosts("boulder", posts.map((p) => p.id))
  const repliesByPost = Object.groupBy(replies, (r) => r.postId)

  const feedPosts: FeedPost[] = posts.map((post) => ({
    id: post.id,
    category: post.category as PostCategory,
    urgencyLevel: post.urgencyLevel as UrgencyLevel | null,
    rating: post.rating,
    authorName: post.authorName,
    comment: post.comment,
    meta: (
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs text-muted-foreground">{post.visitDate}</p>
        <span className="rounded-full bg-forest/10 px-2 py-0.5 text-xs font-medium text-forest">
          {post.boulderName}
        </span>
        <span className="rounded-full bg-orange/10 px-2 py-0.5 text-xs font-medium text-orange">
          {post.routeName}
        </span>
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
        postType="boulder"
        initialReplies={repliesByPost[post.id] ?? []}
      />
    ),
  }))

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {t("publicationsTitle")}
      </h3>
      <PostFeed posts={feedPosts} emptyLabel={t("publicationsEmpty")} />
    </div>
  )
}
