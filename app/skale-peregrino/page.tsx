import type { Metadata } from "next"
import InstagramPreview, { type PostConfig } from "@/components/instagram-preview"

export const metadata: Metadata = {
  title: "Skale Peregrino · Vista previa",
  robots: "noindex",
}

// Perfil (no cambia)
const PROFILE = {
  username: "skale_peregrino",
  avatar: "/media/skale-peregrino/Logo.png",
  verified: false,
}

// ╔══════════════════════════════════════════════════════════════╗
// ║            ACTUALIZAR CADA SEMANA — EDITAR AQUÍ             ║
// ╚══════════════════════════════════════════════════════════════╝

// Fecha que aparece en la vista previa
const FECHA = "15 de julio"

// Tamaños disponibles para aspectRatio:
//   "square"    →  1:1    cuadrado (más común en feed)
//   "portrait"  →  4:5    vertical moderado
//   "9:16"      →  9:16   vertical completo (reels / stories)
//   "landscape" →  1.91:1 horizontal

// ── PUBLICACIÓN 1 ──────────────────────────────────────────────
const PUB1: PostConfig = {
  date: FECHA,
  profile: PROFILE,
  location: "Colombia",
  aspectRatio: "9:16",

  // Sube los archivos a /public/media/skale-peregrino/ y ponlos aquí.
  // CARRUSEL → varias líneas   |   POST ÚNICO → una sola línea   |   VIDEO → type: "video"
  media: [
    { type: "video", src: "/media/skale-peregrino/Skale Peregrino Ecolodge.mp4" },
  ],

  caption: ``,
}

// ── PUBLICACIÓN 2 ──────────────────────────────────────────────
const PUB2: PostConfig = {
  date: FECHA,
  profile: PROFILE,
  location: "Colombia",
  aspectRatio: "square",

  media: [
    // { type: "image", src: "/media/skale-peregrino/Post.png" },
    // { type: "video", src: "/media/skale-peregrino/video.mp4", poster: "/media/skale-peregrino/thumb.jpg" },
  ],

  caption: ``,
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                   NO TOCAR DEBAJO                           ║
// ╚══════════════════════════════════════════════════════════════╝
export default function SkalePeregrinoPage() {
  return <InstagramPreview posts={[PUB1, PUB2]} />
}
