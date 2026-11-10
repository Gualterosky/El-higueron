"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { eq, max } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { equipmentItem, equipmentItemRental } from "@/lib/db/schema"
import { getModeratorSession } from "@/lib/auth/guards"
import { EQUIPMENT_ITEM_CATEGORIES } from "@/lib/equipos/types"

/**
 * Server actions for the new item-level equipment inventory (added 2026-11).
 * Every mutation verifies getModeratorSession() (admin + staff) — see
 * system_architecture.md section 4. Image upload reuses
 * `uploadEquipmentImageAction` from lib/equipos/actions.ts.
 */

type ItemActionError =
  | "unauthorized"
  | "validation"
  | "seq_taken"
  | "not_found"
  | "not_available"
  | "failed"

export type EquipmentItemActionResult =
  | { ok: true; id: string }
  | { ok: false; error: ItemActionError }

export type ItemSimpleActionResult = { ok: true } | { ok: false; error: ItemActionError }

function revalidateEquipmentPaths() {
  revalidatePath("/", "layout")
}

const itemSchema = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.enum(EQUIPMENT_ITEM_CATEGORIES),
  seq: z.number().int().min(1).max(1_000_000).optional().nullable(),
  talla: z.string().trim().max(40).optional().nullable(),
  price: z.number().int().min(0).max(100_000_000).optional().nullable(),
  imageUrl: z.string().trim().max(500).optional().nullable(),
})

export type EquipmentItemInput = z.infer<typeof itemSchema>

/** Talla only makes sense for climbing shoes ("gatos") and boots ("botas"); drop it otherwise. */
function normalizeTalla(category: EquipmentItemInput["category"], talla: string | null | undefined) {
  return category === "gatos" || category === "botas" ? (talla?.trim() || null) : null
}

async function seqIsTaken(seq: number, excludeId?: string): Promise<boolean> {
  const rows = await db
    .select({ id: equipmentItem.id })
    .from(equipmentItem)
    .where(eq(equipmentItem.seq, seq))
  if (excludeId) return rows.some((row) => row.id !== excludeId)
  return rows.length > 0
}

export async function createEquipmentItemAction(
  input: EquipmentItemInput,
): Promise<EquipmentItemActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  const parsed = itemSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    let seq = data.seq
    if (seq == null) {
      const [row] = await db.select({ value: max(equipmentItem.seq) }).from(equipmentItem)
      seq = (row?.value ?? 0) + 1
    }

    if (await seqIsTaken(seq)) return { ok: false, error: "seq_taken" }

    const id = randomUUID()
    await db.insert(equipmentItem).values({
      id,
      seq,
      name: data.name,
      category: data.category,
      talla: normalizeTalla(data.category, data.talla),
      price: data.price ?? null,
      imageUrl: data.imageUrl || null,
      status: "disponible",
    })

    revalidateEquipmentPaths()
    return { ok: true, id }
  } catch (error) {
    console.error("[equipos] createEquipmentItemAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function updateEquipmentItemAction(
  id: string,
  input: EquipmentItemInput,
): Promise<ItemSimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  const parsed = itemSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    const [current] = await db
      .select({ seq: equipmentItem.seq })
      .from(equipmentItem)
      .where(eq(equipmentItem.id, id))

    if (!current) return { ok: false, error: "not_found" }

    const seq = data.seq ?? current.seq
    if (seq !== current.seq && (await seqIsTaken(seq, id))) {
      return { ok: false, error: "seq_taken" }
    }

    await db
      .update(equipmentItem)
      .set({
        seq,
        name: data.name,
        category: data.category,
        talla: normalizeTalla(data.category, data.talla),
        price: data.price ?? null,
        imageUrl: data.imageUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(equipmentItem.id, id))

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] updateEquipmentItemAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function deleteEquipmentItemAction(id: string): Promise<ItemSimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  try {
    const result = await db
      .delete(equipmentItem)
      .where(eq(equipmentItem.id, id))
      .returning({ id: equipmentItem.id })

    if (result.length === 0) return { ok: false, error: "not_found" }

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] deleteEquipmentItemAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function setEquipmentItemMaintenanceAction(
  id: string,
  maintenance: boolean,
): Promise<ItemSimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  try {
    const [item] = await db
      .select({ status: equipmentItem.status })
      .from(equipmentItem)
      .where(eq(equipmentItem.id, id))

    if (!item) return { ok: false, error: "not_found" }
    // A rented item can't go to maintenance; it must be returned first.
    if (maintenance && item.status === "rentado") return { ok: false, error: "not_available" }
    if (!maintenance && item.status === "rentado") return { ok: false, error: "not_available" }

    await db
      .update(equipmentItem)
      .set({
        status: maintenance ? "mantenimiento" : "disponible",
        updatedAt: new Date(),
      })
      .where(eq(equipmentItem.id, id))

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] setEquipmentItemMaintenanceAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "invalid_date")

const rentalSchema = z.object({
  itemId: z.string().min(1),
  rentedAt: isoDateSchema,
})

export type EquipmentItemRentalInput = z.infer<typeof rentalSchema>

export async function createEquipmentItemRentalAction(
  input: EquipmentItemRentalInput,
): Promise<EquipmentItemActionResult> {
  const session = await getModeratorSession()
  if (!session) return { ok: false, error: "unauthorized" }

  const parsed = rentalSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    const [item] = await db
      .select({ status: equipmentItem.status })
      .from(equipmentItem)
      .where(eq(equipmentItem.id, data.itemId))

    if (!item) return { ok: false, error: "not_found" }
    if (item.status !== "disponible") return { ok: false, error: "not_available" }

    const id = randomUUID()
    await db.insert(equipmentItemRental).values({
      id,
      itemId: data.itemId,
      rentedAt: data.rentedAt,
      returnedAt: null,
      registeredByUserId: session.user.id,
    })

    await db
      .update(equipmentItem)
      .set({ status: "rentado", updatedAt: new Date() })
      .where(eq(equipmentItem.id, data.itemId))

    revalidateEquipmentPaths()
    return { ok: true, id }
  } catch (error) {
    console.error("[equipos] createEquipmentItemRentalAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function markEquipmentItemRentalReturnedAction(
  rentalId: string,
): Promise<ItemSimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  try {
    const [rental] = await db
      .select({ itemId: equipmentItemRental.itemId })
      .from(equipmentItemRental)
      .where(eq(equipmentItemRental.id, rentalId))

    if (!rental) return { ok: false, error: "not_found" }

    await db
      .update(equipmentItemRental)
      .set({ returnedAt: new Date() })
      .where(eq(equipmentItemRental.id, rentalId))

    await db
      .update(equipmentItem)
      .set({ status: "disponible", updatedAt: new Date() })
      .where(eq(equipmentItem.id, rental.itemId))

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] markEquipmentItemRentalReturnedAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function cancelEquipmentItemRentalAction(
  rentalId: string,
): Promise<ItemSimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  try {
    const [rental] = await db
      .select({ itemId: equipmentItemRental.itemId })
      .from(equipmentItemRental)
      .where(eq(equipmentItemRental.id, rentalId))

    if (!rental) return { ok: false, error: "not_found" }

    await db.delete(equipmentItemRental).where(eq(equipmentItemRental.id, rentalId))
    await db
      .update(equipmentItem)
      .set({ status: "disponible", updatedAt: new Date() })
      .where(eq(equipmentItem.id, rental.itemId))

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] cancelEquipmentItemRentalAction failed:", error)
    return { ok: false, error: "failed" }
  }
}