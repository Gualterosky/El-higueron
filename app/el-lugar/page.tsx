import Image from "next/image"
import Link from "next/link"
import { Trees, Bird, Flower2, Mountain, Wind, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const floraFauna = [
  {
    icon: Bird,
    title: "Aves Nativas",
    description: "Colibríes, tangaras, y diversas especies endémicas que habitan el bosque alto andino.",
  },
  {
    icon: Flower2,
    title: "Plantas Nativas",
    description: "Frailejones, orquídeas, bromelias y una gran variedad de especies del páramo.",
  },
  {
    icon: Trees,
    title: "Bosque Andino",
    description: "Encenillos, robles, cedros y árboles nativos que conforman este ecosistema único.",
  },
]

const characteristics = [
  {
    icon: Mountain,
    title: "Altitud",
    description: "Ubicado en las montañas del bosque alto andino colombiano.",
  },
  {
    icon: Wind,
    title: "Clima Fresco",
    description: "Temperaturas frescas durante el día y frías en la noche.",
  },
  {
    icon: Droplets,
    title: "Aire Puro",
    description: "Ambiente limpio y oxigenado, lejos de la contaminación urbana.",
  },
]

export default function ElLugarPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Bosque alto andino en El Higuerón"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            El Lugar
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Un santuario natural en el corazón del bosque alto andino
          </p>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Trees className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  Nuestro Entorno
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                El Bosque Alto Andino
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Camping El Higuerón está ubicado en uno de los ecosistemas más especiales de Colombia: el bosque alto andino. Este ambiente único se caracteriza por su vegetación densa, sus nieblas misteriosas y una biodiversidad extraordinaria.
              </p>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Aquí, la naturaleza te envuelve con sus sonidos, sus aromas y su energía. El canto de las aves al amanecer, el murmullo del viento entre los árboles y el silencio profundo de las noches estrelladas crean una experiencia única de conexión con la naturaleza.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Es un lugar para desconectarse del ruido de la ciudad, respirar aire puro y redescubrir la paz que solo la montaña puede ofrecer.
              </p>
            </div>
            
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Vista del bosque alto andino"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Characteristics */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              Características del lugar
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Un ambiente natural privilegiado para la aventura y el descanso
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {characteristics.map((item) => (
              <Card key={item.title} className="border-none bg-white shadow-sm">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Flora y Fauna */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Flora y Fauna
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Descubre la biodiversidad del ecosistema alto andino
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {floraFauna.map((item) => (
              <div 
                key={item.title}
                className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-forest hover:shadow-md"
              >
                <item.icon className="mb-4 h-10 w-10 text-forest transition-colors group-hover:text-orange" />
                <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connection with Nature */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Conexión con la naturaleza
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-white/90">
                En El Higuerón, cada momento es una oportunidad para reconectarte con lo esencial. El ritmo de la naturaleza te invita a desacelerar, a observar, a escuchar.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                Ya sea escalando, caminando por los senderos o simplemente sentado junto a la fogata, sentirás cómo la montaña te recarga de energía y tranquilidad.
              </p>
              <Button asChild className="bg-orange text-white hover:bg-orange/90">
                <Link href="/visita">Planifica tu visita</Link>
              </Button>
            </div>
            
            <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Atardecer en la montaña"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
