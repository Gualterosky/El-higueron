import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getIcono } from "@/lib/eventos/iconos"
import type { Evento } from "@/lib/eventos/types"

/** Encabezado reutilizable de sección. */
function TituloSeccion({ etiqueta, titulo }: { etiqueta: string; titulo: string }) {
  return (
    <div className="mb-12 text-center">
      <span className="mb-2 block text-sm font-medium uppercase tracking-wider text-forest">
        {etiqueta}
      </span>
      <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">{titulo}</h2>
    </div>
  )
}

/** Descripción general del evento. */
export function EventoDescripcion({ evento }: { evento: Evento }) {
  if (!evento.descripcion?.length) return null
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4 lg:px-8">
        <div className="space-y-4 text-center">
          {evento.descripcion.map((parrafo, i) => (
            <p key={i} className="text-pretty text-lg leading-relaxed text-muted-foreground">
              {parrafo}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Puntos destacados con icono. */
export async function EventoDestacados({ evento }: { evento: Evento }) {
  if (!evento.destacados?.length) return null
  const t = await getTranslations("Evento")

  return (
    <section className="bg-beige py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <TituloSeccion
          etiqueta={t("sections.destacados.eyebrow")}
          titulo={t("sections.destacados.title")}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {evento.destacados.map((d) => {
            const Icono = getIcono(d.icono)
            return (
              <Card key={d.titulo} className="border-border text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest">
                    <Icono className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{d.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{d.descripcion}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Categorías o niveles de participación. */
export async function EventoCategorias({ evento }: { evento: Evento }) {
  if (!evento.categorias?.length) return null
  const t = await getTranslations("Evento")

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <TituloSeccion
          etiqueta={t("sections.categorias.eyebrow")}
          titulo={t("sections.categorias.title")}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {evento.categorias.map((c) => (
            <Card key={c.nombre} className="border-border transition-all hover:border-forest hover:shadow-md">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-bold text-forest">{c.nombre}</h3>
                <p className="text-sm text-muted-foreground">{c.descripcion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Premios del evento. */
export async function EventoPremios({ evento }: { evento: Evento }) {
  if (!evento.premios?.length) return null
  const t = await getTranslations("Evento")

  return (
    <section className="bg-forest py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-sm font-medium uppercase tracking-wider text-orange">
            {t("sections.premios.eyebrow")}
          </span>
          <h2 className="text-balance text-3xl font-bold text-white md:text-4xl">
            {t("sections.premios.title")}
          </h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {evento.premios.map((p) => (
            <div key={p.posicion} className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <span className="mb-1 block text-sm font-medium uppercase tracking-wider text-orange">
                {p.posicion}
              </span>
              <p className="mb-2 text-lg font-semibold text-white">{p.descripcion}</p>
              {p.valor && <p className="text-white/80">{p.valor}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Cronograma del evento. */
export async function EventoAgenda({ evento }: { evento: Evento }) {
  if (!evento.agenda?.length) return null
  const t = await getTranslations("Evento")

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4 lg:px-8">
        <TituloSeccion
          etiqueta={t("sections.agenda.eyebrow")}
          titulo={t("sections.agenda.title")}
        />
        <ol className="relative border-l border-border">
          {evento.agenda.map((item, i) => (
            <li key={i} className="mb-8 ml-6 last:mb-0">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-orange ring-4 ring-background">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="mb-1 block text-sm font-semibold text-forest">{item.hora}</span>
              <h3 className="font-semibold text-foreground">{item.titulo}</h3>
              {item.descripcion && (
                <p className="text-sm text-muted-foreground">{item.descripcion}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Planes de inscripción. */
export async function EventoInscripcion({ evento }: { evento: Evento }) {
  if (!evento.planes?.length) return null
  const t = await getTranslations("Evento")

  return (
    <section id="inscripcion" className="bg-beige py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <TituloSeccion
          etiqueta={t("sections.inscripcion.eyebrow")}
          titulo={t("sections.inscripcion.title")}
        />
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {evento.planes.map((plan) => (
            <Card
              key={plan.nombre}
              className={
                plan.destacado
                  ? "border-forest bg-forest text-white shadow-lg"
                  : "border-border bg-white"
              }
            >
              <CardContent className="p-8">
                <h3
                  className={
                    plan.destacado
                      ? "mb-1 text-xl font-bold text-white"
                      : "mb-1 text-xl font-bold text-foreground"
                  }
                >
                  {plan.nombre}
                </h3>
                <div className="mb-6 flex items-baseline gap-2">
                  <span
                    className={
                      plan.destacado
                        ? "text-3xl font-bold text-orange"
                        : "text-3xl font-bold text-forest"
                    }
                  >
                    {plan.precio}
                  </span>
                  {plan.unidad && (
                    <span className={plan.destacado ? "text-white/70" : "text-muted-foreground"}>
                      {plan.unidad}
                    </span>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.incluye.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle
                        className={
                          plan.destacado
                            ? "mt-0.5 h-5 w-5 shrink-0 text-orange"
                            : "mt-0.5 h-5 w-5 shrink-0 text-forest"
                        }
                      />
                      <span className={plan.destacado ? "text-white/90" : "text-muted-foreground"}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-foreground">
          {t("sections.inscripcion.note")}
        </p>
      </div>
    </section>
  )
}

/** Galería de imágenes. */
export async function EventoGaleria({ evento }: { evento: Evento }) {
  if (!evento.galeria?.length) return null
  const t = await getTranslations("Evento")

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <TituloSeccion
          etiqueta={t("sections.galeria.eyebrow")}
          titulo={t("sections.galeria.title")}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {evento.galeria.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={src || "/placeholder.svg"}
                alt={`${evento.titulo} - imagen ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Preguntas frecuentes. */
export async function EventoFaqs({ evento }: { evento: Evento }) {
  if (!evento.faqs?.length) return null
  const t = await getTranslations("Evento")

  return (
    <section className="bg-beige py-16 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4 lg:px-8">
        <TituloSeccion
          etiqueta={t("sections.faqs.eyebrow")}
          titulo={t("sections.faqs.title")}
        />
        <Accordion type="single" collapsible className="w-full">
          {evento.faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-semibold text-foreground">
                {faq.pregunta}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.respuesta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

/** Sección de cierre con CTA. */
export function EventoCierre({ evento }: { evento: Evento }) {
  if (!evento.cierreTitulo) return null
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 text-center lg:px-8">
        <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
          {evento.cierreTitulo}
        </h2>
        {evento.cierreDescripcion && (
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            {evento.cierreDescripcion}
          </p>
        )}
      </div>
    </section>
  )
}
