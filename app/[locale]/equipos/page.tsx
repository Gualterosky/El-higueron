import Image from "next/image"
import { Wrench, MessageCircle } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { assertSectionVisible } from "@/lib/site-settings"
import {
  getAvailableEquipmentItems,
  getEquipmentCategoryPriceRanges,
  type AvailableEquipmentItem,
} from "@/lib/equipos/item-queries"
import {
  EquipmentCategoryCard,
  type EquipmentCardItem,
  type EquipmentCardSize,
} from "@/components/equipos/equipment-category-card"
import { EquipmentComments } from "@/components/equipos/equipment-comments"
import { EquipmentPostForm } from "@/components/equipos/equipment-post-form"
import { R2_BASE_URL } from "@/lib/media/r2-url"

type Props = {
  params: Promise<{ locale: string }>
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

/** Categorías mostradas en el catálogo público, en orden. "otros" se omite. */
const PUBLIC_EQUIPMENT_CATEGORIES = ["casco", "arnes", "crashpad", "gatos", "botas", "carpa"] as const

type PublicEquipmentCategory = (typeof PUBLIC_EQUIPMENT_CATEGORIES)[number]

/** Imagen representativa por categoría. */
const CATEGORY_IMAGES: Record<PublicEquipmentCategory, string | null> = {
  casco: `${R2_BASE_URL}/Equipos/Casco%201.png`,
  arnes: `${R2_BASE_URL}/Equipos/arnes-black-diamond-azul-1793726151946.jpg`,
  crashpad: `${R2_BASE_URL}/Equipos/crashpad-grande-doble-1793726205684.jpg`,
  gatos: `${R2_BASE_URL}/Equipos/Gatos%20Full.png`,
  botas: `${R2_BASE_URL}/Equipos/1000279163-1794342223883.jpg`,
  carpa: `${R2_BASE_URL}/Equipos/carpa-simond-mt500-1793733232477.jpg`,
}

function parseSizeValue(size: string): number {
  return Number.parseFloat(size.replace(",", "."))
}

function compareSizesDesc(a: string, b: string): number {
  const na = parseSizeValue(a)
  const nb = parseSizeValue(b)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na
  return b.localeCompare(a)
}

export default async function EquiposPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await assertSectionVisible("equipos", locale)
  const [t, priceRanges, availableItems] = await Promise.all([
    getTranslations("Equipos"),
    getEquipmentCategoryPriceRanges(),
    getAvailableEquipmentItems(),
  ])

  const importantNotes = t.raw("notes.items") as string[]

  const availableByCategory = new Map<string, AvailableEquipmentItem[]>()
  for (const item of availableItems) {
    const list = availableByCategory.get(item.category) ?? []
    list.push(item)
    availableByCategory.set(item.category, list)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={`${R2_BASE_URL}/Muro%20bendito%20sea/Img09.jpg`}
            alt={t("hero.imageAlt")}
            fill
            sizes="100vw"
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
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PUBLIC_EQUIPMENT_CATEGORIES.map((category) => {
              const items = availableByCategory.get(category) ?? []
              const priceRange = priceRanges.get(category)
              const isSized = category === "gatos" || category === "botas"

              let sizes: EquipmentCardSize[] | undefined
              let uniqueCount = 0
              let groupedItems: EquipmentCardItem[] = []
              let totalAvailable = items.length

              if (isSized) {
                const counts = new Map<string, number>()
                for (const item of items) {
                  const talla = item.talla?.trim()
                  if (!talla) continue
                  if (talla.startsWith("ID-")) uniqueCount++
                  else counts.set(talla, (counts.get(talla) ?? 0) + 1)
                }
                sizes = [...counts].map(([size, count]) => ({ size, count }))
                sizes.sort((a, b) => compareSizesDesc(a.size, b.size))
                totalAvailable = uniqueCount + sizes.reduce((sum, s) => sum + s.count, 0)
              } else {
                const counts = new Map<string, number>()
                for (const item of items) counts.set(item.name, (counts.get(item.name) ?? 0) + 1)
                groupedItems = [...counts].map(([name, count]) => ({ name, count }))
              }

              const priceText = priceRange
                ? priceRange.minPrice === priceRange.maxPrice
                  ? t("pricePerDay", { price: CURRENCY_FORMATTER.format(priceRange.minPrice) })
                  : t("priceRange", {
                      min: CURRENCY_FORMATTER.format(priceRange.minPrice),
                      max: CURRENCY_FORMATTER.format(priceRange.maxPrice),
                    })
                : null

              return (
                <EquipmentCategoryCard
                  key={category}
                  name={t(`categories.${category}`)}
                  imageUrl={CATEGORY_IMAGES[category]}
                  totalAvailable={totalAvailable}
                  sizes={sizes}
                  uniqueCount={uniqueCount}
                  items={groupedItems}
                  priceText={priceText}
                  labels={{
                    available: t("availableCount", { count: totalAvailable }),
                    noAvailability: t("noAvailability"),
                    sizes: t("sizesLabel"),
                    items: t("itemsLabel"),
                    uniqueSize: t("uniqueSizeCount", { count: uniqueCount }),
                    more: (count) => t("moreItems", { count }),
                  }}
                />
              )
            })}
          </div>
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
                src={`${R2_BASE_URL}/Equipos/crashpad%202c.png`}
                alt={t("notes.imageAlt")}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
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
