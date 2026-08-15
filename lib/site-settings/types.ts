export const CONTENT_SECTIONS = [
  "escalada",
  "camping",
  "equipos",
  "visita",
  "galeria",
] as const

export type ContentSection = (typeof CONTENT_SECTIONS)[number]

export type HiddenSections = Record<ContentSection, boolean>

export type AppSiteSettings = {
  maintenanceMode: boolean
  hiddenSections: HiddenSections
}

export const DEFAULT_HIDDEN_SECTIONS: HiddenSections = {
  escalada: false,
  camping: false,
  equipos: false,
  visita: false,
  galeria: false,
}

export function isContentSection(value: string): value is ContentSection {
  return (CONTENT_SECTIONS as readonly string[]).includes(value)
}
