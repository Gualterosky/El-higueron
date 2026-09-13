import { asc, desc, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { equipment, equipmentRental, equipmentVariant, user } from "@/lib/db/schema"

export type EquipmentVariantAvailability = {
  id: string
  label: string
  totalQuantity: number
  activeQuantity: number
  availableQuantity: number
  active: boolean
}

export type EquipmentCatalogItem = {
  id: string
  name: string
  slug: string
  category: string
  description: string
  pricePerDay: number | null
  imageUrl: string | null
  active: boolean
  variants: EquipmentVariantAvailability[]
}

export type EquipmentRentalRow = {
  id: string
  equipmentId: string
  equipmentName: string
  variantId: string
  variantLabel: string
  renterName: string
  renterContact: string | null
  quantity: number
  rentedAt: string
  expectedReturnAt: string | null
  returnedAt: Date | null
  status: string
  registeredByName: string | null
  notes: string | null
  createdAt: Date
}

/** Sum of `quantity` per variant across currently-active rentals. Never stored
 *  directly on the variant row — always recomputed here to avoid drift. */
async function getActiveQuantitiesByVariant(): Promise<Map<string, number>> {
  const rows = await db
    .select({
      variantId: equipmentRental.variantId,
      qty: sql<number>`sum(${equipmentRental.quantity})`,
    })
    .from(equipmentRental)
    .where(eq(equipmentRental.status, "activa"))
    .groupBy(equipmentRental.variantId)

  return new Map(rows.map((row) => [row.variantId, Number(row.qty)]))
}

async function buildCatalog(includeInactive: boolean): Promise<EquipmentCatalogItem[]> {
  const [equipmentRows, variantRows, activeQtyByVariant] = await Promise.all([
    db
      .select()
      .from(equipment)
      .where(includeInactive ? undefined : eq(equipment.active, true))
      .orderBy(asc(equipment.sortOrder), asc(equipment.name)),
    db.select().from(equipmentVariant).orderBy(asc(equipmentVariant.sortOrder)),
    getActiveQuantitiesByVariant(),
  ])

  const variantsByEquipment = new Map<string, EquipmentVariantAvailability[]>()
  for (const variant of variantRows) {
    if (!includeInactive && !variant.active) continue
    const activeQuantity = activeQtyByVariant.get(variant.id) ?? 0
    const list = variantsByEquipment.get(variant.equipmentId) ?? []
    list.push({
      id: variant.id,
      label: variant.label,
      totalQuantity: variant.totalQuantity,
      activeQuantity,
      availableQuantity: Math.max(variant.totalQuantity - activeQuantity, 0),
      active: variant.active,
    })
    variantsByEquipment.set(variant.equipmentId, list)
  }

  return equipmentRows.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    description: item.description,
    pricePerDay: item.pricePerDay,
    imageUrl: item.imageUrl,
    active: item.active,
    variants: variantsByEquipment.get(item.id) ?? [],
  }))
}

/** Public catalog: only active equipment + active variants, for /equipos. */
export async function getEquipmentCatalog(): Promise<EquipmentCatalogItem[]> {
  return buildCatalog(false)
}

/** Admin/staff inventory view: includes inactive equipment/variants too. */
export async function getAllEquipmentForAdmin(): Promise<EquipmentCatalogItem[]> {
  return buildCatalog(true)
}

/** Full rental history (newest first), for the admin/staff "Movimientos" tab. */
export async function getAllRentals(): Promise<EquipmentRentalRow[]> {
  const rows = await db
    .select({
      id: equipmentRental.id,
      equipmentId: equipmentRental.equipmentId,
      equipmentName: equipment.name,
      variantId: equipmentRental.variantId,
      variantLabel: equipmentVariant.label,
      renterName: equipmentRental.renterName,
      renterContact: equipmentRental.renterContact,
      quantity: equipmentRental.quantity,
      rentedAt: equipmentRental.rentedAt,
      expectedReturnAt: equipmentRental.expectedReturnAt,
      returnedAt: equipmentRental.returnedAt,
      status: equipmentRental.status,
      registeredByName: user.name,
      notes: equipmentRental.notes,
      createdAt: equipmentRental.createdAt,
    })
    .from(equipmentRental)
    .innerJoin(equipment, eq(equipmentRental.equipmentId, equipment.id))
    .innerJoin(equipmentVariant, eq(equipmentRental.variantId, equipmentVariant.id))
    .leftJoin(user, eq(equipmentRental.registeredByUserId, user.id))
    .orderBy(desc(equipmentRental.createdAt))

  return rows
}
