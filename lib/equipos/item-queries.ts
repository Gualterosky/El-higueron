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
    imageUrl: item.imageUrl,
    status: item.status,
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