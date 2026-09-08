import { unstable_noStore as noStore } from "next/cache"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getApprovedBoulderPosts } from "@/lib/boulder/post-queries"
import { getApprovedRepliesByPosts } from "@/lib/replies/reply-queries"
import { normalizePostCategory, type UrgencyLevel } from "@/lib/posts/shared"
import { BOULDERS, getBoulderBaseId, getBoulderProblemId } from "@/lib/boulder/boulders"
import { SocialEmbed } from "@/components/muro/social-embed"
import { PostMediaGallery } from "@/components/muro/post-media-gallery"
import { PostRepliesSection } from "@/components/posts/post-reply-section"
import { PostFeed, type FeedPost } from "@/components/posts/post-feed"

type Props = {
  locale: string
}

/** Aggregated view of every approved boulder post, across all 4 boulders,
 *  shown on the main /boulder page. Adds a boulder filter and links each
 *  post back to the boulder(s) it's about (mirrors AllRoutesPublications). */
export async function BoulderPublications({ locale }: Props) {
  noStore()
  const [posts, t] = await Promise.all([
    getApprovedBoulderPosts(),
    getTranslations({ locale, namespace: "BoulderPost" }),
  ])
  const tRoute = await getTranslations({ locale, namespace: "BoulderRoute" })
  const tBoulder = await getTranslations({ locale, namespace: "Boulder" })

  const replies = await getApprovedRepliesByPosts("boulder", posts.map((p) => p.id))
  const repliesByPost = Object.groupBy(replies, (r) => r.postId)

  const boulderName = (baseId: string) => {
    try {
      return tRoute(`${baseId}.name` as Parameters<typeof tRoute>[0])
    } catch {
      return baseId
    }
  }

  const boulderFilters = BOULDERS.map((boulder) => ({
    id: boulder.id,
    label: `${boulder.number}. ${boulderName(boulder.id)}`,
  }))

  const feedPosts: FeedPost[] = posts.map((post) => {
    // Prefer the new multi-problem field; fall back to the legacy
    // boulderName/routeName pair for rows created before this field existed
    // (see schema.ts note).
    const taggedValues = post.problemIds?.length
      ? post.problemIds
      : post.boulderName
        ? [post.routeName ? `${post.boulderName}-${post.routeName}` : post.boulderName]
        : []
    const baseIds = [...new Set(taggedValues.map(getBoulderBaseId))]

    return {
      id: post.id,
      category: normalizePostCategory(post.category),
      urgencyLevel: post.urgencyLevel as UrgencyLevel | null,
      rating: post.rating,
      authorName: post.authorName,
      comment: post.comment,
      routeIds: baseIds,
      meta: (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-muted-foreground">{post.visitDate}</p>
          {taggedValues.length > 0 ? (
            taggedValues.map((value) => {
              const baseId = getBoulderBaseId(value)
              const problemId = getBoulderProblemId(value)
              // Only render a link when the base id is a real, known boulder
              // (legacy free-text rows may not match any BOULDERS entry).
              const isKnownBoulder = BOULDERS.some((b) => b.id === baseId)
              const label = `${boulderName(baseId)}${problemId ? ` · ${problemId}` : ""}`
              return isKnownBoulder ? (
                <Link
                  key={value}
                  href={`/boulder/${baseId}`}
                  className="rounded-full bg-forest/10 px-2 py-0.5 text-xs font-medium text-forest transition-colors hover:bg-forest/20"
                >
                  {label}
                </Link>
              ) : (
                <span
                  key={value}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {value}
                </span>
              )
            })
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {tBoulder("posts.noBoulder")}
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
          postType="boulder"
          initialReplies={repliesByPost[post.id] ?? []}
        />
      ),
    }
  })

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {t("publicationsTitle")}
      </h3>
      <PostFeed
        posts={feedPosts}
        emptyLabel={t("publicationsEmpty")}
        routeFilters={boulderFilters}
        routeFilterLabel={tBoulder("posts.routeFilterLabel")}
        routeFilterPlaceholder={tBoulder("posts.routeFilterPlaceholder")}
      />
    </div>
  )
}
