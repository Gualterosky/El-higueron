import { eq, sql } from "drizzle-orm"
import { db } from "../lib/db"
import {
  climbPost,
  campingPost,
  boulderPost,
  postReply,
  reservation,
  equipmentRental,
  communityPost,
} from "../lib/db/schema"
import { upsertContactFromSubmission } from "../lib/contacts/upsert"

type SourceTable = {
  name: string
  tableName: string
  table:
    | typeof climbPost
    | typeof campingPost
    | typeof boulderPost
    | typeof postReply
    | typeof reservation
    | typeof equipmentRental
    | typeof communityPost
  nameField: string
  contactField: string
}

const sources: SourceTable[] = [
  { name: "muro", tableName: "climb_post", table: climbPost, nameField: "author_name", contactField: "contact_info" },
  { name: "camping", tableName: "camping_post", table: campingPost, nameField: "author_name", contactField: "contact_info" },
  { name: "boulder", tableName: "boulder_post", table: boulderPost, nameField: "author_name", contactField: "contact_info" },
  { name: "comunidad", tableName: "community_post", table: communityPost, nameField: "author_name", contactField: "contact_info" },
  { name: "reply", tableName: "post_reply", table: postReply, nameField: "author_name", contactField: "contact_info" },
  { name: "reserva", tableName: "reservation", table: reservation, nameField: "name", contactField: "contact_info" },
  { name: "renta", tableName: "equipment_rental", table: equipmentRental, nameField: "renter_name", contactField: "renter_contact" },
]

async function backfillTable(source: SourceTable) {
  const query = sql.raw(
    `SELECT id, "${source.nameField}" as name, "${source.contactField}" as contact ` +
      `FROM ${source.tableName} WHERE contact_id IS NULL ORDER BY created_at`
  )
  const result = (await db.execute(query)) as unknown as
    | { id: string; name: string; contact: string | null }[]
    | { rows: { id: string; name: string; contact: string | null }[] }
  const rows = Array.isArray(result) ? result : result.rows

  let linked = 0
  for (const row of rows) {
    if (!row.contact?.trim()) continue

    try {
      const contactId = await upsertContactFromSubmission({
        raw: row.contact,
        name: row.name,
        source: `backfill-${source.name}` as import("../lib/contacts/types").ContactSource,
      })

      if (contactId) {
        await db.update(source.table).set({ contactId }).where(eq(source.table.id, row.id))
        linked += 1
      }
    } catch (error) {
      console.error(`[backfill] ${source.name} row ${row.id} failed:`, error)
    }
  }

  return { source: source.name, scanned: rows.length, linked }
}

async function main() {
  const results = await Promise.all(sources.map(backfillTable))
  console.table(results)
  process.exit(0)
}

main().catch((error) => {
  console.error("[backfill] failed:", error)
  process.exit(1)
})
