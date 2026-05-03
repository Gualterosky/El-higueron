import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mountain, Ruler, TrendingUp, Anchor, AlertTriangle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const routeData = {
  number: 9,
  routeName: "Bendito Sea",
  name: "5.13a",
  level: "5.13a",
  height: "33m",
  anchors: "15",
  style: "Deportiva",
  description: `
    La línea tiene 4 secciones, cada una con su propio pequeño crux. Hay una zona de descanso completo en medio de la línea. Clavar el tornillo antes de la reunión es aterrador pero totalmente seguro. La reunión y el último tornillo se humedecen bajo lluvia fuerte.
  `,
  tips: [
    "Ruta con nombre del muro - muy significativa",
    "Cuatro secciones distintas cada una con su propio crux",
    "Descanso importante en la mitad de la ruta",
    "El tornillo pre-reunión inspira confianza - ¡es totalmente seguro!",
    "Última sección puede estar mojada después de lluvia",
    "Se requiere técnica y resistencia excepcionales",
  ],
  builders: "Néstor Caro & Juan Hernández, 3 Jun 2024",
  image: "/placeholder.svg?height=800&width=600",
}

const routeDetails = [
  { icon: TrendingUp, label: "Nivel", value: routeData.level },
  { icon: Ruler, label: "Altura", value: routeData.height },
  { icon: Anchor, label: "Chapas", value: routeData.anchors },
  { icon: Mountain, label: "Estilo", value: routeData.style },
]

export default function RouteMBS09Page() {
  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={routeData.image} alt={`Ruta ${routeData.routeName} - Muro Bendito Sea`} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 to-forest/80" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange px-4 py-2">
            <span className="text-sm font-bold text-white">{routeData.level}</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">{routeData.routeName}</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">Muro Bendito Sea - Ruta {routeData.number} de 15</p>
        </div>
      </section>

      <section className="border-b bg-beige py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <Link href="/muro" className="inline-flex items-center gap-2 text-sm font-medium text-forest transition-colors hover:text-forest/80">
            <ArrowLeft className="h-4 w-4" />
            Volver al Muro Bendito Sea
          </Link>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src={routeData.image} alt={`Detalle de la ruta ${routeData.routeName}`} fill className="object-cover" />
            </div>
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Mountain className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">Detalles de la Ruta</span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">{routeData.routeName}</h2>
              <div className="mb-8 grid grid-cols-2 gap-4">
                {routeDetails.map((detail) => (
                  <Card key={detail.label} className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-forest">
                        <detail.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{detail.label}</p>
                        <p className="text-lg font-semibold text-foreground">{detail.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold text-foreground">Descripción</h3>
                <p className="leading-relaxed text-muted-foreground">{routeData.description}</p>
              </div>
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-beige p-4">
                <User className="h-5 w-5 shrink-0 text-forest" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Aperturistas</p>
                  <p className="font-medium text-foreground">{routeData.builders}</p>
                </div>
              </div>
              <div className="rounded-xl bg-beige p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <AlertTriangle className="h-5 w-5 text-orange" />
                  Consejos para esta ruta
                </h3>
                <ul className="space-y-2">
                  {routeData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formulario de registro */}
              <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Registra tu ascenso
                </h3>
                <div className="w-full overflow-hidden rounded-lg">
                  <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSe8tExFJ0hEydSTqm5pFH-95abgVcFjBuLSKzKcXtfHsnS55A/viewform?embedded=true"
                    width="100%"
                    height="1882"
                    style={{ border: 0 }}
                    title="Formulario de registro de ascenso"
                    className="w-full"
                  >
                    Cargando...
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-beige py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              {routeData.number > 1 && (
                <Button asChild variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                  <Link href={`/muro/MBS${String(routeData.number - 1).padStart(2, "0")}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Ruta anterior
                  </Link>
                </Button>
              )}
            </div>
            <Button asChild className="bg-orange text-white hover:bg-orange/90">
              <Link href="/muro">Ver todas las rutas</Link>
            </Button>
            <div>
              {routeData.number < 15 && (
                <Button asChild variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                  <Link href={`/muro/MBS${String(routeData.number + 1).padStart(2, "0")}`}>
                    Ruta siguiente
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">¿Necesitas equipo para escalar?</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">Consulta la disponibilidad de equipos de escalada en Camping El Higuerón.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/equipos">Ver equipos disponibles</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <Link href="/visita">Planifica tu visita</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
