import Image from "next/image"
import { Package, Wrench, MessageCircle } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { assertSectionVisible } from "@/lib/site-settings"
import { getEquipmentCatalog } from "@/lib/equipos/queries"
import { isEquipmentCategory } from "@/lib/equipos/types"
import { EquipmentComments } from "@/components/equipos/equipment-comments"
import { EquipmentPostForm } from "@/components/equipos/equipment-post-form"

type Props = {
  params: Promise<{ locale: string }>
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

export default async function EquiposPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await assertSectionVisible("equipos", locale)
  const [t, equipmentList] = await Promise.all([
    getTranslations("Equipos"),
    getEquipmentCatalog(),
  ])

  const importantNotes = t.raw("notes.items") as string[]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://pub-b8789ea28b254e56a01798832eb96334.r2.dev/Muro%20bendito%20sea/Img09.jpg"
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
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Wrench className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                {t("intro.eyebrow")}
              </span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              {t("intro.title")}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("intro.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Equipment List */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t("list.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("list.subtitle")}
            </p>
          </div>
          
          {equipmentList.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("empty")}</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {equipmentList.map((item) => {
                const totalAvailable = item.variants.reduce(
                  (sum, variant) => sum + variant.availableQuantity,
                  0,
                )
                const hasStock = totalAvailable > 0
                const categoryLabel = isEquipmentCategory(item.category)
                  ? t(`categories.${item.category}`)
                  : item.category

                return (
                  <Card
                    key={item.id}
                    className={`overflow-hidden border-none shadow-sm transition-all hover:shadow-md ${hasStock ? "bg-white" : "bg-white/60"}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className={`object-cover ${hasStock ? "" : "opacity-60"}`}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-beige/40">
                          <Package className="h-16 w-16 text-forest/40" aria-hidden />
                        </div>
                      )}
                      {!hasStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-muted-foreground">
                            {t("unavailable")}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${hasStock ? "bg-forest" : "bg-muted"}`}>
                          <Package className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{item.name}</CardTitle>
                          <span className="mt-1 inline-block rounded-full bg-beige px-3 py-1 text-xs font-medium text-forest">
                            {categoryLabel}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {item.description ? (
                        <p className="text-muted-foreground">{item.description}</p>
                      ) : null}

                      {item.pricePerDay != null ? (
                        <p className="text-sm font-medium text-forest">
                          {t("pricePerDay", { price: CURRENCY_FORMATTER.format(item.pricePerDay) })}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap gap-2">
                        {item.variants.map((variant) => (
                          <span
                            key={variant.id}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              variant.availableQuantity > 0
                                ? "bg-forest/10 text-forest"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {variant.label}: {t("availableCount", { count: variant.availableQuantity })}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Comments */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                {t("posts.eyebrow")}
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t("posts.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("posts.subtitle")}
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <EquipmentComments locale={locale} />
            </div>

            <div className="rounded-xl bg-beige p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                {t("posts.formTitle")}
              </h3>
              <EquipmentPostForm />
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              <Image
                src="https://pub-b8789ea28b254e56a01798832eb96334.r2.dev/Equipos/crashpad%202c.png"
                alt={t("notes.imageAlt")}
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {t("notes.title")}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                {t("notes.intro")}
              </p>
              
              <ul className="space-y-4">
                {importantNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-forest" />
                    <span className="text-muted-foreground">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <MessageCircle className="mx-auto mb-6 h-12 w-12 text-orange" />
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/contacto">{t("cta.primary")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-forest">
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
