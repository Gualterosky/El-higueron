import { getTranslations } from "next-intl/server"
import { getBoulderBaseId, getBoulderProblemId } from "@/lib/boulder/boulders"
import { getRouteBaseId, getRouteSubLevel } from "@/lib/muro/routes"
import { normalizePostCategory, type PostType } from "@/lib/posts/shared"
import type { EmailLocale, UrgencyKey } from "./templates"

export function resolveEmailLocale(locale?: string | null): EmailLocale {
  return locale === "en" ? "en" : "es"
}

const SECTIONS: Record<PostType, { es: string; en: string; path: string; adminPath: string }> = {
  muro: { es: "Muro de escalada", en: "Climbing wall", path: "/muro", adminPath: "/admin/publicaciones" },
  camping: { es: "Camping", en: "Camping", path: "/camping", adminPath: "/admin/publicaciones" },
  boulder: { es: "Boulder", en: "Boulder", path: "/boulder", adminPath: "/admin/publicaciones" },
  equipos: { es: "Alquiler de equipos", en: "Equipment rental", path: "/equipos", adminPath: "/admin/publicaciones" },
  comunidad: { es: "Comunidad", en: "Community", path: "/comunidad", adminPath: "/admin/comunidad" },
}

export function getSectionInfo(type: PostType, locale: EmailLocale) {
  const s = SECTIONS[type]
  return { sectionLabel: s[locale], sectionPath: s.path, adminPath: s.adminPath }
}

/** Translated category label (reuses PostCategories.* from messages). */
export async function getCategoryLabel(category: string, locale: EmailLocale): Promise<string> {
  const t = await getTranslations({ locale, namespace: "PostCategories" })
  return t(`${normalizePostCategory(category)}.label` as Parameters<typeof t>[0])
}

export async function getUrgencyLabel(urgency: UrgencyKey, locale: EmailLocale): Promise<string> {
  const t = await getTranslations({ locale, namespace: "PostCategories" })
  return t(`urgency.${urgency}` as Parameters<typeof t>[0])
}

/** "MBS14-5.9" → "<route name> 5.9". Unknown ids fall back to the raw value. */
export async function getMuroRouteLabels(routeIds: string[] | null | undefined, locale: EmailLocale): Promise<string[]> {
  if (!routeIds?.length) return []
  const t = await getTranslations({ locale, namespace: "MuroRoute" })
  return routeIds.map((value) => {
    const baseId = getRouteBaseId(value)
    const subLevel = getRouteSubLevel(value)
    let name = baseId
    try {
      name = t(`${baseId}.routeName` as Parameters<typeof t>[0])
    } catch {}
    return `${name}${subLevel ? ` ${subLevel}` : ""}`
  })
}

/** "BLDR01-PP01" → "<boulder name> · PP01". Unknown ids fall back to the raw value. */
export async function getBoulderProblemLabels(problemIds: string[] | null | undefined, locale: EmailLocale): Promise<string[]> {
  if (!problemIds?.length) return []
  const t = await getTranslations({ locale, namespace: "BoulderRoute" })
  return problemIds.map((value) => {
    const baseId = getBoulderBaseId(value)
    const problemId = getBoulderProblemId(value)
    let name = baseId
    try {
      name = t(`${baseId}.name` as Parameters<typeof t>[0])
    } catch {}
    return `${name}${problemId ? ` · ${problemId}` : ""}`
  })
}

export async function getCommunityLabels(activity: string, level: string | null | undefined, locale: EmailLocale) {
  const [tActivities, tLevels] = await Promise.all([
    getTranslations({ locale, namespace: "Comunidad.activities" }),
    getTranslations({ locale, namespace: "Comunidad.levels" }),
  ])
  const safe = (fn: () => string, fallback: string) => {
    try {
      return fn()
    } catch {
      return fallback
    }
  }
  return {
    activity: safe(() => tActivities(activity as Parameters<typeof tActivities>[0]), activity),
    level: level ? safe(() => tLevels(level as Parameters<typeof tLevels>[0]), level) : null,
  }
}
