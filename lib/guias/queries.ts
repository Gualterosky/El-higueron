import { asc } from "drizzle-orm"
import { db } from "@/lib/db"
import { guide, guideLink } from "@/lib/db/schema"

export type GuideLinkRow = {
  id: string
  label: string
  url: string
  icon: string
  position: number
}

export type GuideRow = {
  id: string
  name: string
  logoUrl: string | null
  phone: string
  position: number
  links: GuideLinkRow[]
}

/** Todas las guías/agencias, ordenadas por `position` (y luego por antigüedad),
 *  con sus botones extra ya agrupados y ordenados. Usada por el panel admin/staff
 *  y por la sección pública de /escalada. */
export async function getAllGuides(): Promise<GuideRow[]> {
  const [guides, links] = await Promise.all([
    db
      .select({
        id: guide.id,
        name: guide.name,
        logoUrl: guide.logoUrl,
        phone: guide.phone,
        position: guide.position,
      })
      .from(guide)
      .orderBy(asc(guide.position), asc(guide.createdAt)),
    db
      .select({
        id: guideLink.id,
        guideId: guideLink.guideId,
        label: guideLink.label,
        url: guideLink.url,
        icon: guideLink.icon,
        position: guideLink.position,
      })
      .from(guideLink)
      .orderBy(asc(guideLink.position), asc(guideLink.createdAt)),
  ])

  const linksByGuide = new Map<string, GuideLinkRow[]>()
  for (const link of links) {
    const list = linksByGuide.get(link.guideId) ?? []
    list.push({
      id: link.id,
      label: link.label,
      url: link.url,
      icon: link.icon,
      position: link.position,
    })
    linksByGuide.set(link.guideId, list)
  }

  return guides.map((row) => ({
    id: row.id,
    name: row.name,
    logoUrl: row.logoUrl,
    phone: row.phone,
    position: row.position,
    links: linksByGuide.get(row.id) ?? [],
  }))
}