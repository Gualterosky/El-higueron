import {setRequestLocale} from 'next-intl/server'
import {getTranslations} from 'next-intl/server'
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { Mountain, Tent, CircleDot, Trees, Flame, MapPin, Star, Footprints, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getHiddenSections } from "@/lib/site-settings"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Home')
  const hidden = await getHiddenSections()

  const experiences = [
    {
      icon: Mountain,
      title: t('experiences.escalada.title'),
      description: t('experiences.escalada.description'),
      section: "escalada" as const,
    },
    {
      icon: CircleDot,
      title: t('experiences.boulder.title'),
      description: t('experiences.boulder.description'),
      section: "boulder" as const,
    },
    {
      icon: Tent,
      title: t('experiences.camping.title'),
      description: t('experiences.camping.description'),
      section: "camping" as const,
    },
    {
      icon: Footprints,
      title: t('experiences.senderismo.title'),
      description: t('experiences.senderismo.description'),
    },
    {
      icon: Sparkles,
      title: t('experiences.talleres.title'),
      description: t('experiences.talleres.description'),
    },
  ].filter((exp) => !("section" in exp && exp.section && hidden[exp.section]))

  const features = [
    {
      icon: Mountain,
      label: t('features.routes.label'),
      description: t('features.routes.description'),
      section: "escalada" as const,
    },
    {
      icon: CircleDot,
      label: t('features.boulder.label'),
      description: t('features.boulder.description'),
      section: "boulder" as const,
    },
    {
      icon: Tent,
      label: t('features.camping.label'),
      description: t('features.camping.description'),
      section: "camping" as const,
    },
    {
      icon: Flame,
      label: t('features.activities.label'),
      description: t('features.activities.description'),
    },
  ].filter((feature) => !("section" in feature && feature.section && hidden[feature.section]))

  const galleryAlts = t.raw('gallery.alts') as string[]
  const galleryImages = [
    { src: "/media/Muro bendito sea/Img06.jpg", alt: galleryAlts[0] },
    { src: "/media/Camping/IMG_20250225_134602260_HDR.jpg", alt: galleryAlts[1] },
    { src: "/media/Naturaleza-paisajes/IMG_20250225_135937239_HDR.jpg", alt: galleryAlts[2] },
    { src: "/media/Boulders/IMG_20250920_100731134_MFNR.jpg", alt: galleryAlts[3] },
  ]

  const showEscalada = !hidden.escalada
  const showCamping = !hidden.camping
  const showAdventures = showEscalada || showCamping
  const showEquipos = !hidden.equipos
  const showGaleria = !hidden.galeria
  const showVisita = !hidden.visita

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Naturaleza-paisajes/IMG_20250126_162909418_HDR.jpg"
            alt={t('hero.imageAlt')}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/40 to-forest/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-6 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto mb-8 max-w-2xl text-pretty text-lg text-white/90 md:text-xl">
            {t('hero.subtitle')}
          </p>
          {showVisita ? (
            <div className="animate-fade-in-up animation-delay-200">
              <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
                <Link href="/visita">{t('hero.cta')}</Link>
              </Button>
            </div>
          ) : null}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1">
            <div className="h-2 w-full rounded-full bg-white/70" />
          </div>
        </div>
      </section>

      {/* Experience Highlights */}
      {experiences.length > 0 ? (
        <section className="bg-beige py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
                {t('experiences.title')}
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                {t('experiences.subtitle')}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
              {experiences.map((exp) => (
                <Card
                  key={exp.title}
                  className="group border-none bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-beige transition-colors group-hover:bg-forest">
                      <exp.icon className="h-8 w-8 text-forest transition-colors group-hover:text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Activities CTA Section */}
      {showAdventures ? (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
                {t('adventures.title')}
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                {t('adventures.subtitle')}
              </p>
            </div>

            <div className={`grid gap-8 ${showEscalada && showCamping ? "md:grid-cols-2" : "md:grid-cols-1 md:max-w-xl md:mx-auto"}`}>
              {showEscalada ? (
                <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md bg-white">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src="/media/Muro bendito sea/Img06.jpg"
                        alt={t('adventures.escalada.imageAlt')}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="mb-3 text-2xl font-bold text-forest">{t('adventures.escalada.title')}</h3>
                      <Button asChild className="w-full bg-forest text-white hover:bg-forest/90">
                        <Link href="/escalada">{t('adventures.escalada.cta')}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {showCamping ? (
                <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md bg-white">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src="/media/Camping/IMG_20250225_134602260_HDR.jpg"
                        alt={t('adventures.camping.imageAlt')}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="mb-3 text-2xl font-bold text-forest">{t('adventures.camping.title')}</h3>
                      <Button asChild className="w-full bg-forest text-white hover:bg-forest/90">
                        <Link href="/camping">{t('adventures.camping.cta')}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* About Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Naturaleza-paisajes/IMG_20250225_140002347_MFNR.jpg"
                alt={t('about.imageAlt')}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Trees className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  {t('about.eyebrow')}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {t('about.title')}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {t('about.p1')}
              </p>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                {t('about.p2')}
              </p>
              <div className="mb-8 flex items-center gap-2 text-forest">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">{t('about.location')}</span>
              </div>
              <Button asChild size="lg" className="bg-forest text-white hover:bg-forest/90">
                <Link href="/el-lugar">{t('about.cta')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      {features.length > 0 ? (
        <section className="bg-forest py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                {t('features.title')}
              </h2>
              <p className="mx-auto max-w-2xl text-white/80">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col items-center rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  <feature.icon className="mb-4 h-10 w-10 text-orange" />
                  <h3 className="mb-1 text-lg font-semibold text-white">{feature.label}</h3>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Equipment CTA */}
      {showEquipos ? (
        <section className="bg-beige py-14 lg:py-20">
          <div className="container mx-auto px-4 text-center lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              {t('equipment.title')}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              {t('equipment.description')}
            </p>
            <Button asChild size="lg" className="bg-forest text-white hover:bg-forest/90">
              <Link href="/equipos">{t('equipment.cta')}</Link>
            </Button>
          </div>
        </section>
      ) : null}

      {/* Gallery Preview */}
      {showGaleria ? (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                {t('gallery.title')}
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                {t('gallery.subtitle')}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                <Link href="/galeria">{t('gallery.cta')}</Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-beige py-20 lg:py-28">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-orange/10" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-forest/10" />

        <div className="container relative mx-auto px-4 text-center lg:px-8">
          <Star className="mx-auto mb-6 h-12 w-12 text-orange" />
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t('cta.description')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/contacto">{t('cta.primary')}</Link>
            </Button>
            {showVisita ? (
              <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                <Link href="/visita">{t('cta.secondary')}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
