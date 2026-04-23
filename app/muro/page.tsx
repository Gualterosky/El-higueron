import Image from "next/image"
import Link from "next/link"
import { Mountain, Shield, AlertTriangle, MapPin, Anchor, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const routes = [
  { name: "Jugo de Sangre", level: "5.10c", height: "Por definir" },
  { name: "Pioneros", level: "5.12b", height: "18m" },
  { name: "La Niebla", level: "Proyecto", height: "20m" },
  { name: "Gente Buena", level: "5.9", height: "Por definir" },
  { name: "Perdidos en el Bosque", level: "5.10a", height: "14m" },
  { name: "Permutante", level: "Proyecto", height: "28m" },
  { name: "Payandesuno", level: "5.12b", height: "30m" },
  { name: "China Town", level: "5.12d", height: "33m" },
  { name: "Bendito Sea", level: "5.13a", height: "33m" },
  { name: "Destructor", level: "5.9", height: "14m" },
  { name: "Piscineitor", level: "5.10b", height: "14m" },
  { name: "Chihiza", level: "5.11d", height: "18m" },
  { name: "Los Gnomos de Guayara", level: "5.11c", height: "18m" },
  { name: "El Gangazo", level: "5.9", height: "8m" },
  { name: "Soy Chowi", level: "5.9", height: "Por definir" },
]

const wallFeatures = [
  {
    icon: Mountain,
    title: "Roca Natural",
    description: "Una peña natural con formaciones únicas perfectas para la escalada deportiva.",
  },
  {
    icon: Anchor,
    title: "15 Rutas Equipadas",
    description: "Todas las rutas cuentan con chapas ya ancladas para una escalada segura.",
  },
  {
    icon: Route,
    title: "Múltiples Niveles",
    description: "Rutas de distintos niveles de dificultad para todos los escaladores.",
  },
]

const safetyTips = [
  "Siempre escala con un compañero de confianza",
  "Revisa tu equipo antes de cada pegue",
  "Conoce tus límites y respétalos",
  "Usa casco siempre en la zona",
  "Verifica el estado de las chapas antes de asegurar",
  "Respeta las indicaciones del lugar",
]

export default function MuroPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Muro de escalada Bendito Sea"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Muro Bendito Sea
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Una peña natural con 15 rutas equipadas para la escalada deportiva
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Mountain className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  Muro de Escalada
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Bendito Sea: Escalada en roca natural
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Bendito Sea es una impresionante formación rocosa natural ubicada en el corazón de Camping El Higuerón. Esta peña ofrece una experiencia auténtica de escalada deportiva.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                15 rutas de escalada ya equipadas con chapas ancladas, el muro Bendito Sea es un destino ideal tanto para escaladores principiantes como para aquellos que buscan desafíos más exigentes. Cada ruta ofrece características únicas que te permitirán desarrollar y poner a prueba tus habilidades.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Vista del muro Bendito Sea"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Wall Features */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              Características del muro
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Todo lo que hace especial a Bendito Sea
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {wallFeatures.map((feature) => (
              <Card key={feature.title} className="border-none bg-white shadow-sm">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Routes Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Route className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                Las 15 Rutas
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Rutas de Escalada
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Todas las rutas están equipadas con chapas ancladas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {routes.map((route, index) => (
              <Link key={route.name} href={`/muro/MBS${String(index + 1).padStart(2, "0")}`}>
                <Card className="h-full border-border transition-all hover:border-forest hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <span className="text-xs font-semibold text-orange">{route.level}</span>
                    <CardTitle className="text-sm leading-tight">{route.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{route.height}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Ubicación del muro Bendito Sea"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  Ubicación
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                ¿Dónde encontrar el muro?
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                El muro Bendito Sea se encuentra dentro de las instalaciones de Camping El Higuerón, en medio del bosque alto andino. Su ubicación privilegiada te permite disfrutar de la escalada mientras estás rodeado de un paisaje natural impresionante.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Desde la zona de camping, el acceso al muro es sencillo y está señalizado. Te recomendamos consultar con nuestro equipo para obtener indicaciones precisas y conocer las condiciones del día.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange" />
                <span className="text-sm font-medium uppercase tracking-wider text-orange">
                  Tu Seguridad Primero
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Recomendaciones de Seguridad
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                Aunque el muro Bendito Sea está equipado con chapas ancladas, la escalada sigue siendo una actividad de riesgo. Es fundamental que cada escalador asuma la responsabilidad de su propia seguridad.
              </p>

              <ul className="space-y-3">
                {safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <span className="text-white/90">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Equipo de escalada y seguridad"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            ¿Listo para escalar Bendito Sea?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Consulta la disponibilidad de equipos o planifica tu visita al muro de escalada.
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
