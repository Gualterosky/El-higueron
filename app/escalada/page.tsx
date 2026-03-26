import Image from "next/image"
import Link from "next/link"
import { Mountain, Shield, AlertTriangle, TrendingUp, Target, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const routeGrades = [
  { grade: "5.9", level: "Principiante", description: "Ideal para quienes están comenzando en la escalada deportiva." },
  { grade: "5.10a-c", level: "Intermedio", description: "Rutas con mayor técnica y resistencia requerida." },
  { grade: "5.10d-5.11", level: "Avanzado", description: "Desafíos que requieren experiencia y buen estado físico." },
  { grade: "5.12", level: "Experto", description: "Las rutas más desafiantes del sector para escaladores experimentados." },
]

const safetyTips = [
  "Siempre escala con un compañero de confianza",
  "Revisa tu equipo antes de cada escalada",
  "Conoce tus límites y no los excedas",
  "Usa casco siempre que estés en la zona de escalada",
  "Aprende y practica las técnicas de aseguramiento correctas",
  "Respeta las indicaciones del lugar",
]

const climbingFeatures = [
  {
    icon: Mountain,
    title: "Roca Natural",
    description: "Escalada en formaciones de roca natural con características únicas del terreno andino.",
  },
  {
    icon: Target,
    title: "Rutas Equipadas",
    description: "Más de 12 rutas deportivas debidamente equipadas con anclajes seguros.",
  },
  {
    icon: Users,
    title: "Para Todos",
    description: "Rutas de diferentes niveles de dificultad, desde principiantes hasta expertos.",
  },
]

export default function EscaladaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Escalador en el sector Bendito Sea"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Escalada en Bendito Sea
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Descubre el sector de escalada deportiva en el corazón del bosque alto andino
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
                  Sector Bendito Sea
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Escalada deportiva en roca natural
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                El sector Bendito Sea ofrece una experiencia única de escalada deportiva en Colombia. Con más de 12 rutas de diferentes niveles de dificultad, es el lugar perfecto tanto para quienes dan sus primeros pasos en la escalada como para escaladores experimentados que buscan nuevos desafíos.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                La roca natural presenta características técnicas variadas que te permitirán desarrollar diferentes habilidades mientras disfrutas del paisaje incomparable del bosque alto andino.
              </p>
            </div>
            
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Escalador en ruta"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Climbing Features */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              Características del sector
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Todo lo que necesitas saber sobre la escalada en Bendito Sea
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {climbingFeatures.map((feature) => (
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

      {/* Route Grades */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                Niveles de Dificultad
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Rutas de Escalada
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Las rutas van desde 5.9 hasta 5.12 en la escala Yosemite Decimal System (YDS), utilizada en Colombia para clasificar la dificultad de las rutas de escalada.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {routeGrades.map((route) => (
              <Card key={route.grade} className="border-border transition-all hover:border-forest hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-forest text-lg font-bold text-white">
                    {route.grade}
                  </div>
                  <CardTitle className="text-lg">{route.level}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{route.description}</p>
                </CardContent>
              </Card>
            ))}
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
                La escalada es una actividad de riesgo. Aunque el sector está equipado y mantenido, es fundamental que cada escalador asuma la responsabilidad de su propia seguridad y la de sus compañeros.
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
                alt="Equipo de escalada"
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
            ¿Listo para escalar?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Consulta la disponibilidad de equipos o planifica tu visita al sector Bendito Sea.
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
