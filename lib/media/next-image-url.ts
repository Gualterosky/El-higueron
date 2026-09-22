/**
 * Construye la misma URL que `next/image` genera internamente
 * (`/_next/image?url=...&w=...&q=...`) para pedir una imagen ya redimensionada
 * y convertida a WebP/AVIF por el Image Optimizer de Next/Vercel.
 *
 * Se usa para poder `fetch()` la imagen manualmente (y así medir el progreso
 * real de descarga en `ProgressiveImage`) sin salirnos del propio dominio:
 * como la URL es del mismo origen, no hay problema de CORS aunque el archivo
 * real viva en Cloudflare R2. Los anchos/calidades deben existir en la config
 * por defecto de `images.deviceSizes`/`imageSizes` de Next (no se customizó
 * en next.config.mjs, así que se usan los valores por defecto: incluye 640 y
 * 1200, los dos anchos que usamos aquí).
 */
export function getNextImageProxyUrl(src: string, width: number, quality = 75): string {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality),
  })
  return `/_next/image?${params.toString()}`
}
