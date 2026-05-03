import Image from "next/image"
import Link from "next/link"
import { Wrench, Shield, HardHat, Footprints, CircleDot, MessageCircle, Tent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const equipment = [
  {
    icon: HardHat,
    name: "Casco",
    description: "Cascos de seguridad para protección durante la escalada. Recomendado para todas las actividades en pared.",
    forActivity: "Escalada",
    available: true,
    image: "/media/Equipos/Casco 1.png",
  },
  {
    icon: Footprints,
    name: "Pies de Gato",
    description: "Zapatos especializados para escalada en varias tallas. Esenciales para un mejor agarre en la roca.",
    forActivity: "Escalada y Boulder",
    available: true,
    image: "/media/Equipos/gatos A.jpg",
  },
  {
    icon: Shield,
    name: "Arnés",
    description: "Arneses de escalada deportiva en diferentes tallas para asegurar comodidad y seguridad durante la escalada.",
    forActivity: "Escalada",
    available: true,
    image: "/media/Equipos/Arnes 2.png",
  },
  {
    icon: CircleDot,
    name: "Crashpads",
    description: "Colchonetas de protección para caídas durante la práctica de boulder. Fundamentales para una sesión segura.",
    forActivity: "Boulder",
    available: true,
    image: "/media/Equipos/Crashpad 1a.png",
  },
  {
    icon: Footprints,
    name: "Botas",
    description: "Botas de montaña para senderismo y actividades al aire libre.",
    forActivity: "Senderismo",
    available: false,
    image: "/media/Equipos/Gatos B.jpg",
  },
  {
    icon: Tent,
    name: "Carpas de Camping",
    description: "Carpas para acampar en el lugar, ideales para quienes no cuentan con su propio equipo de camping.",
    forActivity: "Camping",
    available: false,
    image: "/media/Camping/IMG_20250225_134602260_HDR.jpg",
  },
]

const importantNotes = [
  "La disponibilidad de equipos puede variar según la demanda.",
  "Se recomienda reservar con anticipación, especialmente en temporada alta.",
  "Como garantía del equipo rentado, se debe dejar un documento de identidad válido en el ingreso. Este será devuelto en el momento en que se retorne el equipo en buen estado.",
  "El usuario es responsable del cuidado del equipo durante su uso.",
]

export default function EquiposPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Muro bendito sea/Img09.jpg"
            alt="Equipos de escalada"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Equipos
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Equipamiento disponible para tu aventura
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Wrench className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                Equipamiento
              </span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Todo lo que necesitas para escalar
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              En Camping El Higuerón contamos con equipos disponibles para que puedas disfrutar de la escalada y el boulder aunque no tengas tu propio material. Consulta la disponibilidad antes de tu visita.
            </p>
          </div>
        </div>
      </section>

      {/* Equipment List */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              Equipos Disponibles
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Material de calidad para tu seguridad y comodidad
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {equipment.map((item) => (
              <Card key={item.name} className={`overflow-hidden border-none shadow-sm transition-all hover:shadow-md ${item.available ? "bg-white" : "bg-white/60 opacity-60"}`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {!item.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-muted-foreground">
                        No disponible
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${item.available ? "bg-forest" : "bg-muted"}`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <CardTitle className="text-xl">{item.name}</CardTitle>
                      </div>
                      <span className="inline-block rounded-full bg-beige px-3 py-1 text-xs font-medium text-forest">
                        {item.forActivity}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              <Image
                src="/media/Equipos/crashpad 2c.png"
                alt="Equipos de escalada disponibles"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Información importante
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Ten en cuenta las siguientes consideraciones sobre el uso de los equipos:
              </p>
              
              <ul className="space-y-4">
                {importantNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-forest" />
                    <span className="text-muted-foreground">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <MessageCircle className="mx-auto mb-6 h-12 w-12 text-orange" />
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Consultar disponibilidad
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Contáctanos para verificar la disponibilidad de equipos en las fechas de tu visita. Te responderemos lo antes posible.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/contacto">Contactar ahora</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-forest">
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
