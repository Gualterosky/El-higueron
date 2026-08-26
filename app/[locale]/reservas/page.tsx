import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { CalendarCheck } from "lucide-react"
import { assertSectionVisible } from "@/lib/site-settings"
import { ReservationForm } from "@/components/reservation-form"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ type?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Reservas" })
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  }
}

export default async function ReservasPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await assertSectionVisible("reservas", locale)
  const t = await getTranslations("Reservas")
  const { type } = await searchParams

  const defaultType = type === "escalada" ? "escalada" : "camping"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-forest">
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange/20">
            <CalendarCheck className="h-8 w-8 text-orange" />
          </div>
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-beige py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-2xl bg-white shadow-md">
              <div className="border-b border-border px-8 py-6">
                <h2 className="text-xl font-semibold text-forest">{t("form.heading")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("form.subheading")}</p>
              </div>
              <div className="px-8 py-8">
                <ReservationForm defaultType={defaultType} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
