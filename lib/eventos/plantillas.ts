import type { Evento, TipoEvento } from "./types"

// Plantillas base reutilizables. Sirven como punto de partida para crear
// un evento nuevo: se copia la plantilla y se editan los campos.
// Para crear un evento desde una plantilla usa `crearDesdePlantilla`.

type Plantilla = Omit<Evento, "id" | "habilitado">

export const plantillas: Record<Exclude<TipoEvento, "personalizado">, Plantilla> = {
  // ---------------------------------------------------------------------------
  festival: {
    tipo: "festival",
    etiqueta: "Festival",
    titulo: "Nombre del Festival",
    subtitulo: "Una celebración llena de actividades, premios y comunidad.",
    imagenHero: "/media/Muro bendito sea/Img01.jpg",
    fecha: "Por confirmar",
    lugar: "Camping El Higuerón",
    textoCta: "Quiero inscribirme",
    esBorrador: true,
    descripcion: [
      "Describe aquí de qué trata el festival, a quién está dirigido y qué lo hace especial.",
      "Añade un segundo párrafo con el ambiente, la comunidad y la experiencia que vivirán los asistentes.",
    ],
    destacados: [
      { icono: "Trophy", titulo: "Premios", descripcion: "Compite por premios en distintas categorías." },
      { icono: "Users", titulo: "Comunidad", descripcion: "Conecta con otros entusiastas." },
      { icono: "MapPin", titulo: "En la naturaleza", descripcion: "Un entorno único entre montañas y bosque." },
    ],
    categorias: [
      { nombre: "Principiante", descripcion: "Para quienes inician en la actividad." },
      { nombre: "Intermedio", descripcion: "Para quienes ya tienen experiencia." },
      { nombre: "Avanzado", descripcion: "Para los más experimentados." },
    ],
    premios: [
      { posicion: "1er lugar", descripcion: "Premio principal", valor: "Por definir" },
      { posicion: "2do lugar", descripcion: "Segundo premio", valor: "Por definir" },
      { posicion: "3er lugar", descripcion: "Tercer premio", valor: "Por definir" },
    ],
    agenda: [
      { hora: "08:00", titulo: "Registro y bienvenida" },
      { hora: "09:00", titulo: "Inicio de actividades" },
      { hora: "13:00", titulo: "Almuerzo y descanso" },
      { hora: "16:00", titulo: "Premiación y cierre" },
    ],
    planes: [
      {
        nombre: "Participante",
        precio: "Por definir",
        unidad: "COP / persona",
        incluye: ["Acceso al evento", "Participación en competencia", "Hidratación"],
        destacado: true,
      },
      {
        nombre: "Espectador",
        precio: "Por definir",
        unidad: "COP / persona",
        incluye: ["Acceso al evento", "Acceso a zonas comunes"],
      },
    ],
    galeria: [
      "/media/Muro bendito sea/Img07.jpg",
      "/media/Boulders/IMG_20250920_100731134_MFNR.jpg",
      "/media/Naturaleza-paisajes/IMG_20240908_083909.jpg",
    ],
    faqs: [
      { pregunta: "¿Necesito experiencia previa?", respuesta: "Hay categorías para todos los niveles." },
      { pregunta: "¿Debo llevar mi propio equipo?", respuesta: "Esta información se confirmará pronto." },
    ],
    cierreTitulo: "¿Listo para participar?",
    cierreDescripcion: "Reserva tu cupo y vive el festival con nosotros.",
  },

  // ---------------------------------------------------------------------------
  taller: {
    tipo: "taller",
    etiqueta: "Taller",
    titulo: "Nombre del Taller",
    subtitulo: "Aprende técnicas prácticas con instructores expertos.",
    imagenHero: "/media/Muro bendito sea/Img08.jpg",
    fecha: "Por confirmar",
    lugar: "Camping El Higuerón",
    textoCta: "Reservar mi cupo",
    esBorrador: true,
    descripcion: [
      "Describe el objetivo del taller y qué aprenderán los asistentes.",
      "Indica la duración, el nivel y los materiales necesarios.",
    ],
    destacados: [
      { icono: "GraduationCap", titulo: "Aprendizaje práctico", descripcion: "Sesiones 100% prácticas." },
      { icono: "Users", titulo: "Grupos reducidos", descripcion: "Atención personalizada." },
      { icono: "Clock", titulo: "Duración definida", descripcion: "Una jornada intensiva." },
    ],
    agenda: [
      { hora: "09:00", titulo: "Introducción y teoría" },
      { hora: "10:30", titulo: "Práctica guiada" },
      { hora: "12:30", titulo: "Cierre y retroalimentación" },
    ],
    planes: [
      {
        nombre: "Cupo individual",
        precio: "Por definir",
        unidad: "COP / persona",
        incluye: ["Materiales del taller", "Certificado de participación", "Refrigerio"],
        destacado: true,
      },
    ],
    faqs: [
      { pregunta: "¿Cuántos cupos hay?", respuesta: "Los cupos son limitados, se confirmarán pronto." },
    ],
    cierreTitulo: "Asegura tu cupo",
    cierreDescripcion: "Los cupos son limitados. Reserva con anticipación.",
  },

  // ---------------------------------------------------------------------------
  clase: {
    tipo: "clase",
    etiqueta: "Clase",
    titulo: "Nombre de la Clase",
    subtitulo: "Una sesión para iniciarte de forma segura y guiada.",
    imagenHero: "/media/Boulders/IMG_20250920_100954059_HDR.jpg",
    fecha: "Por confirmar",
    lugar: "Camping El Higuerón",
    textoCta: "Apartar mi lugar",
    esBorrador: true,
    descripcion: [
      "Describe en qué consiste la clase y para quién está pensada.",
    ],
    destacados: [
      { icono: "GraduationCap", titulo: "Guía experto", descripcion: "Acompañamiento profesional." },
      { icono: "Clock", titulo: "Sesión corta", descripcion: "Ideal para iniciarte." },
    ],
    planes: [
      {
        nombre: "Clase individual",
        precio: "Por definir",
        unidad: "COP / persona",
        incluye: ["Instrucción guiada", "Uso de equipo básico"],
        destacado: true,
      },
    ],
    cierreTitulo: "¿Te animas?",
    cierreDescripcion: "Da el primer paso con una clase guiada.",
  },

  // ---------------------------------------------------------------------------
  campamento: {
    tipo: "campamento",
    etiqueta: "Campamento",
    titulo: "Nombre del Campamento",
    subtitulo: "Varios días de aventura, naturaleza y comunidad.",
    imagenHero: "/media/Camping/Fogata1.jpg",
    fecha: "Por confirmar",
    lugar: "Camping El Higuerón",
    textoCta: "Reservar mi lugar",
    esBorrador: true,
    descripcion: [
      "Describe el campamento: días, actividades y experiencia general.",
      "Indica qué incluye el alojamiento y la alimentación.",
    ],
    destacados: [
      { icono: "Tent", titulo: "Alojamiento", descripcion: "Acampa rodeado de naturaleza." },
      { icono: "Flame", titulo: "Fogatas", descripcion: "Noches de comunidad y música." },
      { icono: "Mountain", titulo: "Actividades", descripcion: "Escalada, senderismo y más." },
    ],
    agenda: [
      { hora: "Día 1", titulo: "Llegada y armado de campamento" },
      { hora: "Día 2", titulo: "Jornada completa de actividades" },
      { hora: "Día 3", titulo: "Cierre y regreso" },
    ],
    planes: [
      {
        nombre: "Campamento completo",
        precio: "Por definir",
        unidad: "COP / persona",
        incluye: ["Alojamiento", "Alimentación", "Actividades guiadas"],
        destacado: true,
      },
    ],
    galeria: [
      "/media/Camping/Fogata2.jpg",
      "/media/Naturaleza-paisajes/IMG_20240804_180618.jpg",
    ],
    cierreTitulo: "Vive la experiencia completa",
    cierreDescripcion: "Reserva tu lugar en el próximo campamento.",
  },
}

/**
 * Crea un evento nuevo a partir de una plantilla base.
 * @param tipo Plantilla de la cual partir.
 * @param id Identificador único del evento.
 * @param overrides Campos a sobrescribir de la plantilla.
 */
export function crearDesdePlantilla(
  tipo: Exclude<TipoEvento, "personalizado">,
  id: string,
  overrides: Partial<Evento> = {},
): Evento {
  return {
    ...plantillas[tipo],
    id,
    habilitado: false,
    ...overrides,
  }
}
