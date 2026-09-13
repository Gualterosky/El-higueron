/**
 * One-off seed for the initial equipment inventory described by the owner.
 * Run once with: pnpm tsx scripts/seed-equipment.ts
 * Safe to re-run: skips any equipment whose slug already exists.
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"

type SeedVariant = {
  label: string
  totalQuantity: number
  activeRentals?: number // creates placeholder "activa" rentals to represent "en uso" stock
}

type SeedItem = {
  name: string
  slug: string
  category: "escalada" | "boulder" | "camping" | "otro"
  description: string
  variants: SeedVariant[]
}

const SEED_ITEMS: SeedItem[] = [
  {
    name: "Casco",
    slug: "casco",
    category: "escalada",
    description:
      "Cascos de seguridad para protección durante la escalada. Recomendado para todas las actividades en pared.",
    variants: [{ label: "Única", totalQuantity: 2 }],
  },
  {
    name: "Arnés",
    slug: "arnes",
    category: "escalada",
    description:
      "Arneses de escalada deportiva para asegurar comodidad y seguridad durante la escalada.",
    variants: [{ label: "Única", totalQuantity: 2 }],
  },
  {
    name: "Crashpad",
    slug: "crashpads",
    category: "boulder",
    description:
      "Colchonetas de protección para caídas durante la práctica de boulder. Fundamentales para una sesión segura.",
    variants: [{ label: "Única", totalQuantity: 3, activeRentals: 2 }],
  },
  {
    name: "Pies de Gato",
    slug: "gatos",
    category: "escalada",
    description:
      "Zapatos especializados para escalada. Esenciales para un mejor agarre en la roca.",
    variants: [{ label: "Única", totalQuantity: 15 }],
  },
  {
    name: "Botas",
    slug: "botas",
    category: "otro",
    description: "Botas de montaña para senderismo y actividades al aire libre.",
    variants: [{ label: "Única", totalQuantity: 0 }],
  },
  {
    name: "Carpas de Camping",
    slug: "carpas",
    category: "camping",
    description:
      "Carpas para acampar en el lugar, ideales para quienes no cuentan con su propio equipo de camping.",
    variants: [{ label: "Única", totalQuantity: 0 }],
  },
]

async function main() {
  const { db } = await import("../lib/db")
  const { equipment, equipmentRental, equipmentVariant } = await import("../lib/db/schema")

  for (const item of SEED_ITEMS) {
    const existing = await db
      .select({ id: equipment.id })
      .from(equipment)
      .where(eq(equipment.slug, item.slug))

    if (existing.length > 0) {
      console.log(`[seed] "${item.name}" ya existe (slug=${item.slug}), se omite.`)
      continue
    }

    const equipmentId = randomUUID()
    await db.insert(equipment).values({
      id: equipmentId,
      name: item.name,
      slug: item.slug,
      category: item.category,
      description: item.description,
      pricePerDay: null,
      imageUrl: null,
      active: true,
    })

    for (const variant of item.variants) {
      const variantId = randomUUID()
      await db.insert(equipmentVariant).values({
        id: variantId,
        equipmentId,
        label: variant.label,
        totalQuantity: variant.totalQuantity,
        active: true,
      })

      if (variant.activeRentals && variant.activeRentals > 0) {
        await db.insert(equipmentRental).values({
          id: randomUUID(),
          equipmentId,
          variantId,
          renterName: "En uso (registro inicial de inventario)",
          renterContact: null,
          quantity: variant.activeRentals,
          rentedAt: new Date().toISOString().slice(0, 10),
          expectedReturnAt: null,
          status: "activa",
          registeredByUserId: null,
          notes: "Creado automáticamente al inicializar el inventario.",
        })
      }
    }

    console.log(`[seed] "${item.name}" creado.`)
  }

  console.log("[seed] Listo.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed] Falló:", error)
    process.exit(1)
  })
