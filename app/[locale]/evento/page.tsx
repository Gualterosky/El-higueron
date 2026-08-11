import type { Metadata } from "next"
import { CalendarX } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { getEventoActivo } from "@/lib/eventos/get-evento"
import { EventoHero } from "@/components/evento/evento-hero"
import { EventoBorradorAviso } from "@/components/evento/evento-borrador-aviso"
import {
  EventoDescripcion,
  EventoDestacados,
  EventoCategorias,
  EventoPremios,
  EventoAgenda,
  EventoInscripcion,
  EventoGaleria,
  EventoFaqs,
  EventoCierre,
} from "@/components/evento/evento-secciones"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const tMeta = await getTranslations({ locale, namespace: "Meta" })
  const evento = await getEventoActivo(locale)

  if (!evento) {
    return {
      title: tMeta("eventoTitleFallback"),
      description: tMeta("eventoDescriptionFallback"),
    }
  }

  return {
    title: tMeta("eventoTitlePattern", { titulo: evento.titulo }),
    description: evento.subtitulo,
  }
}

/** Estado mostrado cuando no hay evento activo o está deshabilitado. */
async function SinEvento() {
  const t = await getTranslations("Evento")

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-beige">
        <CalendarX className="h-8 w-8 text-forest" />
      </div>
      <h1 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
        {t("empty.title")}
      </h1>
      <p className="mb-8 max-w-md text-pretty text-muted-foreground">
        {t("empty.body")}
      </p>
      <Button asChild className="bg-forest text-white hover:bg-forest/90">
        <Link href="/">{t("empty.cta")}</Link>
      </Button>
    </div>
  )
}

export default async function EventoPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const evento = await getEventoActivo(locale)

  if (!evento) {
    return <SinEvento />
  }

  return (
    <div className="flex flex-col">
      {evento.esBorrador && <EventoBorradorAviso />}
      <EventoHero evento={evento} />
      <EventoDescripcion evento={evento} />
      <EventoDestacados evento={evento} />
      <EventoCategorias evento={evento} />
      <EventoPremios evento={evento} />
      <EventoAgenda evento={evento} />
      <EventoInscripcion evento={evento} />
      <EventoGaleria evento={evento} />
      <EventoFaqs evento={evento} />
      <EventoCierre evento={evento} />
    </div>
  )
}
