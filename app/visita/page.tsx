import Image from "next/image"
import Link from "next/link"
import { MapPin, Cloud, Shirt, Clock, Leaf, Flame, Trash2, AlertTriangle, Car, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const howToGetThere = [
  "Vereda Aguadulce Choachí",
  "Via Bogotá - Choachí Pr 6+100 Ruta 4006A km23",
]

const weatherRecommendations = [
  {
    icon: Cloud,
    title: "Clima Variable",
    description: "Clima frio. El clima de montaña puede cambiar rápidamente. Prepárate para sol, lluvia y frío en un mismo día. Temperatura promedio 15°C",
  },
  {
    icon: Shirt,
    title: "Vestimenta recomendada",
    description: "Depende mucho de la actividad que vayas a hacer, pero por lo general ven preparado para el frio y la lluvia",
  },
]

const clothingList = [
  "Chaqueta impermeable y cortaviento",
  "Ropa térmica para las noches",
  "Gorro y guantes para el frío",
  "Botas o zapatos de trekking cómodos",
  "Ropa cómoda para escalar",
  "Ropa de cambio)",
]

const basicRules = [
  {
    icon: Leaf,
    title: "Respeta la naturaleza",
    description: "No arranques plantas, no molestes a los animales y camina solo por los senderos marcados.",
  },
  {
    icon: Trash2,
    title: "No dejes basura",
    description: "Todo lo que traigas, debes llevártelo. No dejes ningún residuo en el lugar.",
  },
  {
    icon: Flame,
    title: "Fogatas responsables",
    description: "Solo haz fogatas en las zonas designadas. Asegúrate de apagarlas completamente antes de retirarte.",
  },
  {
    icon: AlertTriangle,
    title: "Seguridad personal",
    description: "Escala de manera responsable, usa el equipo adecuado y conoce tus límites.",
  },
]

const schedule = [
  { day: "Lunes a Viernes", hours: "7:00 AM - 5:00 PM" },
  { day: "Sábados, Domingos y Festivos", hours: "7:00 AM - 6:00 PM" },

]

export default function VisitaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1920"
            alt="Sendero hacia El Higuerón"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Planifica tu Visita
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Todo lo que necesitas saber antes de venir
          </p>
        </div>
      </section>

      {/* How to Get There */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  Ubicación
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                ¿Cómo llegar?
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                El Higuerón está ubicado en un entorno de montaña, por lo que es importante planificar tu llegada con anticipación.
              </p>

              <ul className="space-y-4">
                {howToGetThere.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Car className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button asChild className="bg-orange text-white hover:bg-orange/90">
                  <Link href="/contacto">Solicitar indicaciones</Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Camino hacia El Higuerón"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Weather & Clothing */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              Clima y Vestimenta
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Prepárate para las condiciones de montaña
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Weather Cards */}
            <div className="flex flex-col gap-6">
              {weatherRecommendations.map((item) => (
                <Card key={item.title} className="border-none bg-white shadow-sm">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Clothing List */}
            <Card className="border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-forest" />
                  Qué vestir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {clothingList.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 text-forest" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Basic Rules */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Normas Básicas
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Ayúdanos a cuidar este espacio para las futuras generaciones
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {basicRules.map((rule) => (
              <div
                key={rule.title}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-forest hover:shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-beige">
                  <rule.icon className="h-6 w-6 text-forest" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{rule.title}</h3>
                  <p className="text-muted-foreground">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange" />
                <span className="text-sm font-medium uppercase tracking-wider text-orange">
                  Horarios
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Horarios de visita
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                Los horarios pueden variar según la temporada y las condiciones climáticas. Te recomendamos confirmar antes de tu visita.
              </p>

              <div className="space-y-4">
                {schedule.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3"
                  >
                    <span className="font-medium text-white">{item.day}</span>
                    <span className="text-white/80">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Amanecer en El Higuerón"
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
            ¿Tienes más preguntas?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Contáctanos y resolveremos todas tus dudas. Estamos aquí para ayudarte a planificar tu visita perfecta.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/contacto">Contactar</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
