import { asc, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { equipmentItem, equipmentItemRental } from "@/lib/db/schema"
import { formatEquipmentItemCode } from "@/lib/equipos/types"

export type EquipmentItemRow = {
  id: string
  seq: number
  code: string
  name: string
  category: string
  talla: string | null
  price: number | null
  imageUrl: string | null
  status: string
}

export type EquipmentItemRentalRow = {
  id: string
  itemId: string
  itemCode: string
  itemName: string
  itemCategory: string
  itemTalla: string | null
  itemImageUrl: string | null
  rentedAt: string
  returnedAt: Date | null
  createdAt: Date
}

/** Full item-level inventory (ordered by code), for the admin/staff panel. */
export async function getAllEquipmentItems(): Promise<EquipmentItemRow[]> {
  const rows = await db
    .select()
    .from(equipmentItem)
    .orderBy(asc(equipmentItem.seq))

  return rows.map((item) => ({
    id: item.id,
    seq: item.seq,
    code: formatEquipmentItemCode(item.seq),
    name: item.name,
    category: item.category,
    talla: item.talla,
    price: item.price,
    imageUrl: item.imageUrl,
    status: item.status,
  }))
}

export type EquipmentCategoryPriceRange = {
  category: string
  minPrice: number
  maxPrice: number
}

/** Precio mínimo/máximo por categoría (solo items con precio definido).
 *  Se usa en la página pública para mostrar el rango "min - max". */
export async function getEquipmentCategoryPriceRanges(): Promise<Map<string, EquipmentCategoryPriceRange>> {
  const rows = await db
    .select({ category: equipmentItem.category, price: equipmentItem.price })
    .from(equipmentItem)

  const ranges = new Map<string, EquipmentCategoryPriceRange>()
  for (const row of rows) {
    if (row.price == null) continue
    const existing = ranges.get(row.category)
    if (!existing) {
      ranges.set(row.category, { category: row.category, minPrice: row.price, maxPrice: row.price })
    } else {
      if (row.price < existing.minPrice) existing.minPrice = row.price
      if (row.price > existing.maxPrice) existing.maxPrice = row.price
    }
  }

  return ranges
}

export type AvailableEquipmentItem = {
  category: string
  name: string
  talla: string | null
}

/** Items currently available to rent (status = "disponible"), for the public
 *  catalog page. Rented / maintenance items are excluded. */
export async function getAvailableEquipmentItems(): Promise<AvailableEquipmentItem[]> {
  const rows = await db
    .select({
      category: equipmentItem.category,
      name: equipmentItem.name,
      talla: equipmentItem.talla,
    })
    .from(equipmentItem)
    .where(eq(equipmentItem.status, "disponible"))
    .orderBy(asc(equipmentItem.seq))

  return rows.map((row) => ({
    category: row.category,
    name: row.name,
    talla: row.talla,
  }))
}

/** All item rental movements (newest date first) with the rented item joined in. */
export async function getAllEquipmentItemRentals(): Promise<EquipmentItemRentalRow[]> {
  const rows = await db
    .select({
      id: equipmentItemRental.id,
      itemId: equipmentItemRental.itemId,
      itemSeq: equipmentItem.seq,
      itemName: equipmentItem.name,
      itemCategory: equipmentItem.category,
      itemTalla: equipmentItem.talla,
      itemImageUrl: equipmentItem.imageUrl,
      rentedAt: equipmentItemRental.rentedAt,
      returnedAt: equipmentItemRental.returnedAt,
      createdAt: equipmentItemRental.createdAt,
    })
    .from(equipmentItemRental)
    .innerJoin(equipmentItem, eq(equipmentItemRental.itemId, equipmentItem.id))
    .orderBy(desc(equipmentItemRental.rentedAt), desc(equipmentItemRental.createdAt))

  return rows.map((row) => ({
    id: row.id,
    itemId: row.itemId,
    itemCode: formatEquipmentItemCode(row.itemSeq),
    itemName: row.itemName,
    itemCategory: row.itemCategory,
    itemTalla: row.itemTalla,
    itemImageUrl: row.itemImageUrl,
    rentedAt: row.rentedAt,
    returnedAt: row.returnedAt,
    createdAt: row.createdAt,
  }))
}