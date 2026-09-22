import { setRequestLocale } from "next-intl/server"
import { getGalleryImages } from "@/lib/media/gallery"
import { GalleryGrid } from "@/components/galeria/gallery-grid"

// Vuelve a consultar el bucket de R2 como máximo cada 60s (ISR): subir/editar/
// borrar una foto en las carpetas de la galería (ver lib/media/gallery.ts) se
// refleja aquí sin necesidad de redeploy. Ver system_architecture.md sección 15.
export const revalidate = 60

type Props = {
  params: Promise<{ locale: string }>
}

export default async function GaleriaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const images = await getGalleryImages()

  return <GalleryGrid images={images} />
}
