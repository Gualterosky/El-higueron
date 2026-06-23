import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Formulario",
  description:
    "Ayúdanos a crear un mejor servicio.",
}

export default function FormPage() {
  return (
    <section className="min-h-screen bg-beige py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
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
