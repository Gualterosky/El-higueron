import { Users } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { assertSectionVisible } from "@/lib/site-settings"
import { isCommunityActivity } from "@/lib/comunidad/shared"
import { CommunityFeedSection } from "@/components/comunidad/community-feed-section"
import { CommunityPostForm } from "@/components/comunidad/community-post-form"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ activity?: string }>
}

export default async function ComunidadPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { activity } = await searchParams
  setRequestLocale(locale)
  await assertSectionVisible("comunidad", locale)
  const t = await getTranslations("Comunidad")

  const defaultActivity = activity && isCommunityActivity(activity) ? activity : undefined

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <Users className="mx-auto mb-4 h-10 w-10 text-orange" />
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90">{t("hero.subtitle")}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            {t("intro.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{t("intro.body")}</p>
        </div>
      </section>

      {/* Feed + form */}
      <section className="bg-beige py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">{t("feed.title")}</h3>
              <CommunityFeedSection />
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-foreground">{t("form.title")}</h3>
              <CommunityPostForm defaultActivity={defaultActivity} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
