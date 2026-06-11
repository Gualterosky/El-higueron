import type { Evento } from "./types"
import { crearDesdePlantilla } from "./plantillas"

// ============================================================================
//  GESTIÓN DE EVENTOS  —  Camping El Higuerón
// ----------------------------------------------------------------------------
//  Aquí se guardan TODOS los eventos (activos, deshabilitados y archivados).
//  La página /evento muestra el que esté marcado como activo (EVENTO_ACTIVO_ID)
//  siempre que su propiedad `habilitado` sea true.
//
//  CÓMO USAR ESTE ARCHIVO:
//
//  1) CAMBIAR EL EVENTO MOSTRADO:
//     Modifica EVENTO_ACTIVO_ID con el id del evento que quieras mostrar.
//
//  2) DESHABILITAR LA PÁGINA (sin borrar el evento):
//     Pon `habilitado: false` en el evento. /evento mostrará un estado neutral.
//
//  3) GUARDAR UN EVENTO PARA USARLO MÁS ADELANTE:
//     Déjalo en la lista con `habilitado: false`. Queda archivado y listo
//     para reactivarse en otra ocasión cambiando EVENTO_ACTIVO_ID.
//
//  4) CREAR UN EVENTO NUEVO DESDE UNA PLANTILLA:
//     Usa crearDesdePlantilla("festival" | "taller" | "clase" | "campamento", "mi-id", { ...campos })
//     y añádelo al arreglo `eventos`.
// ============================================================================

/** Id del evento que se mostrará en /evento. */
export const EVENTO_ACTIVO_ID = "festival-escalada-2026"

/** Lista completa de eventos guardados. */
export const eventos: Evento[] = [
  // --- Borrador del próximo evento: Festival de Escalada ---------------------
  crearDesdePlantilla("festival", "festival-escalada-2026", {
    habilitado: true,
    etiqueta: "Festival de Escalada",
    titulo: "Festival de Escalada El Higuerón",
    subtitulo:
      "Un día para escalar, competir y celebrar la comunidad escaladora en el corazón del bosque.",
    imagenHero: "/media/Muro bendito sea/Img01.jpg",
    fecha: "Por confirmar",
    lugar: "Camping El Higuerón",
    textoCta: "Quiero inscribirme",
    esBorrador: true,
    descripcion: [
      "El Festival de Escalada El Higuerón reunirá a escaladores de todos los niveles para disfrutar de un día completo de escalada deportiva y boulder en roca natural, rodeados de montañas y bosque.",
      "Más que una competencia, es una celebración de la comunidad: música, fogata, intercambio de experiencias y la oportunidad de superar tus propios límites mientras compites por premios.",
      "Esta es una versión preliminar del evento. Las fechas, premios y precios son tentativos y se confirmarán en la convocatoria oficial.",
    ],
    destacados: [
      { icono: "Trophy", titulo: "Premios por categoría", descripcion: "Compite y gana premios en tu nivel de escalada." },
      { icono: "Mountain", titulo: "Muro y Boulder", descripcion: "Escala en nuestras dos modalidades sobre roca natural." },
      { icono: "Users", titulo: "Comunidad escaladora", descripcion: "Conecta con escaladores de toda la región." },
      { icono: "Flame", titulo: "Fogata y música", descripcion: "Cierre del día con ambiente de campamento." },
    ],
    categorias: [
      { nombre: "Principiante", descripcion: "Para quienes están dando sus primeros pegues. Rutas accesibles y ambiente de apoyo." },
      { nombre: "Intermedio", descripcion: "Para escaladores con experiencia que buscan retar su técnica." },
      { nombre: "Avanzado", descripcion: "Para los más fuertes: las rutas más exigentes del sector." },
      { nombre: "Boulder", descripcion: "Categoría especial de escalada en bloque, sin cuerda y a baja altura." },
    ],
    premios: [
      { posicion: "1er lugar", descripcion: "Premio principal por categoría", valor: "Por definir" },
      { posicion: "2do lugar", descripcion: "Segundo premio por categoría", valor: "Por definir" },
      { posicion: "3er lugar", descripcion: "Tercer premio por categoría", valor: "Por definir" },
      { posicion: "Reconocimientos", descripcion: "Menciones especiales y sorpresas de patrocinadores", valor: "Por definir" },
    ],
    agenda: [
      { hora: "07:30", titulo: "Registro y entrega de kits", descripcion: "Acreditación de participantes y revisión de equipo." },
      { hora: "08:30", titulo: "Calentamiento y apertura", descripcion: "Bienvenida e indicaciones de seguridad." },
      { hora: "09:00", titulo: "Rondas clasificatorias", descripcion: "Competencia por categorías en muro y boulder." },
      { hora: "13:00", titulo: "Almuerzo y descanso", descripcion: "Pausa para recargar energías." },
      { hora: "14:30", titulo: "Rondas finales", descripcion: "Las mejores rutas de cada categoría." },
      { hora: "17:00", titulo: "Premiación", descripcion: "Entrega de premios y reconocimientos." },
      { hora: "18:30", titulo: "Fogata de cierre", descripcion: "Música, comunidad y celebración." },
    ],
    planes: [
      {
        nombre: "Participante",
        precio: "Por definir",
        unidad: "COP / persona",
        incluye: [
          "Inscripción a una categoría",
          "Kit del festival",
          "Acceso a muro y boulder",
          "Hidratación durante el evento",
          "Acceso a la fogata de cierre",
        ],
        destacado: true,
      },
      {
        nombre: "Acompañante",
        precio: "Por definir",
        unidad: "COP / persona",
        incluye: [
          "Acceso al evento como espectador",
          "Acceso a zonas comunes",
          "Acceso a la fogata de cierre",
        ],
      },
    ],
    galeria: [
      "/media/Muro bendito sea/Img07.jpg",
      "/media/Boulders/IMG_20250920_100731134_MFNR.jpg",
      "/media/Muro bendito sea/Img08.jpg",
      "/media/Boulders/IMG_20250920_100954059_HDR.jpg",
      "/media/Naturaleza-paisajes/IMG_20240908_083909.jpg",
      "/media/Camping/Fogata1.jpg",
    ],
    faqs: [
      { pregunta: "¿Necesito experiencia previa?", respuesta: "No. Hay una categoría de principiantes pensada para quienes recién comienzan. Lo importante es venir con ganas de disfrutar." },
      { pregunta: "¿Debo llevar mi propio equipo?", respuesta: "Recomendamos traer tu equipo de escalada. Habrá opción de alquiler de equipo en el sitio. Los detalles se confirmarán en la convocatoria oficial." },
      { pregunta: "¿Cómo me inscribo?", respuesta: "La inscripción oficial se abrirá pronto. Esta página es un borrador previo del evento." },
      { pregunta: "¿Puedo ir solo a ver?", respuesta: "Sí, habrá entrada para acompañantes y espectadores que quieran disfrutar del ambiente." },
    ],
    cierreTitulo: "¿Listo para el reto?",
    cierreDescripcion:
      "Prepárate para el primer Festival de Escalada El Higuerón. Pronto abriremos las inscripciones oficiales.",
  }),
]

/** Devuelve el evento activo, o null si no hay o está deshabilitado. */
export function getEventoActivo(): Evento | null {
  const evento = eventos.find((e) => e.id === EVENTO_ACTIVO_ID)
  if (!evento || !evento.habilitado) return null
  return evento
}
