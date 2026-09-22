import Image from "next/image"
import { Sparkles } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import {
  getRouteRecommendations,
  type RecommendationCategory,
} from "@/lib/muro/route-recommendations"
import type { MuroRouteMeta } from "@/lib/muro/routes"

type Props = {
  currentRouteId: MuroRouteMeta["id"]
  locale: string
  /** Ids of routes the visitor has already climbed, if that data is ever
   *  available (there is no login-linked ascent history today, so no caller
   *  passes this yet — kept so this component doesn't need to change when
   *  that feature lands). Already-completed routes are shown last within
   *  their category instead of being hidden. */
  completedRouteIds?: string[]
}

const CATEGORY_ORDER: RecommendationCategory[] = ["similar", "progression", "relax"]

export async function RouteRecommendations({
  currentRouteId,
  locale,
  completedRouteIds,
}: Props) {
  const buckets = getRouteRecommendations(currentRouteId, { completedRouteIds })
  if (buckets.length === 0) return null

  const t = await getTranslations({ locale, namespace: "MuroRoute" })
  const bucketsByCategory = new Map(buckets.map((b) => [b.category, b.routes]))

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-forest" />
        <h3 className="text-lg font-semibold text-foreground">
          {t("recommendations.title")}
        </h3>
      </div>

      <div className="space-y-6">
        {CATEGORY_ORDER.map((category) => {
          const routes = bucketsByCategory.get(category)
          if (!routes?.length) return null

          return (
            <div key={category}>
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-forest">
                {t(`recommendations.${category}.title`)}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {routes.map((route) => (
                  <Link key={route.id} href={`/muro/${route.id}`}>
                    <Card className="h-full overflow-hidden border-border transition-all hover:border-forest hover:shadow-md">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={route.image}
                          alt={t(`${route.id}.routeName`)}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute left-3 top-3 rounded-full bg-orange px-3 py-1">
                          <span className="text-sm font-bold text-white">
                            {route.level}
                          </span>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm leading-tight">
                          {t(`${route.id}.routeName`)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground">{route.height}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
