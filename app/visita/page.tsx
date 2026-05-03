import Image from "next/image"
import Link from "next/link"
import { MapPin, Cloud, Shirt, Clock, Leaf, Flame, Trash2, AlertTriangle, Car, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const howToGetThere = [
  "Vereda Aguadulce Choachí",
  "Via Bogotá - Choachí Pr 6+100 Ruta 4006A km23",
  "Algunas zonas cuentan con señal limitada de celular",
  "Coordina tu llegada previamente para recibir indicaciones claras y actualizadas",

  "Importante: Antes de salir, solicita las indicaciones y recomendaciones del estado de la vía.",
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
  "Ropa térmica para la noche",
  "Gorro y guantes",
  "Zapatos de trekking o botas para terreno irregular",
  "Ropa cómoda para escalar",
  "Muda de ropa seca",
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
  { category: "Escalada", day: "Lunes a Viernes", hours: "7:00 AM - 5:00 PM" },
  { category: "Escalada", day: "Sábados, Domingos y Festivos", hours: "7:00 AM - 6:00 PM" },
  { category: "Camping", day: "Todos los días", hours: "Reserva previa" },
  { category: "Caminatas", day: "Todos los días", hours: "Reserva previa" },
  { category: "Talleres", day: "Todos los días", hours: "Reserva previa" },
]

export default function VisitaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Muro bendito sea/IMG_20250322_174755948_HDR.jpg"
            alt="Escalada en El Higuerón"
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
                Camping El Higuerón está ubicado en las montañas de Choachí, dentro del ecosistema de bosque altoandino. Al ser una zona rural de montaña, es importante planificar tu llegada con anticipación.
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

            <div className="overflow-hidden rounded-2xl shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=Vereda+Aguadulce+Choachi+Via+Bogota+Choachi+Pr+6+100+Ruta+4006A+km23&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Camping El Higuerón"
                className="w-full"
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

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Weather Cards */}
            <div className="flex flex-col gap-6 lg:col-span-2">
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
                <ul className="grid gap-3">
                  {clothingList.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 text-forest" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Activity Images - Diverse */}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Muro bendito sea/Img03.jpg"
                alt="Escalada deportiva"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/Img22.jpg"
                alt="Boulder en la naturaleza"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20250225_134710067_HDR.jpg"
                alt="Carpas en el camping"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Naturaleza-paisajes/IMG_20250126_162909418_HDR.jpg"
                alt="Paisaje de montaña"
                fill
                className="object-cover"
              />
            </div>
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
              Ayúdanos a cuidar este espacio
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

          {/* Activity Images - Diverse */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Muro bendito sea/Img06.jpg"
                alt="Escaladores en el muro"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20260117_080602542_HDR.jpg"
                alt="Fogata en el camping"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/IMG_20250920_100731134_MFNR.jpg"
                alt="Boulder con crashpad"
                fill
                className="object-cover"
              />
            </div>
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

              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3"
                  >
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-orange">{item.category}</span>
                      <span className="font-medium text-white">{item.day}</span>
                    </div>
                    <span className="text-sm text-white/80">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Muro bendito sea/Img05.jpg"
                alt="Escalador en ruta"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Activities Gallery */}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/IMG_20250920_092321682_HDR.jpg"
                alt="Zona de boulder"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Camping/IMG_20250225_134602260_HDR.jpg"
                alt="Camping entre árboles"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Muro bendito sea/Img11.jpg"
                alt="Vista del muro"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/media/Naturaleza-paisajes/IMG_20250121_174841943_MFNR.jpg"
                alt="Atardecer en la montaña"
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
              <a href="https://wa.me/573172973537" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
