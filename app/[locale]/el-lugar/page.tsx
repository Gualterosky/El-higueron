import Image from "next/image"
import { Trees, Bird, Flower2, Mountain, Wind, Droplets } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ElLugarPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("ElLugar")

  const floraFauna = [
    {
      icon: Bird,
      title: t("floraFauna.birds.title"),
      description: t("floraFauna.birds.description"),
    },
    {
      icon: Flower2,
      title: t("floraFauna.vegetation.title"),
      description: t("floraFauna.vegetation.description"),
    },
    {
      icon: Trees,
      title: t("floraFauna.forest.title"),
      description: t("floraFauna.forest.description"),
    },
  ]

  const characteristics = [
    {
      icon: Mountain,
      title: t("characteristics.altitude.title"),
      description: t("characteristics.altitude.description"),
    },
    {
      icon: Wind,
      title: t("characteristics.climate.title"),
      description: t("characteristics.climate.description"),
    },
    {
      icon: Droplets,
      title: t("characteristics.air.title"),
      description: t("characteristics.air.description"),
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Naturaleza-paisajes/IMG_20250126_162756601_HDR.jpg"
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

      {/* Description Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Trees className="h-5 w-5 text-forest" />
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
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {t("intro.p2")}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("intro.p3")}
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Naturaleza-paisajes/IMG_20250225_140005398_MFNR.jpg"
                alt={t("intro.imageAlt")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Characteristics */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t("characteristics.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("characteristics.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {characteristics.map((item) => (
              <Card key={item.title} className="border-none bg-white shadow-sm">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Flora y Fauna */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t("floraFauna.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("floraFauna.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {floraFauna.map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-forest hover:shadow-md"
              >
                <item.icon className="mb-4 h-10 w-10 text-forest transition-colors group-hover:text-orange" />
                <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connection with Nature */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                {t("connection.title")}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-white/90">
                {t("connection.p1")}
              </p>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                {t("connection.p2")}
              </p>
              <Button asChild className="bg-orange text-white hover:bg-orange/90">
                <Link href="/visita">{t("connection.cta")}</Link>
              </Button>
            </div>

            <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src="/media/Naturaleza-paisajes/IMG_20250121_174841943_MFNR.jpg"
                alt={t("connection.imageAlt")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
