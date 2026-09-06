import { unstable_noStore as noStore } from "next/cache"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getApprovedPosts } from "@/lib/muro/post-queries"
import { getApprovedRepliesByPosts } from "@/lib/replies/reply-queries"
import { normalizePostCategory, type UrgencyLevel } from "@/lib/posts/shared"
import { MURO_ROUTES, getRouteBaseId, getRouteSubLevel } from "@/lib/muro/routes"
import { SocialEmbed } from "@/components/muro/social-embed"
import { PostMediaGallery } from "@/components/muro/post-media-gallery"
import { PostRepliesSection } from "@/components/posts/post-reply-section"
import { PostFeed, type FeedPost } from "@/components/posts/post-feed"

type Props = {
  locale: string
}

/** Aggregated view of every approved muro post, across all 15 routes, shown on
 *  the main /muro page. Unlike `RoutePublications` (scoped to one route), this
 *  adds a route filter and links each post back to the route(s) it's about. */
export async function AllRoutesPublications({ locale }: Props) {
  noStore()
  const [posts, t] = await Promise.all([
    getApprovedPosts(),
    getTranslations({ locale, namespace: "MuroRoute" }),
  ])
  const tMuro = await getTranslations({ locale, namespace: "Muro" })

  const replies = await getApprovedRepliesByPosts("muro", posts.map((p) => p.id))
  const repliesByPost = Object.groupBy(replies, (r) => r.postId)

  const routeName = (baseId: string) => {
    try {
      return t(`${baseId}.routeName` as Parameters<typeof t>[0])
    } catch {
      return baseId
    }
  }

  const routeFilters = MURO_ROUTES.map((route) => ({
    id: route.id,
    label: `${route.number}. ${routeName(route.id)}`,
  }))

  const feedPosts: FeedPost[] = posts.map((post) => {
    // Prefer the new multi-route field; fall back to the legacy single routeId
    // for rows created before this field existed (see schema.ts note).
    const taggedValues = post.routeIds?.length ? post.routeIds : post.routeId ? [post.routeId] : []
    const baseIds = [...new Set(taggedValues.map(getRouteBaseId))]

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
          <p className="text-xs text-muted-foreground">{post.ascentDate}</p>
          {taggedValues.length > 0 ? (
            taggedValues.map((value) => {
              const baseId = getRouteBaseId(value)
              const subLevel = getRouteSubLevel(value)
              return (
                <Link
                  key={value}
                  href={`/muro/${baseId}`}
                  className="rounded-full bg-forest/10 px-2 py-0.5 text-xs font-medium text-forest transition-colors hover:bg-forest/20"
                >
                  {routeName(baseId)}
                  {subLevel ? ` ${subLevel}` : ""}
                </Link>
              )
            })
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {tMuro("posts.noRoute")}
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
    <PostFeed
      posts={feedPosts}
      emptyLabel={tMuro("posts.empty")}
      routeFilters={routeFilters}
      routeFilterLabel={tMuro("posts.routeFilterLabel")}
      routeFilterPlaceholder={tMuro("posts.routeFilterPlaceholder")}
    />
  )
}
