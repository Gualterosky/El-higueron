import Image from "next/image"
import Link from "next/link"
import { Tent, Flame, Droplets, Moon, Star, CheckCircle, Backpack, ThermometerSnowflake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const campingIncludes = [
  {
    icon: Tent,
    title: "Espacio para Carpas",
    description: "Zonas delimitadas y niveladas para instalar tu carpa con comodidad.",
  },
  {
    icon: Flame,
    title: "Zona de Fogata",
    description: "Área común para hacer fogatas de manera segura y responsable.",
  },
  {
    icon: Droplets,
    title: "Acceso a Agua",
    description: "Punto de agua disponible para las necesidades básicas durante tu estadía.",
  },
]

const whatToBring = [
  "Carpa resistente al frío y la humedad",
  "Sleeping bag para temperaturas bajas",
  "Colchoneta o aislante térmico",
  "Ropa abrigada en capas",
  "Linterna o frontal con baterías extra",
  "Comida y snacks suficientes",
  "Utensilios para cocinar",
  "Botiquín básico de primeros auxilios",
]

const atmosphereFeatures = [
  {
    icon: ThermometerSnowflake,
    title: "Noches Frías",
    description: "Las temperaturas pueden bajar considerablemente. Ven preparado con buen abrigo.",
  },
  {
    icon: Star,
    title: "Cielo Estrellado",
    description: "Lejos de la contaminación lumínica, las noches revelan un cielo impresionante.",
  },
  {
    icon: Moon,
    title: "Silencio Natural",
    description: "Solo el sonido del viento y la naturaleza acompañarán tu descanso.",
  },
]

export default function CampingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Camping/IMG_20260116_175442021_MFNR.jpg"
            alt="Zona de camping en El Higuerón"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Camping
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Acampa bajo las estrellas en el bosque alto andino
          </p>
        </div>
      </section>

      {/* Experience Description */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Tent className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  La Experiencia
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Camping en la naturaleza
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Camping El Higuerón ofrece un espacio para acampar en un ambiente tranquilo y seguro, rodeado de la naturaleza del bosque alto andino. Aquí podrás desconectarte del mundo moderno y reconectarte con lo esencial.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Ya sea que vengas a escalar, a hacer boulder, o simplemente a disfrutar de la montaña, nuestro camping es el lugar perfecto para pasar la noche y despertar con los sonidos del bosque.
              </p>
            </div>
            
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Camping/IMG_20250225_134710067_HDR.jpg"
                alt="Carpas en el camping"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              ¿Qué incluye?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Lo que encontrarás en nuestra zona de camping
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {campingIncludes.map((item) => (
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

      {/* What to Bring */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Camping/IMG_20250225_134830298_MFNR.jpg"
                alt="Equipo de camping"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Backpack className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  Prepárate
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                ¿Qué traer?
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Para disfrutar al máximo tu experiencia de camping, te recomendamos traer lo siguiente:
              </p>
              
              <ul className="grid gap-3 sm:grid-cols-2">
                {whatToBring.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Atmosphere */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              El ambiente
            </h2>
            <p className="mx-auto max-w-2xl text-white/80">
              Lo que te espera en las noches de montaña
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {atmosphereFeatures.map((feature) => (
              <div 
                key={feature.title}
                className="flex flex-col items-center rounded-xl bg-white/10 p-8 text-center backdrop-blur-sm"
              >
                <feature.icon className="mb-4 h-12 w-12 text-orange" />
                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campfire Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange" />
                <span className="text-sm font-medium uppercase tracking-wider text-orange">
                  Fogatas
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Noches junto al fuego
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                No hay nada como terminar el día alrededor de una fogata. Compartir historias, calentar las manos y contemplar las llamas mientras el cielo se llena de estrellas es parte esencial de la experiencia en El Higuerón.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Contamos con una zona designada para fogatas donde podrás disfrutar de este momento de manera segura y responsable con el entorno natural.
              </p>
            </div>
            
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Camping/IMG_20260117_080602542_HDR.jpg"
                alt="Fogata en el camping"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <Star className="mx-auto mb-6 h-12 w-12 text-orange" />
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            ¿Listo para acampar?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Consulta disponibilidad y planifica tu próxima noche bajo las estrellas.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/contacto">Consultar disponibilidad</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <Link href="/visita">Información de visita</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
