import Image from "next/image"
import { Sparkles } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import {
  getBoulderGradeRange,
  getBoulderRecommendations,
  type RecommendationCategory,
} from "@/lib/boulder/boulder-recommendations"
import type { BoulderMeta } from "@/lib/boulder/boulders"

type Props = {
  currentBoulderId: BoulderMeta["id"]
  locale: string
  /** Ids of blocks the visitor has already climbed, if that data is ever
   *  available (there is no login-linked session history today, so no
   *  caller passes this yet — kept so this component doesn't need to change
   *  when that feature lands). Already-completed blocks are shown last
   *  within their category instead of being hidden. */
  completedBoulderIds?: string[]
}

const CATEGORY_ORDER: RecommendationCategory[] = ["similar", "progression", "relax"]

function formatGradeRange(range: { min: number; max: number }): string {
  return range.min === range.max ? `V${range.min}` : `V${range.min}-V${range.max}`
}

export async function BoulderRecommendations({
  currentBoulderId,
  locale,
  completedBoulderIds,
}: Props) {
  const buckets = getBoulderRecommendations(currentBoulderId, { completedBoulderIds })
  if (buckets.length === 0) return null

  const t = await getTranslations({ locale, namespace: "BoulderRoute" })
  const bucketsByCategory = new Map(buckets.map((b) => [b.category, b.boulders]))

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
          const boulders = bucketsByCategory.get(category)
          if (!boulders?.length) return null

          return (
            <div key={category}>
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-forest">
                {t(`recommendations.${category}.title`)}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {boulders.map((boulder) => {
                  const range = getBoulderGradeRange(boulder)
                  return (
                    <Link key={boulder.id} href={`/boulder/${boulder.id}`}>
                      <Card className="h-full overflow-hidden border-border transition-all hover:border-forest hover:shadow-md">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={boulder.image}
                            alt={t(`${boulder.id}.name`)}
                            fill
                            sizes="(min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                          />
                          {range && (
                            <div className="absolute left-3 top-3 rounded-full bg-orange px-3 py-1">
                              <span className="text-sm font-bold text-white">
                                {formatGradeRange(range)}
                              </span>
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm leading-tight">
                            {t(`${boulder.id}.name`)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-muted-foreground">
                            {t("labels.problemas")}: {boulder.problems.length}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
