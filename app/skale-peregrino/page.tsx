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
    { type: "video", src: "/media/skale-peregrino/Video Skale 15072026.mp4" },
  ],

  caption: `¿Alguna vez has sentido que tus piernas cobran vida propia en la roca? 😂🧗‍♂️

Es el famoso "síndrome de la máquina de coser" (O como solemos decir en la roca: ¡Se prendió la moto!). 
Te tiemblan las rodillas, el vacío se siente abajo y la mente te dice que no vas a poder. Pero ahí, justo en ese milisegundo de duda, pasa la magia: respiras, confías en tus pies y sigues.

La escalada en roca no se trata de no tener miedo; se trata de descubrir que tu mente es muchísimo más fuerte que cualquier altura. Al llegar arriba, el paisaje se ve diferente porque tú ya eres alguien distinto. No estás solo, tu cordada y tu guía están abajo cuidando cada paso.

¿Listo para superar tus propios límites? Reserva ahora tu cupo directamente con nosotros. ✨

#EscaladaEnRoca #SuperaTusLimites #SenderismoYEscalada #OutdoorLife`,
}

// ── PUBLICACIÓN 2 ──────────────────────────────────────────────
const PUB2: PostConfig = {
  date: FECHA,
  profile: PROFILE,
  location: "Colombia",
  aspectRatio: "square",

  media: [
    { type: "image", src: "/media/skale-peregrino/Img Skale 15072026.png" },
    // { type: "video", src: "/media/skale-peregrino/video.mp4", poster: "/media/skale-peregrino/thumb.jpg" },
  ],

  caption: `¿Parche de fin de semana en la casa viendo lo mismo de siempre? Cambia el chip. ⛰️🧗

Los Farallones de Choachí te están esperando para que conquistes tu primera cumbre. No necesitas experiencia previa, solo las ganas de sentir la adrenalina pura en las alturas.  

Arma el grupo de amigos porque la montaña premia el parche:
👉 1 Persona: $150.000
👉 2 o más Personas: $120.000 cada uno  

🔥 BONUS EXCLUSIVO: 
Si te estás hospedando en Skale Ecolodge, tienes un 15% de descuento automático en tu tarifa.  

Tu reserva te incluye TODO para ir a la fija:
🧗 Vía Ferrata vertical de 25 metros.  
🧗 Ruta básica de escalada en roca.  
🛡️ Equipos certificados y póliza todo riesgo.  
🗺️ Guías especializados.  
🎟️ Entradas al parque.  

¿Qué esperas? ¡Reserva ahora!`,
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                   NO TOCAR DEBAJO                           ║
// ╚══════════════════════════════════════════════════════════════╝
export default function SkalePeregrinoPage() {
  return <InstagramPreview posts={[PUB1, PUB2]} />
}
