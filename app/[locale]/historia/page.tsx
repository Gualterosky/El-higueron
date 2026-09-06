import Image from "next/image"
import { Construction, ImageIcon, Trees, Sparkles } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HistoriaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Historia")
  const tPanel = await getTranslations("Panel")

  const timelineItems = [0, 1].map((index) => ({
    date: t(`timeline.items.${index}.date`),
    title: t(`timeline.items.${index}.title`),
    description: t(`timeline.items.${index}.description`),
  }))

  const imagePlaceholders = [0, 1, 2, 3]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Naturaleza-paisajes/IMG_20250126_162909418_HDR.jpg"
            alt={t("hero.imageAlt")}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 to-forest/80" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <Badge variant="secondary" className="mb-4">
            {tPanel("comingSoon")}
          </Badge>
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Construction notice */}
      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50/60 px-4 py-4">
            <Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div>
              <p className="font-semibold text-amber-800">{t("notice.title")}</p>
              <p className="text-sm text-amber-800">{t("notice.body")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Orígenes */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Trees className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  {t("origins.eyebrow")}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {t("origins.title")}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {t("origins.p1")}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("origins.p2")}
              </p>
            </div>

            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-beige/10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                <ImageIcon className="h-7 w-7" />
              </span>
              <p className="max-w-xs px-4 text-sm text-muted-foreground">
                {t("origins.imagePlaceholder")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Línea de tiempo / Festivales */}
      <section className="bg-beige py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                {t("timeline.eyebrow")}
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t("timeline.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">{t("timeline.subtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {timelineItems.map((item) => (
              <Card key={item.title} className="border-none bg-white shadow-sm">
                <CardContent className="p-8">
                  <span className="mb-3 inline-block rounded-full bg-forest/10 px-3 py-1 text-sm font-medium text-forest">
                    {item.date}
                  </span>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
            {t("timeline.note")}
          </p>
        </div>
      </section>

      {/* Espacio para galería de imágenes históricas */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t("gallery.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">{t("gallery.subtitle")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {imagePlaceholders.map((index) => (
              <div
                key={index}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-beige/10 text-center"
              >
                <ImageIcon className="h-8 w-8 text-forest/50" />
                <p className="max-w-[10rem] px-2 text-xs text-muted-foreground">
                  {t("gallery.placeholder")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{t("cta.title")}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">{t("cta.subtitle")}</p>
          <Button asChild className="bg-orange text-white hover:bg-orange/90">
            <Link href="/visita">{t("cta.button")}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
