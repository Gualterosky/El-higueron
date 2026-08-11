import { getTranslations } from "next-intl/server"
import { getEventoActivo as getEventoActivoEstructura } from "./config"
import type {
  Categoria,
  Destacado,
  Evento,
  Faq,
  ItemAgenda,
  PlanInscripcion,
  Premio,
} from "./types"

type ContentDestacado = Pick<Destacado, "titulo" | "descripcion">
type ContentPlan = Pick<PlanInscripcion, "nombre" | "precio" | "unidad" | "incluye">

/**
 * Devuelve el evento activo con textos localizados desde messages.Evento.content.
 * Estructura (ids, iconos, imágenes, flags) sigue viniendo de config.ts.
 */
export async function getEventoActivo(locale: string): Promise<Evento | null> {
  const base = getEventoActivoEstructura()
  if (!base) return null

  const t = await getTranslations({ locale, namespace: "Evento" })

  const descripcion = t.raw("content.descripcion") as string[]
  const destacadosContent = t.raw("content.destacados") as ContentDestacado[]
  const categorias = t.raw("content.categorias") as Categoria[]
  const premios = t.raw("content.premios") as Premio[]
  const agenda = t.raw("content.agenda") as ItemAgenda[]
  const planesContent = t.raw("content.planes") as ContentPlan[]
  const faqs = t.raw("content.faqs") as Faq[]

  return {
    ...base,
    etiqueta: t("content.etiqueta"),
    titulo: t("content.titulo"),
    subtitulo: t("content.subtitulo"),
    fecha: t("content.fecha"),
    lugar: t("content.lugar"),
    textoCta: t("content.textoCta"),
    descripcion,
    destacados: base.destacados?.map((d, i) => ({
      icono: d.icono,
      titulo: destacadosContent[i]?.titulo ?? d.titulo,
      descripcion: destacadosContent[i]?.descripcion ?? d.descripcion,
    })),
    categorias,
    premios,
    agenda,
    planes: base.planes?.map((plan, i) => ({
      ...plan,
      nombre: planesContent[i]?.nombre ?? plan.nombre,
      precio: planesContent[i]?.precio ?? plan.precio,
      unidad: planesContent[i]?.unidad ?? plan.unidad,
      incluye: planesContent[i]?.incluye ?? plan.incluye,
    })),
    faqs,
    cierreTitulo: t("content.cierreTitulo"),
    cierreDescripcion: t("content.cierreDescripcion"),
  }
}
