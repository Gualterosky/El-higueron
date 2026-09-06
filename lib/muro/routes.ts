export type StyleKey = "deportiva" | "deportivaProyecto" | "clasicaMixta" | "clasica"

export type MuroRouteMeta = {
  id: `MBS${string}`
  number: number
  level: string
  subLevels?: string[]
  height: string | "Por definir"
  anchors: string | "Por definir"
  styleKey: StyleKey
  image: string
  builders: string
}

export const MURO_ROUTES: MuroRouteMeta[] = [
  {
    id: "MBS01",
    number: 1,
    level: "5.10c",
    height: "Por definir",
    anchors: "Por definir",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Leonardo Pineda & Dann Fonseca",
  },
  {
    id: "MBS02",
    number: 2,
    level: "5.12b",
    height: "18m",
    anchors: "10",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Miguel Ángel, 5 Jun 2024",
  },
  {
    id: "MBS03",
    number: 3,
    level: "Proyecto",
    height: "18m",
    anchors: "12",
    styleKey: "deportivaProyecto",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Néstor Caro & Juan Hernández, 19 Jun 2024",
  },
  {
    id: "MBS04",
    number: 4,
    level: "5.9",
    height: "Por definir",
    anchors: "Por definir",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Leonardo Pineda & Dann Fonseca",
  },
  {
    id: "MBS05",
    number: 5,
    level: "5.10a",
    height: "14m",
    anchors: "7",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Néstor Caro & Juan Hernández, 19 Jun 2024",
  },
  {
    id: "MBS06",
    number: 6,
    level: "Proyecto",
    height: "28m",
    anchors: "14",
    styleKey: "deportivaProyecto",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Néstor Caro & Juan Hernández, 1 Jul 2024",
  },
  {
    id: "MBS07",
    number: 7,
    level: "5.12b",
    height: "28m",
    anchors: "13",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Néstor Caro & Juan Hernández, 2 Jun 2024",
  },
  {
    id: "MBS08",
    number: 8,
    level: "5.12d",
    height: "33m",
    anchors: "16",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Néstor Caro & Juan Hernández, 12 Jun 2024",
  },
  {
    id: "MBS09",
    number: 9,
    level: "5.13a",
    height: "33m",
    anchors: "15",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Néstor Caro & Juan Hernández, 3 Jun 2024",
  },
  {
    id: "MBS10",
    number: 10,
    level: "5.9",
    height: "14m",
    anchors: "7",
    styleKey: "clasicaMixta",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Néstor Caro & Juan Hernández, 4 Ago 2024",
  },
  {
    id: "MBS11",
    number: 11,
    level: "5.10b",
    height: "14m",
    anchors: "7",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Néstor Caro & Juan Hernández, 4 Ago 2024",
  },
  {
    id: "MBS12",
    number: 12,
    level: "5.11d",
    height: "18m",
    anchors: "13",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Néstor Caro & Juan Hernández, 3 Ago 2024",
  },
  {
    id: "MBS13",
    number: 13,
    level: "5.11c",
    height: "18m",
    anchors: "12",
    styleKey: "clasicaMixta",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Juan Hernández & Néstor Caro, 6 Sep 2024",
  },
  {
    id: "MBS14",
    number: 14,
    level: "5.9 / 5.11b",
    subLevels: ["5.9", "5.11b"],
    height: "20m",
    anchors: "12",
    styleKey: "deportiva",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Juan Hernández & Néstor Caro, 6 Sep 2024",
  },
  {
    id: "MBS15",
    number: 15,
    level: "5.9 / 5.11a",
    subLevels: ["5.9", "5.11a"],
    height: "Por definir",
    anchors: "Por definir",
    styleKey: "clasica",
    image: "/placeholder.svg?height=800&width=600",
    builders: "Leonardo Pineda & Dann Fonseca",
  },
]

export function getMuroRoute(id: string): MuroRouteMeta | undefined {
  return MURO_ROUTES.find((route) => route.id === id)
}

export function padRouteId(number: number): string {
  return `MBS${String(number).padStart(2, "0")}`
}

/** Every selectable route value, including one entry per sub-level (e.g.
 *  "MBS14-5.9" and "MBS14-5.11b" for route MBS14). Shared by the route
 *  selector in AscentForm and by the route filter in the /muro aggregated
 *  publications view, so both stay in sync with MURO_ROUTES. */
export function getMuroRouteOptions(): { value: string; baseId: MuroRouteMeta["id"]; subLevel?: string }[] {
  return MURO_ROUTES.flatMap((route) => {
    if (route.subLevels?.length) {
      return route.subLevels.map((subLevel) => ({
        value: `${route.id}-${subLevel}`,
        baseId: route.id,
        subLevel: subLevel as string | undefined,
      }))
    }
    return [{ value: route.id, baseId: route.id, subLevel: undefined as string | undefined }]
  })
}

/** Strips the "-<subLevel>" suffix from a stored route value, e.g.
 *  "MBS14-5.9" → "MBS14". Used to link back to the route's page and to look
 *  up its metadata/translations, which are keyed by the base route id. */
export function getRouteBaseId(value: string): string {
  const dashIdx = value.indexOf("-")
  return dashIdx === -1 ? value : value.slice(0, dashIdx)
}

/** The sub-level part of a stored route value, if any, e.g. "MBS14-5.9" → "5.9". */
export function getRouteSubLevel(value: string): string | null {
  const dashIdx = value.indexOf("-")
  return dashIdx === -1 ? null : value.slice(dashIdx + 1)
}
