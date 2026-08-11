import Image from "next/image"
import { Tent, Flame, Droplets, Moon, Star, CheckCircle, Backpack, ThermometerSnowflake } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CampingPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Camping")

  const campingIncludes = [
    {
      icon: Tent,
      title: t("includes.tents.title"),
      description: t("includes.tents.description"),
    },
    {
      icon: Flame,
      title: t("includes.fire.title"),
      description: t("includes.fire.description"),
    },
    {
      icon: Droplets,
      title: t("includes.water.title"),
      description: t("includes.water.description"),
    },
  ]

  const whatToBring = t.raw("bring.items") as string[]

  const atmosphereFeatures = [
    {
      icon: ThermometerSnowflake,
      title: t("atmosphere.cold.title"),
      description: t("atmosphere.cold.description"),
    },
    {
      icon: Star,
      title: t("atmosphere.stars.title"),
      description: t("atmosphere.stars.description"),
    },
    {
      icon: Moon,
      title: t("atmosphere.silence.title"),
      description: t("atmosphere.silence.description"),
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Camping/IMG_20260116_175442021_MFNR.jpg"
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

      {/* Experience Description */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Tent className="h-5 w-5 text-forest" />
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
                src="/media/Camping/IMG_20250225_134710067_HDR.jpg"
                alt={t("intro.imageAlt")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t("includes.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("includes.subtitle")}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {campingIncludes.map((item) => (
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

      {/* What to Bring */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Camping/IMG_20250129_074449185_HDR.jpg"
                alt={t("bring.imageAlt")}
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Backpack className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  {t("bring.eyebrow")}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {t("bring.title")}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                {t("bring.intro")}
              </p>
              
              <ul className="grid gap-3 sm:grid-cols-2">
                {whatToBring.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Atmosphere */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {t("atmosphere.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-white/80">
              {t("atmosphere.subtitle")}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {atmosphereFeatures.map((feature) => (
              <div 
                key={feature.title}
                className="flex flex-col items-center rounded-xl bg-white/10 p-8 text-center backdrop-blur-sm"
              >
                <feature.icon className="mb-4 h-12 w-12 text-orange" />
                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campfire Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange" />
                <span className="text-sm font-medium uppercase tracking-wider text-orange">
                  {t("fire.eyebrow")}
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {t("fire.title")}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {t("fire.p1")}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("fire.p2")}
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Camping/Fogata1.jpg"
                alt={t("fire.imageAlt")}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Galería de fogatas */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Fogata2.jpg", "Fogata3.jpg", "Fogata4.jpg", "Fogata5.jpg", "Fogata6.jpg", "IMG_20260117_080602542_HDR.jpg"].map((img) => (
              <div key={img} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={`/media/Camping/${img}`}
                  alt={t("fire.galleryAlt")}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería General de Camping */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t("place.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("place.subtitle")}
            </p>
          </div>

          {/* Fila 1: imagen panorámica */}
          <div className="mb-4 relative aspect-[21/9] overflow-hidden rounded-2xl">
            <Image
              src="/media/Camping/IMG_20250920_125059918_HDR.jpg"
              alt="Vista panorámica del camping"
              fill
              className="object-cover"
            />
          </div>

          {/* Fila 2: 3 imágenes */}
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Camping/IMG_20260116_175452246_MFNR.jpg"
                alt="Zona de camping al atardecer"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Camping/IMG_20260116_175500969_MFNR.jpg"
                alt="Ambiente de camping nocturno"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Camping/IMG_20250129_074449185_HDR.jpg"
                alt={t("bring.imageAlt")}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Fila 3: 4 imágenes cuadradas */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20250225_134602260_HDR.jpg"
                alt="Camping en El Higuerón"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20250225_134723182_MFNR.jpg"
                alt="Área de camping"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20250225_134741147_HDR.jpg"
                alt="Naturaleza del camping"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20250225_134909280_HDR.jpg"
                alt="Entorno natural del camping"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <Star className="mx-auto mb-6 h-12 w-12 text-orange" />
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
              <Link href="/visita">{t("cta.secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
