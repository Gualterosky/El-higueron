import type { Metadata } from "next"
import InstagramPreview, { type PostConfig } from "@/components/instagram-preview"

export const metadata: Metadata = {
  title: "Skale Ecolodge · Vista previa",
  robots: "noindex",
}

// Perfil (no cambia)
const PROFILE = {
  username: "skale_ecolodge",
  avatar: "/media/skale-ecolodge/Logo.png",
  verified: false,
}

// ╔══════════════════════════════════════════════════════════════╗
// ║            ACTUALIZAR CADA SEMANA — EDITAR AQUÍ             ║
// ╚══════════════════════════════════════════════════════════════╝

// Fecha que aparece en la vista previa
const FECHA = "1 de julio"

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
  aspectRatio: "square",

  // Sube los archivos a /public/media/skale-ecolodge/ y ponlos aquí.
  // CARRUSEL → varias líneas   |   POST ÚNICO → una sola línea   |   VIDEO → type: "video"
  media: [
    { type: "image", src: "/media/skale-ecolodge/1.png" },
    { type: "image", src: "/media/skale-ecolodge/2.png" },
    { type: "image", src: "/media/skale-ecolodge/3.png" },
    { type: "image", src: "/media/skale-ecolodge/4.png" },
    { type: "image", src: "/media/skale-ecolodge/5.png" },
    // { type: "video", src: "/media/skale-ecolodge/video.mp4", poster: "/media/skale-ecolodge/thumb.jpg" },
  ],

  caption: `¿Cuándo fue la última vez que viviste un día sin mirar el reloj? (Desliza para ver más ➡️)

A veces, el verdadero descanso empieza cuando apagamos el ruido exterior y nos permitimos, simplemente, respirar. A solo hora y media de Bogotá, en Choachí, te espera Skale Ecolodge: un refugio diseñado para mimetizarse con el bosque y regalarte una pausa auténtica.

Nuestro hospedaje rodeado de vegetación y a solo unos metros del río, es el escenario perfecto para desconectarte de la rutina, disfrutar del avistamiento de aves, caminar sin prisa y reconectar con lo que de verdad importa.

Cambia la rutina por una experiencia que despierte tus sentidos. Tu mente y tu cuerpo te lo agradecerán.

🗓️¡Reserva tu experiencia hoy!
Escríbenos directamente por WhatsApp 📲 321 747 5413 o haciendo clic en el enlace de nuestra biografía.

#SkaleEcolodge #HospedajeRural #vamospachoachi`,
}

// ── PUBLICACIÓN 2 ──────────────────────────────────────────────
const PUB2: PostConfig = {
  date: FECHA,
  profile: PROFILE,
  location: "Colombia",
  aspectRatio: "9:16",

  media: [
    { type: "image", src: "/media/skale-ecolodge/Post.png" },
    // { type: "video", src: "/media/skale-ecolodge/video.mp4", poster: "/media/skale-ecolodge/thumb.jpg" },
  ],

  caption: `Tu mente merece un respiro profundo 🌿✨

El ruido de la ciudad se apaga cuando entras en el bosque. Cambia los afanes cotidianos por el sonido del viento entre los árboles, el cantar de las aves y la paz que solo la naturaleza te puede regalar.

A tan solo hora y media de Bogotá, Skale Ecolodge es ese refugio perfecto en Choachí pensado para que te detengas, respires y vuelvas a conectar contigo mismo. Ven a disfrutar de la tranquilidad de nuestras cabañas en medio de un entorno verde y restaurador.

Naturaleza. Descanso. Conexión. Todo lo que necesitas para renovar tu energía está aquí.

🗓️¡Reserva tu escapada hoy!
Escríbenos directamente por WhatsApp al 📲 321 747 5413 o haz clic en el enlace de nuestro perfil para asegurar tu fecha.

#SkaleEcolodge #Choachi #NaturalezaYDescanso @Vamospachoachi`,
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                   NO TOCAR DEBAJO                           ║
// ╚══════════════════════════════════════════════════════════════╝
export default function SkaleEcolodgePage() {
  return <InstagramPreview posts={[PUB1, PUB2]} />
}
