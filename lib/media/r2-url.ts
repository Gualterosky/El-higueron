/**
 * URL pública base del bucket R2, derivada de R2_PUBLIC_URL (o de
 * NEXT_PUBLIC_R2_PUBLIC_URL en componentes cliente) para que las imágenes usen
 * el mismo host que `images.remotePatterns` de next.config.mjs (funciona igual
 * con el subdominio *.r2.dev o con un dominio propio).
 * Ver system_architecture.md sección 15.
 */

const FALLBACK_R2_PUBLIC_URL = "https://pub-b8789ea28b254e56a01798832eb96334.r2.dev"

export const R2_BASE_URL = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ??
  process.env.R2_PUBLIC_URL ??
  FALLBACK_R2_PUBLIC_URL
).replace(/\/+$/, "")