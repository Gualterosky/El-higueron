import Image from "next/image"
import {
  ArrowLeft,
  CircleDot,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"
import { BoulderBlockPublications } from "@/components/boulder/boulder-block-publications"
import { BoulderPostForm } from "@/components/boulder/boulder-post-form"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { getBoulder, padBoulderId, type BoulderMeta } from "@/lib/boulder/boulders"

type Props = {
  boulderId: BoulderMeta["id"]
  locale: string
}

export async function BoulderPageLayout({ boulderId, locale }: Props) {
  setRequestLocale(locale)
  const boulder = getBoulder(boulderId)
  if (!boulder) return null

  const t = await getTranslations("BoulderRoute")
  const boulderName = t(`${boulderId}.name`)
  const description = t(`${boulderId}.description`)
  const tips = t.raw(`${boulderId}.tips`) as string[]
  const problems = t.raw(`${boulderId}.problems`) as { name: string; description: string }[]

  const maxLevel = boulder.problems.reduce((max, p) => {
    const num = parseInt(p.level.replace("V", ""), 10)
    const maxNum = parseInt(max.replace("V", ""), 10)
    return num > maxNum ? p.level : max
  }, "V0")

  const boulderDetails = [
    { icon: TrendingUp, label: t("labels.nivel"), value: maxLevel },
    {
      icon: CircleDot,
      label: t("labels.problemas"),
      value: String(boulder.problems.length),
    },
  ]

  const prevHref =
    boulder.number > 1 ? `/boulder/${padBoulderId(boulder.number - 1)}` : null
  const nextHref =
    boulder.number < 4 ? `/boulder/${padBoulderId(boulder.number + 1)}` : null

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={boulder.image}
            alt={`${boulderName} - Zona de Boulder El Higuerón`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 to-forest/80" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange px-4 py-2">
            <span className="text-sm font-bold text-white">{maxLevel}</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {boulderName}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            {t("hero.subtitle", { n: boulder.number, total: 4 })}
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="border-b bg-beige py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href="/boulder"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest transition-colors hover:text-forest/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src={boulder.image}
                alt={boulderName}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <div className="mb-6 flex items-center gap-2">
                <CircleDot className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  {t("details.eyebrow")}
                </span>
              </div>

              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {boulderName}
              </h2>

              <div className="mb-8 grid grid-cols-2 gap-4">
                {boulderDetails.map((detail) => (
                  <Card key={detail.label} className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-forest">
                        <detail.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {detail.label}
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {detail.value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {t("descriptionTitle")}
                </h3>
                <p className="leading-relaxed text-muted-foreground">{description}</p>
              </div>

              <div className="rounded-xl bg-beige p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <AlertTriangle className="h-5 w-5 text-orange" />
                  {t("tipsTitle")}
                </h3>
                <ul className="space-y-2">
                  {tips.map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems section */}
      <section className="bg-beige py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <CircleDot className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                {t("problemsEyebrow")}
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t("problemsTitle")}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {boulder.problems.map((problem, index) => {
              const problemData = problems[index]
              return (
                <Card key={problem.id} className="overflow-hidden border-border">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={problem.image}
                      alt={problemData?.name ?? problem.id}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-orange px-3 py-1">
                      <span className="text-sm font-bold text-white">{problem.level}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-forest text-xs font-bold text-white">
                        {problem.number}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {problemData?.name ?? problem.id}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {problemData?.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Community posts */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <MessageSquare className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                {t("communityEyebrow")}
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t("communityTitle")}
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <BoulderBlockPublications boulderName={boulderName} locale={locale} />
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                {t("sessionTitle")}
              </h3>
              <BoulderPostForm />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t bg-beige py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              {prevHref && (
                <Button
                  asChild
                  variant="outline"
                  className="border-forest text-forest hover:bg-forest hover:text-white"
                >
                  <Link href={prevHref}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("prev")}
                  </Link>
                </Button>
              )}
            </div>

            <Button asChild className="bg-orange text-white hover:bg-orange/90">
              <Link href="/boulder">{t("allBoulders")}</Link>
            </Button>

            <div>
              {nextHref && (
                <Button
                  asChild
                  variant="outline"
                  className="border-forest text-forest hover:bg-forest hover:text-white"
                >
                  <Link href={nextHref}>
                    {t("next")}
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/equipos">{t("cta.equipos")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white"
            >
              <Link href="/visita">{t("cta.visita")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
