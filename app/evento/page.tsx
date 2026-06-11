import type { Metadata } from "next"
import Link from "next/link"
import { CalendarX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEventoActivo } from "@/lib/eventos/config"
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

const eventoActivo = getEventoActivo()

export const metadata: Metadata = {
  title: eventoActivo ? `${eventoActivo.titulo} | El Higuerón` : "Eventos | El Higuerón",
  description: eventoActivo?.subtitulo ?? "Próximos eventos en Camping El Higuerón.",
}

/** Estado mostrado cuando no hay evento activo o está deshabilitado. */
function SinEvento() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-beige">
        <CalendarX className="h-8 w-8 text-forest" />
      </div>
      <h1 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
        No hay eventos programados
      </h1>
      <p className="mb-8 max-w-md text-pretty text-muted-foreground">
        Por ahora no tenemos eventos activos. Vuelve pronto para conocer nuestras próximas
        actividades, festivales y talleres.
      </p>
      <Button asChild className="bg-forest text-white hover:bg-forest/90">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}

export default function EventoPage() {
  const evento = eventoActivo

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
