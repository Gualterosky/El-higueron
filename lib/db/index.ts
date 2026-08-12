import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

/**
 * Server-only Neon + Drizzle client.
 * Use from Server Components, Server Actions, or Route Handlers — never from client components.
 */
function createDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local.",
    )
  }

  const sql = neon(url)
  return drizzle(sql, { schema })
}

export type Db = ReturnType<typeof createDb>

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined
}

export const db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db
}
