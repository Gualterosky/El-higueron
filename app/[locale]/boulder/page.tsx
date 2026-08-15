import {setRequestLocale} from 'next-intl/server'
import {getTranslations} from 'next-intl/server'
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { CircleDot, Shield, Trees, TrendingUp, AlertTriangle, Footprints } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { assertSectionVisible } from "@/lib/site-settings"

export default async function BoulderPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  await assertSectionVisible("boulder", locale)
  const t = await getTranslations('Boulder')

  const boulderLevels = [
    { grade: t('levels.v0.grade'), level: t('levels.v0.level'), description: t('levels.v0.description') },
    { grade: t('levels.v2.grade'), level: t('levels.v2.level'), description: t('levels.v2.description') },
    { grade: t('levels.v4.grade'), level: t('levels.v4.level'), description: t('levels.v4.description') },
    { grade: t('levels.v6.grade'), level: t('levels.v6.level'), description: t('levels.v6.description') },
  ]

  const boulderFeatures = [
    {
      icon: CircleDot,
      title: t('features.blocks.title'),
      description: t('features.blocks.description'),
    },
    {
      icon: Trees,
      title: t('features.nature.title'),
      description: t('features.nature.description'),
    },
    {
      icon: Footprints,
      title: t('features.landing.title'),
      description: t('features.landing.description'),
    },
  ]

  const safetyTips = t.raw('crashpads.tips') as string[]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Boulders/IMG_20250920_092321682_HDR.jpg"
            alt={t('hero.imageAlt')}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Hero Image Destacada */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src="/media/Boulders/IMG_20250920_162115607_MFNR.jpg"
            alt={t('banner.imageAlt')}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
            <p className="text-lg font-medium text-white/90 lg:text-2xl">
              {t('banner.caption')}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <CircleDot className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  {t('intro.eyebrow')}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {t('intro.title')}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {t('intro.p1')}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t('intro.p2')}
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/Img17.jpg"
                alt={t('intro.imageAlt')}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Galería de Boulder */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t('gallery.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t('gallery.subtitle')}
            </p>
          </div>

          {/* Fila principal: 2 imágenes grandes */}
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/IMG_20250914_143103460_MFNR.jpg"
                alt="Boulder en roca natural"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/IMG_20250920_100731134_MFNR.jpg"
                alt="Escalada en bloque"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Fila secundaria: 3 imágenes */}
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/IMG_20250920_100954059_HDR.jpg"
                alt="Detalle de agarre en boulder"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/Img18.jpg"
                alt="Problema de boulder"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/Img20.jpg"
                alt="Escalador trabajando problema"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Fila tercera: 4 imágenes pequeñas */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/Img21.jpg"
                alt="Boulder zona 1"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/Img22.jpg"
                alt="Boulder zona 2"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/Img23.jpg"
                alt="Boulder zona 3"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/IMG_20260430_120707095_HDR.jpg"
                alt="Vista de la zona de boulder"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Boulder Features */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t('features.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {boulderFeatures.map((feature) => (
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

      {/* Boulder Levels */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                {t('levels.eyebrow')}
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t('levels.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t('levels.subtitle')}
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {boulderLevels.map((level) => (
              <Card key={level.grade} className="border-border transition-all hover:border-forest hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-forest text-lg font-bold text-white">
                    {level.grade}
                  </div>
                  <CardTitle className="text-lg">{level.level}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crashpads Section */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/IMG_20260430_120745606_HDR.jpg"
                alt={t('crashpads.imageAlt')}
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange" />
                <span className="text-sm font-medium uppercase tracking-wider text-orange">
                  {t('crashpads.eyebrow')}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                {t('crashpads.title')}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-white/90">
                {t('crashpads.p1')}
              </p>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                {t('crashpads.p2')}
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/equipos">{t('cta.primary')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <Link href="/contacto">{t('cta.secondary')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
