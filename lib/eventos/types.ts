// Sistema flexible de eventos para Camping El Higuerón
// La página /evento se construye a partir de estos datos. Cada evento
// puede activarse, deshabilitarse o guardarse para usarse más adelante.

/** Tipos de plantilla disponibles. Sirven como punto de partida editable. */
export type TipoEvento = "festival" | "taller" | "clase" | "campamento" | "personalizado"

/** Un punto destacado del evento (con icono opcional de lucide-react). */
export interface Destacado {
  /** Nombre del icono de lucide-react, ej: "Trophy", "Clock", "MapPin". */
  icono: string
  titulo: string
  descripcion: string
}

/** Un elemento de la agenda / cronograma del evento. */
export interface ItemAgenda {
  hora: string
  titulo: string
  descripcion?: string
}

/** Un premio o reconocimiento (útil para festivales y competencias). */
export interface Premio {
  /** Ej: "1er lugar", "Categoría principiante". */
  posicion: string
  descripcion: string
  /** Valor o detalle del premio, ej: "$500.000 COP + equipo". */
  valor?: string
}

/** Una categoría o nivel de participación. */
export interface Categoria {
  nombre: string
  descripcion: string
}

/** Un plan de inscripción / entrada. */
export interface PlanInscripcion {
  nombre: string
  precio: string
  /** Texto bajo el precio, ej: "COP / persona". */
  unidad?: string
  incluye: string[]
  /** Marca el plan como destacado visualmente. */
  destacado?: boolean
}

/** Pregunta frecuente. */
export interface Faq {
  pregunta: string
  respuesta: string
}

/**
 * Estructura completa de un evento. Todas las secciones son opcionales:
 * si una propiedad no existe (o su lista está vacía), su sección no se renderiza.
 * Así una misma plantilla sirve para un festival completo o una clase simple.
 */
export interface Evento {
  /** Identificador único e inmutable (slug interno). */
  id: string
  /** Tipo de plantilla base. */
  tipo: TipoEvento
  /** Si es false, la página /evento muestra un estado "sin evento activo". */
  habilitado: boolean

  // ----- Hero -----
  /** Etiqueta corta sobre el título, ej: "Festival de Escalada". */
  etiqueta: string
  titulo: string
  subtitulo: string
  /** Ruta de la imagen de fondo del hero. */
  imagenHero: string
  /** Fecha legible, ej: "Por confirmar" o "15 de marzo, 2026". */
  fecha?: string
  /** Lugar, ej: "Camping El Higuerón". */
  lugar?: string
  /** Texto del botón principal del hero. */
  textoCta?: string

  // ----- Aviso de borrador -----
  /** Si es true, muestra una franja indicando que la info no es oficial. */
  esBorrador?: boolean

  // ----- Secciones opcionales -----
  /** Párrafos de introducción / descripción general. */
  descripcion?: string[]
  /** Puntos destacados con icono. */
  destacados?: Destacado[]
  /** Categorías o niveles de participación. */
  categorias?: Categoria[]
  /** Premios (festivales/competencias). */
  premios?: Premio[]
  /** Cronograma del evento. */
  agenda?: ItemAgenda[]
  /** Planes de inscripción / entrada. */
  planes?: PlanInscripcion[]
  /** Galería de imágenes (rutas). */
  galeria?: string[]
  /** Preguntas frecuentes. */
  faqs?: Faq[]

  // ----- Cierre -----
  cierreTitulo?: string
  cierreDescripcion?: string
}
