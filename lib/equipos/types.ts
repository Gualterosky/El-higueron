/**
 * Equipment rental vocabulary shared between the public catalog page, the
 * admin/staff panel and the server actions. `equipment_rental.status` is a
 * plain `text` column (not a pgEnum, same design decision as `reservation`),
 * so this list is the only thing keeping the values consistent — see
 * system_architecture.md section 3 for the reasoning.
 */

export const EQUIPMENT_CATEGORIES = ["escalada", "boulder", "camping", "otro"] as const

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number]

export function isEquipmentCategory(value: string): value is EquipmentCategory {
  return (EQUIPMENT_CATEGORIES as readonly string[]).includes(value)
}

export const EQUIPMENT_RENTAL_STATUSES = ["activa", "devuelta", "cancelada"] as const

export type EquipmentRentalStatus = (typeof EQUIPMENT_RENTAL_STATUSES)[number]

export function isEquipmentRentalStatus(value: string): value is EquipmentRentalStatus {
  return (EQUIPMENT_RENTAL_STATUSES as readonly string[]).includes(value)
}

/** Label used for the single implicit variant of equipment that has no real sizes. */
export const DEFAULT_VARIANT_LABEL = "Única"

// ── Item-level inventory (new model, added 2026-11) ──────────────────────────

export const EQUIPMENT_ITEM_CATEGORIES = [
  "arnes",
  "gatos",
  "crashpad",
  "casco",
  "botas",
  "carpa",
  "otros",
] as const

export type EquipmentItemCategory = (typeof EQUIPMENT_ITEM_CATEGORIES)[number]

export function isEquipmentItemCategory(value: string): value is EquipmentItemCategory {
  return (EQUIPMENT_ITEM_CATEGORIES as readonly string[]).includes(value)
}

export const EQUIPMENT_ITEM_STATUSES = ["disponible", "rentado", "mantenimiento"] as const

export type EquipmentItemStatus = (typeof EQUIPMENT_ITEM_STATUSES)[number]

export function isEquipmentItemStatus(value: string): value is EquipmentItemStatus {
  return (EQUIPMENT_ITEM_STATUSES as readonly string[]).includes(value)
}

/** User-facing sequential code: 1 → "001", 12 → "012", 1000 → "1000". */
export function formatEquipmentItemCode(seq: number): string {
  return String(seq).padStart(3, "0")
}
