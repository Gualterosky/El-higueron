import Image from "next/image"
import {
  ArrowLeft,
  Mountain,
  Ruler,
  TrendingUp,
  Anchor,
  AlertTriangle,
  User,
} from "lucide-react"
import { AscentForm } from "@/components/muro/ascent-form"
import { RoutePublications } from "@/components/muro/route-publications"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import {
  getMuroRoute,
  padRouteId,
  type MuroRouteMeta,
  type StyleKey,
} from "@/lib/muro/routes"

type Props = {
  routeId: MuroRouteMeta["id"]
  locale: string
}

function localizeValue(
  value: string,
  t: Awaited<ReturnType<typeof getTranslations<"MuroRoute">>>
) {
  if (value === "Por definir") return t("porDefinir")
  if (value === "Proyecto") return t("proyecto")
  return value
}

export async function RoutePageLayout({ routeId, locale }: Props) {
  setRequestLocale(locale)
  const route = getMuroRoute(routeId)
  if (!route) return null

  const t = await getTranslations("MuroRoute")
  const routeName = t(`${routeId}.routeName`)
  const description = t(`${routeId}.description`)
  const tips = t.raw(`${routeId}.tips`) as string[]
  const style = t(`styles.${route.styleKey as StyleKey}`)
  const level = localizeValue(route.level, t)
  const height = localizeValue(route.height, t)
  const anchors = localizeValue(route.anchors, t)

  const routeDetails = [
    { icon: TrendingUp, label: t("labels.nivel"), value: level },
    { icon: Ruler, label: t("labels.altura"), value: height },
    { icon: Anchor, label: t("labels.chapas"), value: anchors },
    { icon: Mountain, label: t("labels.estilo"), value: style },
  ]

  const prevHref =
    route.number > 1 ? `/muro/${padRouteId(route.number - 1)}` : null
  const nextHref =
    route.number < 15 ? `/muro/${padRouteId(route.number + 1)}` : null

  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={route.image}
            alt={`${routeName} - Muro Bendito Sea`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 to-forest/80" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange px-4 py-2">
            <span className="text-sm font-bold text-white">{level}</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {routeName}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            {t("hero.subtitle", { n: route.number })}
          </p>
        </div>
      </section>

      <section className="border-b bg-beige py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href="/muro"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest transition-colors hover:text-forest/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src={route.image}
                alt={routeName}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="mb-6 flex items-center gap-2">
                <Mountain className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  {t("details.eyebrow")}
                </span>
              </div>

              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {routeName}
              </h2>

              <div className="mb-8 grid grid-cols-2 gap-4">
                {routeDetails.map((detail) => (
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
                <p className="leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

              <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-beige p-4">
                <User className="h-5 w-5 shrink-0 text-forest" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("buildersLabel")}
                  </p>
                  <p className="font-medium text-foreground">{route.builders}</p>
                </div>
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

              <RoutePublications routeId={routeId} locale={locale} />

              <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-foreground">
                  {t("registerTitle")}
                </h3>
                <AscentForm routeId={routeId} />
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <Link href="/muro">{t("allRoutes")}</Link>
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
