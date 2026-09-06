import { unstable_noStore as noStore } from "next/cache"
import { getTranslations } from "next-intl/server"
import { getApprovedCampingPosts } from "@/lib/camping/post-queries"
import { getApprovedRepliesByPosts } from "@/lib/replies/reply-queries"
import { normalizePostCategory, type UrgencyLevel } from "@/lib/posts/shared"
import { SocialEmbed } from "@/components/muro/social-embed"
import { PostMediaGallery } from "@/components/muro/post-media-gallery"
import { PostRepliesSection } from "@/components/posts/post-reply-section"
import { PostFeed, type FeedPost } from "@/components/posts/post-feed"

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

  const feedPosts: FeedPost[] = posts.map((post) => ({
    id: post.id,
    category: normalizePostCategory(post.category),
    urgencyLevel: post.urgencyLevel as UrgencyLevel | null,
    rating: post.rating,
    authorName: post.authorName,
    comment: post.comment,
    meta: <p className="text-xs text-muted-foreground">{post.visitDate}</p>,
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
        postType="camping"
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
