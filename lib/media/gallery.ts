import { getR2PublicUrl, listR2Objects } from "@/lib/storage/r2"

export type GalleryCategory = "escalada" | "boulder" | "camping" | "naturaleza"

export type GalleryImage = {
  src: string
  category: GalleryCategory
}

/**
 * Carpetas del bucket de R2 que alimentan la Galería pública, mapeadas a su
 * categoría de filtro. Cualquier otra carpeta del bucket (Equipos/, Novedades/,
 * logos sueltos, etc.) se ignora a propósito — no es contenido de galería.
 */
const GALLERY_FOLDERS: Record<string, GalleryCategory> = {
  "Muro bendito sea": "escalada",
  Boulders: "boulder",
  Camping: "camping",
  "Naturaleza-paisajes": "naturaleza",
}

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"])

/**
 * Lista dinámicamente todas las imágenes de la Galería directamente desde R2
 * (sin array hardcodeado): agregar, editar o borrar un archivo en las carpetas
 * de GALLERY_FOLDERS del bucket se refleja solo, sin tocar código ni redeploy
 * (ver `revalidate` en app/[locale]/galeria/page.tsx). Ver system_architecture.md
 * sección 15.
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const keys = await listR2Objects("")
  const images: GalleryImage[] = []

  for (const key of keys) {
    const slashIndex = key.indexOf("/")
    if (slashIndex === -1) continue

    const folder = key.slice(0, slashIndex)
    const category = GALLERY_FOLDERS[folder]
    if (!category) continue

    const dotIndex = key.lastIndexOf(".")
    const extension = dotIndex === -1 ? "" : key.slice(dotIndex).toLowerCase()
    if (!IMAGE_EXTENSIONS.has(extension)) continue

    images.push({ src: getR2PublicUrl(key), category })
  }

  images.sort((a, b) => a.src.localeCompare(b.src))
  return images
}
