import Link from "next/link"
import Image from "next/image"
import { Mountain, Tent, CircleDot, Trees, Flame, MapPin, Star, Footprints, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const experiences = [
  {
    icon: Mountain,
    title: "Escalada Deportiva",
    description: "Más de 15 rutas de escalada en roca natural con diferentes niveles de dificultad en el sector Bendito Sea.",
  },
  {
    icon: CircleDot,
    title: "Boulder",
    description: "Zona de boulders para todos los niveles, rodeada del paisaje único del bosque alto andino.",
  },
  {
    icon: Tent,
    title: "Camping",
    description: "Espacios para acampar en un ambiente tranquilo y seguro, con fogatas bajo las estrellas y actividades recreativas.",
  },
  {
    icon: Footprints,
    title: "Senderismo",
    description: "Recorridos por senderos del bosque altoandino y el paramo cruz verde, rodeados de fauna y flora del nativa de los Andes colombianos.",
  },
  {
    icon: Sparkles,
    title: "Talleres al Aire Libre",
    description: "Actividades y talleres en contacto con la naturaleza: proximamente.",
  },
]

const features = [
  { icon: Mountain, label: "+15 rutas de escalada", description: "5.9 - 5,13" },
  { icon: CircleDot, label: "Zona de boulders", description: "Distintos niveles" },
  { icon: Tent, label: "Espacio para camping", description: "Ambiente natural" },
  { icon: Flame, label: "Talleres y senderismo", description: "Actividades al aire libre" },
]

const galleryImages = [
  { src: "/media/Muro bendito sea/Img06.jpg", alt: "Escalador en roca" },
  { src: "/media/Camping/IMG_20250225_134602260_HDR.jpg", alt: "Zona de camping" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_135937239_HDR.jpg", alt: "Bosque alto andino" },
  { src: "/media/Boulders/IMG_20250920_100731134_MFNR.jpg", alt: "Boulder al atardecer" },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Naturaleza-paisajes/IMG_20250126_162909418_HDR.jpg"
            alt="Montañas y naturaleza en Camping El Higuerón"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/40 to-forest/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-6 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Escalada, camping y conexión con la naturaleza en el corazón de la montaña
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto mb-8 max-w-2xl text-pretty text-lg text-white/90 md:text-xl">
            Vive una experiencia única en Camping El Higuerón, un refugio natural en el bosque altoandino de Choachí.
          </p>
          <div className="animate-fade-in-up animation-delay-200">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/visita">Planifica tu visita</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1">
            <div className="h-2 w-full rounded-full bg-white/70" />
          </div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              Vive la experiencia
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Descubre las diferentes actividades que puedes disfrutar en Camping El Higuerón
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
            {experiences.map((exp) => (
              <Card
                key={exp.title}
                className="group border-none bg-white shadow-sm transition-all hover:shadow-md"
              >
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-beige transition-colors group-hover:bg-forest">
                    <exp.icon className="h-8 w-8 text-forest transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{exp.title}</h3>
                  <p className="text-muted-foreground">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Activities CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              Elige tu aventura
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Accede a toda la información sobre nuestras actividades principales
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md bg-white">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/media/Muro bendito sea/Img06.jpg"
                    alt="Escalada en muro"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-2xl font-bold text-forest">Escalada en Muro</h3>
                  <p className="mb-6 text-muted-foreground">
                    Explora más de 50 rutas de escalada en nuestro muro deportivo. Desde principiantes hasta expertos, encuentra tu próximo desafío.
                  </p>
                  <Button asChild className="w-full bg-forest text-white hover:bg-forest/90">
                    <Link href="/escalada">Ver Rutas de Escalada</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md bg-white">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/media/Camping/IMG_20250225_134602260_HDR.jpg"
                    alt="Camping"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-2xl font-bold text-forest">Camping y Naturaleza</h3>
                  <p className="mb-6 text-muted-foreground">
                    Disfruta de una experiencia única acampando en la naturaleza. Fogatas, senderismo y conexión con el bosque altoandino.
                  </p>
                  <Button asChild className="w-full bg-forest text-white hover:bg-forest/90">
                    <Link href="/camping">Explorar Camping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Naturaleza-paisajes/IMG_20250225_140002347_MFNR.jpg"
                alt="Bosque alto andino"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Trees className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  Sobre el lugar
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Un refugio entre roca y el bosque de niebla
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Camping El Higuerón está ubicado en las montañas de Choachí, rodeado de bosque altoandino y formaciones rocosas que dan vida al sector de escalada Bendito Sea. Es un espacio pensado para quienes buscan desconectarse de lo urbano y reconectar con lo esencial.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Aquí no hay ruido de ciudad ni distracciones innecesarias. Solo el sonido del viento, las aves y el fuego en la noche. Un lugar para acampar, escalar y vivir la montaña de forma simple, real y cercana.
              </p>
              <div className="mb-8 flex items-center gap-2 text-forest">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Choachí Cundinamarca - Aguadulce</span>
              </div>
              <Button asChild size="lg" className="bg-forest text-white hover:bg-forest/90">
                <Link href="/el-lugar">Conoce el lugar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Lo que encontrarás
            </h2>
            <p className="mx-auto max-w-2xl text-white/80">
              Todo lo que necesitas para una experiencia inolvidable en la montaña
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex flex-col items-center rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <feature.icon className="mb-4 h-10 w-10 text-orange" />
                <h3 className="mb-1 text-lg font-semibold text-white">{feature.label}</h3>
                <p className="text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment CTA */}
      <section className="bg-beige py-14 lg:py-20">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            ¿No tienes equipo de escalada?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Contamos con equipo en renta para que puedas escalar sin preocupaciones. Desde arneses y cuerdas hasta zapatos de escalada.
          </p>
          <Button asChild size="lg" className="bg-forest text-white hover:bg-forest/90">
            <Link href="/equipos">Ver renta de equipos</Link>
          </Button>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Galería
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Un vistazo a lo que te espera en Camping El Higuerón
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <Link href="/galeria">Ver galería completa</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-beige py-20 lg:py-28">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-orange/10" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-forest/10" />

        <div className="container relative mx-auto px-4 text-center lg:px-8">
          <Star className="mx-auto mb-6 h-12 w-12 text-orange" />
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Reserva o consulta disponibilidad
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Estamos aquí para ayudarte a planificar tu próxima aventura en la montaña. Contáctanos y resolveremos todas tus dudas.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/contacto">Contactar ahora</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <Link href="/visita">Más información</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
