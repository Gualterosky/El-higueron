"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { and, eq, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { equipment, equipmentRental, equipmentVariant } from "@/lib/db/schema"
import { getModeratorSession } from "@/lib/auth/guards"
import { upsertContactFromSubmission } from "@/lib/contacts/upsert"
import { DEFAULT_VARIANT_LABEL, EQUIPMENT_CATEGORIES } from "@/lib/equipos/types"
import { uploadToR2 } from "@/lib/storage/r2"

/** Uploaded equipment photos live in the "Equipos/" prefix of the R2 media bucket, square (1:1) as per design decision. */
const R2_PREFIX = "Equipos"
const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}

type ActionError =
  | "unauthorized"
  | "validation"
  | "not_found"
  | "insufficient_stock"
  | "failed"

export type EquipmentActionResult =
  | { ok: true; id: string }
  | { ok: false; error: ActionError }

export type SimpleActionResult = { ok: true } | { ok: false; error: ActionError }

export type UploadEquipmentImageResult =
  | { ok: true; url: string }
  | {
      ok: false
      error: "unauthorized" | "missing_file" | "invalid_type" | "too_large" | "failed"
    }

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
}

function revalidateEquipmentPaths() {
  revalidatePath("/", "layout")
}

const equipmentSchema = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.enum(EQUIPMENT_CATEGORIES),
  description: z.string().trim().max(600).optional().default(""),
  pricePerDay: z.number().int().min(0).max(10_000_000).optional().nullable(),
  imageUrl: z.string().trim().max(500).optional().nullable(),
  active: z.boolean().optional().default(true),
})

export type EquipmentInput = z.infer<typeof equipmentSchema>

export async function createEquipmentAction(
  input: EquipmentInput,
): Promise<EquipmentActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  const parsed = equipmentSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    const id = randomUUID()
    const baseSlug = slugify(data.name) || "equipo"
    let slug = baseSlug
    let attempt = 1
    // Guard against duplicate slugs without a round-trip transaction — collisions are rare.
    while (
      (await db.select({ id: equipment.id }).from(equipment).where(eq(equipment.slug, slug))).length > 0
    ) {
      slug = `${baseSlug}-${attempt}`
      attempt += 1
    }

    await db.insert(equipment).values({
      id,
      name: data.name,
      slug,
      category: data.category,
      description: data.description ?? "",
      pricePerDay: data.pricePerDay ?? null,
      imageUrl: data.imageUrl || null,
      active: data.active ?? true,
    })

    // Every equipment item needs at least one rentable variant to track stock.
    await db.insert(equipmentVariant).values({
      id: randomUUID(),
      equipmentId: id,
      label: DEFAULT_VARIANT_LABEL,
      totalQuantity: 0,
      active: true,
      sortOrder: 0,
    })

    revalidateEquipmentPaths()
    return { ok: true, id }
  } catch (error) {
    console.error("[equipos] createEquipmentAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function updateEquipmentAction(
  id: string,
  input: EquipmentInput,
): Promise<SimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  const parsed = equipmentSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    const result = await db
      .update(equipment)
      .set({
        name: data.name,
        category: data.category,
        description: data.description ?? "",
        pricePerDay: data.pricePerDay ?? null,
        imageUrl: data.imageUrl || null,
        active: data.active ?? true,
        updatedAt: new Date(),
      })
      .where(eq(equipment.id, id))
      .returning({ id: equipment.id })

    if (result.length === 0) return { ok: false, error: "not_found" }

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] updateEquipmentAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function deleteEquipmentAction(id: string): Promise<SimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  try {
    const result = await db.delete(equipment).where(eq(equipment.id, id)).returning({ id: equipment.id })
    if (result.length === 0) return { ok: false, error: "not_found" }

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] deleteEquipmentAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

const variantSchema = z.object({
  label: z.string().trim().min(1).max(40),
  totalQuantity: z.number().int().min(0).max(1000),
  active: z.boolean().optional().default(true),
})

export type VariantInput = z.infer<typeof variantSchema>

