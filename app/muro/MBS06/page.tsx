import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mountain, Ruler, TrendingUp, Anchor, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// ============================================
// DATOS DE LA RUTA - EDITAR AQUÍ
// ============================================
const routeData = {
  number: 6,
  name: "Fluidez",
  level: "5.9",
  height: "14m",
  anchors: "8",
  style: "Vertical",
  description: `
    Una escalada fluida y continua que requiere ritmo y consistencia. Los movimientos están bien distribuidos sin secciones que causen fricción. Ideal para trabajar técnica de escalada limpia y eficiente.
  `,
  tips: [
    "Mantén un ritmo constante sin pausas prolongadas",
    "Enfócate en la economía de movimiento",
    "Esta ruta premia la técnica sobre la potencia pura",
  ],
  image: "/placeholder.svg?height=800&width=600",
}
// ============================================

const routeDetails = [
  { icon: TrendingUp, label: "Nivel", value: routeData.level },
  { icon: Ruler, label: "Altura", value: routeData.height },
  { icon: Anchor, label: "Chapas", value: routeData.anchors },
  { icon: Mountain, label: "Estilo", value: routeData.style },
]

export default function RouteMBS06Page() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={routeData.image}
            alt={`Ruta ${routeData.name} - Muro Bendito Sea`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 to-forest/80" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange px-4 py-2">
            <span className="text-sm font-bold text-white">MBS{String(routeData.number).padStart(2, "0")}</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {routeData.name}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Muro Bendito Sea - Ruta {routeData.number} de 15
          </p>
        </div>
      </section>

      {/* Back Navigation */}
      <section className="border-b bg-beige py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <Link 
            href="/muro" 
            className="inline-flex items-center gap-2 text-sm font-medium text-forest transition-colors hover:text-forest/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Muro Bendito Sea
          </Link>
        </div>
      </section>

      {/* Route Details */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src={routeData.image}
                alt={`Detalle de la ruta ${routeData.name}`}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Mountain className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  Detalles de la Ruta
                </span>
              </div>
              
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                {routeData.name}
              </h2>

              {/* Route Stats */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                {routeDetails.map((detail) => (
                  <Card key={detail.label} className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-forest">
                        <detail.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {detail.label}
                        </p>
                        <p className="text-lg font-semibold text-foreground">{detail.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold text-foreground">Descripción</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {routeData.description}
                </p>
              </div>

              {/* Tips */}
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
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Between Routes */}
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

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            ¿Necesitas equipo para escalar?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Consulta la disponibilidad de equipos de escalada en Camping El Higuerón.
          </p>
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
