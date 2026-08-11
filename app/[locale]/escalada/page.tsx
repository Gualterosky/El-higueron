import {setRequestLocale} from 'next-intl/server'
import {getTranslations} from 'next-intl/server'
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Mountain, Shield, AlertTriangle, CircleDot, Package, DollarSign, Users, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GuidesModal } from "@/components/guides-modal"

export default async function EscaladaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Escalada')

  const climbingModalities = [
    {
      title: t('modalities.muro.title'),
      description: t('modalities.muro.description'),
      icon: Mountain,
      href: "/muro",
      image: "/media/Muro bendito sea/Img07.jpg",
      routes: t('modalities.muro.routes'),
      height: t('modalities.muro.height'),
    },
    {
      title: t('modalities.boulder.title'),
      description: t('modalities.boulder.description'),
      icon: CircleDot,
      href: "/boulder",
      image: "/media/Boulders/IMG_20250920_100731134_MFNR.jpg",
      routes: t('modalities.boulder.routes'),
      height: t('modalities.boulder.height'),
    },
  ]

  const includedInEntry = [
    { item: t('pricing.includes.accessWall'), included: true },
    { item: t('pricing.includes.accessBoulder'), included: true },
    { item: t('pricing.includes.trails'), included: true },
    { item: t('pricing.includes.facilities'), included: true },
    { item: t('pricing.includes.insurance'), included: false },
    { item: t('pricing.includes.gear'), included: false },
  ]

  const beginnersItems = t.raw('beginners.items') as string[]
  const safetyTips = t.raw('safety.tips') as string[]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Muro bendito sea/Img01.jpg"
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

      {/* Climbing Modalities */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Mountain className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                {t('modalities.eyebrow')}
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t('modalities.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t('modalities.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {climbingModalities.map((modality) => (
              <Card key={modality.title} className="group overflow-hidden border-border transition-all hover:border-forest hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={modality.image}
                    alt={modality.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange">
                      <modality.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-white">{modality.title}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="mb-4 text-muted-foreground">{modality.description}</p>
                  <div className="mb-6 flex gap-6 text-sm">
                    <div>
                      <span className="block font-semibold text-foreground">{modality.routes}</span>
                      <span className="text-muted-foreground">{t('modalities.availableLabel')}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-foreground">{modality.height}</span>
                      <span className="text-muted-foreground">{t('modalities.heightLabel')}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full bg-forest text-white hover:bg-forest/90">
                    <Link href={modality.href}>{t('modalities.cta')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  {t('pricing.eyebrow')}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {t('pricing.title')}
              </h2>

              <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-forest">{t('pricing.price')}</span>
                  <span className="text-muted-foreground">{t('pricing.unit')}</span>
                </div>

                <h3 className="mb-4 font-semibold text-foreground">{t('pricing.includesTitle')}</h3>
                <ul className="space-y-3">
                  {includedInEntry.map((item) => (
                    <li key={item.item} className="flex items-center gap-3">
                      {item.included ? (
                        <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                      )}
                      <span className={item.included ? "text-foreground" : "text-muted-foreground"}>
                        {item.item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-orange/30 bg-orange/10 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange" />
                  <span className="font-semibold text-foreground">{t('pricing.important')}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('pricing.importantText')}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* For Beginners */}
              <Card className="border-forest bg-forest text-white">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange" />
                    <span className="text-sm font-medium uppercase tracking-wider text-orange">
                      {t('beginners.eyebrow')}
                    </span>
                  </div>
                  <CardTitle className="text-2xl text-white">
                    {t('beginners.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/90">
                    {t('beginners.body')}
                  </p>
                  <ul className="space-y-2 text-white/90">
                    {beginnersItems.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 shrink-0 text-orange" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <GuidesModal />
                </CardContent>
              </Card>

              {/* Equipment Rental */}
              <Card className="border-border">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <Package className="h-5 w-5 text-forest" />
                    <span className="text-sm font-medium uppercase tracking-wider text-forest">
                      {t('rental.eyebrow')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">
                    {t('rental.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {t('rental.body')}
                  </p>
                  <Button asChild variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-white">
                    <Link href="/equipos">{t('rental.cta')}</Link>
                  </Button>
                </CardContent>
              </Card>
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
                  {t('safety.eyebrow')}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                {t('safety.title')}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                {t('safety.intro')}
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
                src="/media/Muro bendito sea/Img08.jpg"
                alt={t('safety.imageAlt')}
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
            {t('cta.title')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/muro">{t('cta.primary')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <Link href="/visita">{t('cta.secondary')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
