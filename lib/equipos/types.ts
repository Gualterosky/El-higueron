/**
 * Vocabulary shared between the admin/staff equipment panel and the server
 * actions for the item-level inventory. `equipment_item.status` and
 * `equipment_item.category` are plain `text` columns (not pgEnum, same design
 * decision as `reservation`), so this list is the only thing keeping the
 * values consistent — see system_architecture.md section 3 for the reasoning.
 */

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