export async function createVariantAction(
  equipmentId: string,
  input: VariantInput,
): Promise<EquipmentActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  const parsed = variantSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    const id = randomUUID()
    await db.insert(equipmentVariant).values({
      id,
      equipmentId,
      label: data.label,
      totalQuantity: data.totalQuantity,
      active: data.active ?? true,
      sortOrder: 0,
    })

    revalidateEquipmentPaths()
    return { ok: true, id }
  } catch (error) {
    console.error("[equipos] createVariantAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function updateVariantAction(
  id: string,
  input: VariantInput,
): Promise<SimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  const parsed = variantSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    const result = await db
      .update(equipmentVariant)
      .set({
        label: data.label,
        totalQuantity: data.totalQuantity,
        active: data.active ?? true,
      })
      .where(eq(equipmentVariant.id, id))
      .returning({ id: equipmentVariant.id })

    if (result.length === 0) return { ok: false, error: "not_found" }

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] updateVariantAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function deleteVariantAction(id: string): Promise<SimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  try {
    const result = await db
      .delete(equipmentVariant)
      .where(eq(equipmentVariant.id, id))
      .returning({ id: equipmentVariant.id })

    if (result.length === 0) return { ok: false, error: "not_found" }

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] deleteVariantAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "invalid_date")

const rentalSchema = z.object({
  equipmentId: z.string().min(1),
  variantId: z.string().min(1),
  renterName: z.string().trim().min(2).max(100),
  renterContact: z.string().trim().max(200).optional().nullable(),
  quantity: z.number().int().min(1).max(1000),
  rentedAt: isoDateSchema,
  expectedReturnAt: isoDateSchema.optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
})

export type RentalInput = z.infer<typeof rentalSchema>

export async function createRentalAction(input: RentalInput): Promise<EquipmentActionResult> {
  const session = await getModeratorSession()
  if (!session) return { ok: false, error: "unauthorized" }

  const parsed = rentalSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "validation" }
  const data = parsed.data

  try {
    const [variant] = await db
      .select({ totalQuantity: equipmentVariant.totalQuantity })
      .from(equipmentVariant)
      .where(eq(equipmentVariant.id, data.variantId))

    if (!variant) return { ok: false, error: "not_found" }

    const [activeSum] = await db
      .select({ qty: sql<number>`coalesce(sum(${equipmentRental.quantity}), 0)` })
      .from(equipmentRental)
      .where(and(eq(equipmentRental.variantId, data.variantId), eq(equipmentRental.status, "activa")))

    const available = variant.totalQuantity - Number(activeSum?.qty ?? 0)
    if (data.quantity > available) return { ok: false, error: "insufficient_stock" }

    const id = randomUUID()
    const contactId = data.renterContact
      ? await upsertContactFromSubmission({
          raw: data.renterContact,
          name: data.renterName,
          source: "renta",
        })
      : null

    await db.insert(equipmentRental).values({
      id,
      equipmentId: data.equipmentId,
      variantId: data.variantId,
      renterName: data.renterName,
      renterContact: data.renterContact || null,
      contactId,
      quantity: data.quantity,
      rentedAt: data.rentedAt,
      expectedReturnAt: data.expectedReturnAt || null,
      status: "activa",
      registeredByUserId: session.user.id,
      notes: data.notes || null,
    })

    revalidateEquipmentPaths()
    return { ok: true, id }
  } catch (error) {
    console.error("[equipos] createRentalAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function markRentalReturnedAction(id: string): Promise<SimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  try {
    const result = await db
      .update(equipmentRental)
      .set({ status: "devuelta", returnedAt: new Date() })
      .where(eq(equipmentRental.id, id))
      .returning({ id: equipmentRental.id })

    if (result.length === 0) return { ok: false, error: "not_found" }

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] markRentalReturnedAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function cancelRentalAction(id: string): Promise<SimpleActionResult> {
  if (!(await getModeratorSession())) return { ok: false, error: "unauthorized" }

  try {
    const result = await db
      .update(equipmentRental)
      .set({ status: "cancelada" })
      .where(eq(equipmentRental.id, id))
      .returning({ id: equipmentRental.id })

    if (result.length === 0) return { ok: false, error: "not_found" }

    revalidateEquipmentPaths()
    return { ok: true }
  } catch (error) {
    console.error("[equipos] cancelRentalAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function uploadEquipmentImageAction(
  formData: FormData,
): Promise<UploadEquipmentImageResult> {
  if (!(await getModeratorSession())) {
    return { ok: false, error: "unauthorized" }
  }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "missing_file" }
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type]
  if (!extension) {
    return { ok: false, error: "invalid_type" }
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "too_large" }
  }

  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "equipo"
  const fileName = `${baseName}-${Date.now()}.${extension}`

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadToR2(`${R2_PREFIX}/${fileName}`, buffer, file.type)
    return { ok: true, url }
  } catch (error) {
    console.error("[equipos] uploadEquipmentImageAction failed:", error)
    return { ok: false, error: "failed" }
  }
}
