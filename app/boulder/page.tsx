import Image from "next/image"
import Link from "next/link"
import { CircleDot, Shield, Trees, TrendingUp, AlertTriangle, Footprints } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const boulderLevels = [
  { grade: "V0-V1", level: "Iniciación", description: "Problemas básicos ideales para conocer la disciplina y desarrollar técnica." },
  { grade: "V2-V3", level: "Principiante", description: "Mayor complejidad en movimientos y mejor condición física requerida." },
  { grade: "V4-V5", level: "Intermedio", description: "Problemas técnicos que requieren fuerza y lectura de movimientos." },
  { grade: "V6+", level: "Avanzado", description: "Desafíos exigentes para escaladores con experiencia en boulder." },
]

const boulderFeatures = [
  {
    icon: CircleDot,
    title: "Bloques Naturales",
    description: "Formaciones rocosas naturales con diversidad de agarres y movimientos.",
  },
  {
    icon: Trees,
    title: "Entorno Natural",
    description: "Boulder al aire libre rodeado del paisaje del bosque alto andino.",
  },
  {
    icon: Footprints,
    title: "Zona de Aterrizaje",
    description: "Áreas con terreno adecuado para la práctica segura con crashpads.",
  },
]

const safetyTips = [
  "Siempre usa crashpads para proteger las caídas",
  "Practica con un spotter que te ayude a guiar las caídas",
  "Revisa la zona de aterrizaje antes de cada intento",
  "Calienta adecuadamente antes de intentar problemas difíciles",
  "Conoce tus límites y descansa cuando sea necesario",
]

export default function BoulderPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/Boulders/IMG_20250920_092321682_HDR.jpg"
            alt="Zona de boulder en El Higuerón"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/70" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Boulder
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Escalada en bloque en un entorno natural único
          </p>
        </div>
      </section>

      {/* Hero Image Destacada */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src="/media/Boulders/IMG_20250920_162115607_MFNR.jpg"
            alt="Boulder en El Higuerón - acción en roca natural"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
            <p className="text-lg font-medium text-white/90 lg:text-2xl">
              Roca natural, movimiento puro
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <CircleDot className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium uppercase tracking-wider text-forest">
                  Zona de Boulder
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Escalada en bloque al aire libre
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                La zona de boulder de Camping El Higuerón ofrece una experiencia única de escalada en bloque. Rodeado del bosque alto andino, encontrarás diversos problemas en roca natural que pondrán a prueba tu técnica, fuerza y creatividad.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                El boulder es una disciplina que permite un contacto más directo con la roca, sin cuerdas ni arneses, donde cada movimiento cuenta y la lectura del problema es fundamental para el éxito.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/Img17.jpg"
                alt="Escalador en boulder"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Galería de Boulder */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              La zona en imágenes
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Bloques naturales, caídas y movimiento en el bosque alto andino
            </p>
          </div>

          {/* Fila principal: 2 imágenes grandes */}
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/IMG_20250914_143103460_MFNR.jpg"
                alt="Boulder en roca natural"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/IMG_20250920_100731134_MFNR.jpg"
                alt="Escalada en bloque"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Fila secundaria: 3 imágenes */}
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/IMG_20250920_100954059_HDR.jpg"
                alt="Detalle de agarre en boulder"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/Img18.jpg"
                alt="Problema de boulder"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/Img20.jpg"
                alt="Escalador trabajando problema"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Fila tercera: 4 imágenes pequeñas */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/Img21.jpg"
                alt="Boulder zona 1"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/Img22.jpg"
                alt="Boulder zona 2"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/Img23.jpg"
                alt="Boulder zona 3"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/media/Boulders/IMG_20260430_120707095_HDR.jpg"
                alt="Vista de la zona de boulder"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Boulder Features */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              Características de la zona
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Un espacio natural para la práctica del boulder
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {boulderFeatures.map((feature) => (
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

      {/* Boulder Levels */}
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
              Problemas por nivel
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Clasificación según la escala V (Hueco Scale), la más utilizada para boulder en Colombia y Latinoamérica.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {boulderLevels.map((level) => (
              <Card key={level.grade} className="border-border transition-all hover:border-forest hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-forest text-lg font-bold text-white">
                    {level.grade}
                  </div>
                  <CardTitle className="text-lg">{level.level}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crashpads Section */}
      <section className="bg-forest py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/media/Boulders/IMG_20260430_120745606_HDR.jpg"
                alt="Crashpads para boulder"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange" />
                <span className="text-sm font-medium uppercase tracking-wider text-orange">
                  Seguridad
                </span>
              </div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Uso de Crashpads
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-white/90">
                Los crashpads son colchonetas especiales diseñadas para amortiguar las caídas durante la práctica del boulder. Son esenciales para practicar de forma segura.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                Consulta la disponibilidad de crashpads en nuestra sección de equipos. Si traes el tuyo, asegúrate de ubicarlo correctamente según la zona de caída del problema que estés trabajando.
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            ¿Listo para el boulder?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Consulta la disponibilidad de crashpads o planifica tu visita a la zona de boulder.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-orange text-white hover:bg-orange/90">
              <Link href="/equipos">Ver equipos disponibles</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              <Link href="/contacto">Contactar</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
