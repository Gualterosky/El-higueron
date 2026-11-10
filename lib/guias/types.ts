/**
 * Vocabulary shared between the admin/staff guides panel, the server actions
 * and the public /escalada section. `guide_link.icon` is a plain `text` column
 * (not pgEnum, same design decision as `reservation`), so this list is the only
 * thing keeping the icon values consistent — see system_architecture.md
 * section 3 for the reasoning.
 */

export const GUIDE_LINK_ICONS = [
  "instagram",
  "facebook",
  "youtube",
  "linkedin",
  "web",
  "mail",
  "other",
] as const

export type GuideLinkIcon = (typeof GUIDE_LINK_ICONS)[number]

export function isGuideLinkIcon(value: string): value is GuideLinkIcon {
  return (GUIDE_LINK_ICONS as readonly string[]).includes(value)
}

/** Máximo de botones extra por guía/agencia. */
export const MAX_GUIDE_LINKS = 5

/** Construye el enlace wa.me a partir de un teléfono (ignora todo lo que no sea dígito). */
export function formatWhatsappUrl(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  return `https://wa.me/${cleaned}`
}