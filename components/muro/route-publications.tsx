import { unstable_noStore as noStore } from "next/cache"
import { Star } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import type { ClimbPost } from "@/lib/db/schema"
import { getApprovedPostsByRoute } from "@/lib/muro/post-queries"
import { SocialEmbed } from "@/components/muro/social-embed"

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
          {posts.map((post: ClimbPost) => {
            const dashIdx = post.routeId.indexOf("-")
            const level = dashIdx !== -1 ? post.routeId.slice(dashIdx + 1) : null
            return (
              <article
                key={post.id}
                className="space-y-3 rounded-xl border border-border/60 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{post.authorName}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{post.ascentDate}</p>
                      {level && (
                        <span className="rounded-full bg-forest/10 px-2 py-0.5 text-xs font-medium text-forest">
                          {level}
                        </span>
                      )}
                    </div>
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
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
