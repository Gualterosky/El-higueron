import Image from "next/image"
import { MapPin, Cloud, Shirt, Clock, Leaf, Flame, Trash2, AlertTriangle, Car, CheckCircle } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { assertSectionVisible } from "@/lib/site-settings"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function VisitaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await assertSectionVisible("visita", locale)
  const t = await getTranslations("Visita")

  const howToGetThere = t.raw("location.items") as string[]

  const weatherRecommendations = [
    {
      icon: Cloud,
      title: t("weather.variable.title"),
      description: t("weather.variable.description"),
    },
    {
      icon: Shirt,
      title: t("weather.clothing.title"),
      description: t("weather.clothing.description"),
    },
  ]

  const clothingList = t.raw("clothing.items") as string[]

  const basicRules = [
    {
      icon: Leaf,
      title: t("rules.nature.title"),
      description: t("rules.nature.description"),
    },
    {
      icon: Trash2,
      title: t("rules.trash.title"),
      description: t("rules.trash.description"),
    },
    {
      icon: Flame,
      title: t("rules.fire.title"),
      description: t("rules.fire.description"),
    },
    {
      icon: AlertTriangle,
      title: t("rules.safety.title"),
      description: t("rules.safety.description"),
    },
  ]

  const schedule = t.raw("schedule.rows") as Array<{
    category: string
    day: string
    hours: string
  }>

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Muro bendito sea/IMG_20250322_174755948_HDR.jpg"
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

      {/* How to Get There */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                {t("location.intro")}
              </p>

              <ul className="space-y-4">
                {howToGetThere.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Car className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button asChild className="bg-orange text-white hover:bg-orange/90">
                  <Link href="/contacto">{t("location.cta")}</Link>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1773.7359684558824!2d-73.9733160248513!3d4.563568754935271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f97004a994e65%3A0x456db2104dfe6214!2sCamping%20El%20Higuer%C3%B3n!5e0!3m2!1ses-419!2sco!4v1777846746167!5m2!1ses-419!2sco"
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("location.mapTitle")}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Weather & Clothing */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t("weather.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("weather.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Weather Cards */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {weatherRecommendations.map((item) => (
                <Card key={item.title} className="border-none bg-white shadow-sm">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Clothing List */}
            <Card className="border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-forest" />
                  {t("clothing.cardTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3">
                  {clothingList.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 text-forest" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Activity Images - Diverse */}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Muro bendito sea/Img03.jpg"
                alt="Escalada deportiva"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/Img22.jpg"
                alt="Boulder en la naturaleza"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20250225_134710067_HDR.jpg"
                alt="Carpas en el camping"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Naturaleza-paisajes/IMG_20250126_162909418_HDR.jpg"
                alt="Paisaje de montaña"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Basic Rules */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t("rules.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("rules.subtitle")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {basicRules.map((rule) => (
              <div
                key={rule.title}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-forest hover:shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-beige">
                  <rule.icon className="h-6 w-6 text-forest" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{rule.title}</h3>
                  <p className="text-muted-foreground">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Images - Diverse */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Muro bendito sea/Img06.jpg"
                alt="Escaladores en el muro"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20260117_080602542_HDR.jpg"
                alt="Fogata en el camping"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/IMG_20250920_100731134_MFNR.jpg"
                alt="Boulder con crashpad"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange" />
                <span className="text-sm font-medium uppercase tracking-wider text-orange">
                  {t("schedule.eyebrow")}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                {t("schedule.title")}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                {t("schedule.intro")}
              </p>

              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3"
                  >
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-orange">{item.category}</span>
                      <span className="font-medium text-white">{item.day}</span>
                    </div>
                    <span className="text-sm text-white/80">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Muro bendito sea/Img05.jpg"
                alt="Escalador en ruta"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Activities Gallery */}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/IMG_20250920_092321682_HDR.jpg"
                alt="Zona de boulder"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20250225_134602260_HDR.jpg"
                alt="Camping entre árboles"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Muro bendito sea/Img11.jpg"
                alt="Vista del muro"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Naturaleza-paisajes/IMG_20250121_174841943_MFNR.jpg"
                alt="Atardecer en la montaña"
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
              <Link href="/contacto">{t("cta.primary")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <a href="https://wa.me/573172973537" target="_blank" rel="noopener noreferrer">
                {t("cta.whatsapp")}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
