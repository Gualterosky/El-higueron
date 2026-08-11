import Image from "next/image"
import { Mountain, Shield, AlertTriangle, MapPin, Anchor, Route } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import RouteGuideSection from "./RouteGuideSection"

type RouteItem = {
  name: string
  level: string
  height: string
}

type Props = {
  params: Promise<{ locale: string }>
}

const wallFeatureIcons = [Mountain, Anchor, Route] as const
const wallFeatureKeys = ["rock", "routes", "levels"] as const

export default async function MuroPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Muro")

  const routes = t.raw("routes.list") as RouteItem[]
  const safetyTips = t.raw("safety.tips") as string[]

  const wallFeatures = wallFeatureKeys.map((key, index) => ({
    icon: wallFeatureIcons[index],
    title: t(`features.${key}.title`),
    description: t(`features.${key}.description`),
  }))

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Muro bendito sea/Img02.jpg"
            alt={t("hero.imageAlt")}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Mountain className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  {t("intro.eyebrow")}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {t("intro.title")}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {t("intro.p1")}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("intro.p2")}
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Muro bendito sea/Img03.jpg"
                alt={t("intro.imageAlt")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Wall Features */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t("features.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {wallFeatures.map((feature) => (
              <Card key={feature.title} className="border-none bg-white shadow-sm">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Routes Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Route className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                {t("routes.eyebrow")}
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t("routes.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("routes.subtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {routes.map((route, index) => (
              <Link
                key={route.name}
                href={`/muro/MBS${String(index + 1).padStart(2, "0")}`}
              >
                <Card className="h-full border-border transition-all hover:border-forest hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <span className="text-xs font-semibold text-orange">{route.level}</span>
                    <CardTitle className="text-sm leading-tight">{route.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{route.height}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Route Guide Section */}
      <RouteGuideSection />

      {/* Location Section */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Muro bendito sea/IMG_20250111_141453567_SR.jpg"
                alt={t("location.imageAlt")}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  {t("location.eyebrow")}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {t("location.title")}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {t("location.p1")}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("location.p2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange" />
                <span className="text-sm font-medium uppercase tracking-wider text-orange">
                  {t("safety.eyebrow")}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                {t("safety.title")}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                {t("safety.intro")}
              </p>

              <ul className="space-y-3">
                {safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <span className="text-white/90">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Muro bendito sea/Img04.jpg"
                alt={t("safety.imageAlt")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/equipos">{t("cta.primary")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <Link href="/visita">{t("cta.secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
