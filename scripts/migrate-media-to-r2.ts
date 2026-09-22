/**
 * One-off migration: uploads every file under public/media to Cloudflare R2,
 * preserving the folder structure as the object key (e.g.
 * "Boulders/Img17.jpg" -> https://<R2_PUBLIC_URL>/Boulders/Img17.jpg).
 *
 * Safe to re-run: skips any key that already exists in the bucket (use
 * --force to re-upload everything anyway).
 *
 * Run: pnpm tsx --env-file=.env.local scripts/migrate-media-to-r2.ts
 * Writes a mapping file (scripts/media-r2-mapping.json) of
 * "/media/<path>" -> "<R2 public URL>" so the codebase migration
 * (replacing hardcoded /media/... references) can be scripted from it.
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { isR2Configured, uploadToR2, r2ObjectExists, getR2PublicUrl } from "../lib/storage/r2"

const MEDIA_ROOT = path.join(process.cwd(), "public", "media")
const FORCE = process.argv.includes("--force")

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
}

async function walk(dir: string, prefix: string): Promise<{ key: string; absPath: string }[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const results: { key: string; absPath: string }[] = []
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const abs = path.join(dir, entry.name)
    const key = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      results.push(...(await walk(abs, key)))
    } else {
      results.push({ key, absPath: abs })
    }
  }
  return results
}

async function main() {
  if (!isR2Configured()) {
    console.error(
      "Faltan variables de entorno de R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL) en .env.local"
    )
    process.exit(1)
  }

  const files = await walk(MEDIA_ROOT, "")
  console.log(`Encontrados ${files.length} archivos en public/media`)

  const mapping: Record<string, string> = {}
  let uploaded = 0
  let skipped = 0

  for (const { key, absPath } of files) {
    const ext = path.extname(key).toLowerCase()
    const contentType = CONTENT_TYPES[ext]
    if (!contentType) {
      console.warn(`Saltando (tipo desconocido): ${key}`)
      continue
    }

    const localPath = `/media/${key}`

    if (!FORCE && (await r2ObjectExists(key))) {
      mapping[localPath] = getR2PublicUrl(key)
      skipped++
      continue
    }

    const buffer = await readFile(absPath)
    const url = await uploadToR2(key, buffer, contentType)
    mapping[localPath] = url
    uploaded++
    console.log(`Subido: ${key}`)
  }

  const mappingPath = path.join(process.cwd(), "scripts", "media-r2-mapping.json")
  await writeFile(mappingPath, JSON.stringify(mapping, null, 2))

  console.log(`\nListo. Subidos: ${uploaded}, ya existían: ${skipped}, total: ${files.length}`)
  console.log(`Mapeo guardado en ${mappingPath}`)
}

main().catch((error) => {
  console.error("Error en la migración:", error)
  process.exit(1)
})
