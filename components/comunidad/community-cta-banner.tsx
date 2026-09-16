import { Users } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import type { CommunityActivity } from "@/lib/comunidad/shared"

type Props = {
  locale: string
  activity: CommunityActivity
}

/** Cross-promotion banner embedded in the aggregated /muro, /boulder and
 *  /camping publication views, inviting visitors to the dedicated Comunidad
 *  matchmaking page instead of duplicating that feed inside each activity's
 *  review feed (see system_architecture.md for why they're kept separate). */
export async function CommunityCtaBanner({ locale, activity }: Props) {
  const t = await getTranslations({ locale, namespace: "Comunidad.ctaBanner" })

  return (
    <div className="mt-6 flex flex-col items-start gap-3 rounded-xl border border-forest/30 bg-forest/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Users className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
        <div>
          <p className="text-sm font-medium text-forest">{t("title")}</p>
          <p className="text-sm text-muted-foreground">{t("body")}</p>
        </div>
      </div>
      <Button asChild size="sm" className="shrink-0 bg-orange text-white hover:bg-orange/90">
        <Link href={`/comunidad?activity=${activity}`}>{t("cta")}</Link>
      </Button>
    </div>
  )
}
