import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Evento } from "@/lib/eventos/types"

export function EventoHero({ evento }: { evento: Evento }) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={evento.imagenHero || "/placeholder.svg"}
          alt={evento.titulo}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/60 to-forest/80" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
        <span className="animate-fade-in-up mb-4 inline-block rounded-full bg-orange px-4 py-1.5 text-sm font-medium uppercase tracking-wider text-white">
          {evento.etiqueta}
        </span>
        <h1 className="animate-fade-in-up animation-delay-100 mb-4 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          {evento.titulo}
        </h1>
        <p className="animate-fade-in-up animation-delay-200 mx-auto mb-8 max-w-2xl text-pretty text-lg text-white/90 md:text-xl">
          {evento.subtitulo}
        </p>

        <div className="animate-fade-in-up animation-delay-300 mb-8 flex flex-col items-center justify-center gap-4 text-white/90 sm:flex-row sm:gap-8">
          {evento.fecha && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange" />
              <span>{evento.fecha}</span>
            </div>
          )}
          {evento.lugar && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange" />
              <span>{evento.lugar}</span>
            </div>
          )}
        </div>

        {evento.textoCta && (
          <Button
            asChild
            size="lg"
            className="animate-fade-in-up animation-delay-400 bg-orange text-white hover:bg-orange/90"
          >
            <a href="#inscripcion">{evento.textoCta}</a>
          </Button>
        )}
      </div>
    </section>
  )
}
