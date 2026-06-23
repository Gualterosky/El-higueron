import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Estudio de Alquiler de Equipo | Camping El Higuerón",
  description:
    "Ayúdanos a crear el mejor servicio de renta de equipo para escalada, senderismo y acampada. Tu opinión es clave para ofrecerte exactamente lo que necesitas.",
}

export default function FormPage() {
  return (
    <section className="min-h-screen bg-beige py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
            Estudio de Alquiler de Equipo
          </h1>
          <p className="text-lg text-muted-foreground">
            ¡Hola! Estamos creando un nuevo servicio de renta de equipo para
            actividades al aire libre. Esta encuesta te tomará solo 3 minutos y,
            al finalizar, te daremos una sorpresa para tu próxima aventura.
          </p>
        </div>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-md">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdZ5dywE09D_xcrcbpfr1GeKaozagYXcpr8tNywqrqJ_Aubig/viewform?embedded=true"
            width="100%"
            height="900"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Estudio de Alquiler de Equipo para Montaña y Aventura"
            className="block"
          >
            Cargando…
          </iframe>
        </div>
      </div>
    </section>
  )
}
