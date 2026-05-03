import Image from "next/image"
import Link from "next/link"
import { Trees, Bird, Flower2, Mountain, Wind, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const floraFauna = [
  {
    icon: Bird,
    title: "Aves Nativas",
    description: "Presencia de colibríes, tangaras, carpinteros y otras especies propias del bosque.",
  },
  {
    icon: Flower2,
    title: "Vegetación",
    description: "Bromelias, musgos, helechos, orquídeas y vegetación de alta montaña.",
  },
  {
    icon: Trees,
    title: "Bosque Andino",
    description: "Siete cueros, gaques, higuerones y otras especies que forman un ecosistema denso y húmedo",
  },
]

const characteristics = [
  {
    icon: Mountain,
    title: "Altitud",
    description: "Ubicado en zona de montaña dentro del bosque altoandino a 3050 msnm",
  },
  {
    icon: Wind,
    title: "Clima Frio",
    description: "Días frescos con cambios constantes y noches frías.",
  },
  {
    icon: Droplets,
    title: "Aire Puro",
    description: "Aire limpio, humedad alta y contacto directo con el bosque.",
  },
]

export default function ElLugarPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Naturaleza-paisajes/IMG_20250126_162756601_HDR.jpg"
            alt="Bosque alto andino en El Higuerón"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Nuestro entorno
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Un refugio natural entre roca y bosque altoandino
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
                Camping El Higuerón está ubicado en las montañas de Choachí, dentro del ecosistema de bosque altoandino. Un entorno de neblina, humedad y vegetación densa, donde la montaña se vive de forma directa y sin intermediarios.
              </p>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Aquí el paisaje no es solo visual: se siente.
                El viento entre los árboles, el canto de las aves y el silencio de la noche crean un ambiente que cambia constantemente y te obliga a adaptarte al ritmo natural del lugar.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Es un espacio para desconectarse de lo urbano, respirar aire frío de montaña y habitar el entorno tal como es: simple, vivo y auténtico.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Naturaleza-paisajes/IMG_20250225_140005398_MFNR.jpg"
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
              Descubre la biodiversidad del ecosistema
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
                Conexión con el entorno
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-white/90">
                En El Higuerón no hay prisa.
                El tiempo cambia de ritmo y la experiencia se vuelve más simple: caminar, escalar, observar o simplemente estar.
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
                src="/media/Naturaleza-paisajes/IMG_20250121_174841943_MFNR.jpg"
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
