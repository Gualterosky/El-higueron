/**
 * Sincroniza public/media/ (carpeta local, gitignored) hacia el bucket de R2:
 * - Sube cualquier archivo nuevo o modificado (compara MD5 local vs. ETag remoto).
 * - Por defecto NO borra nada en R2 que ya no exista localmente — solo avisa.
 *   Pasa --prune para que también borre en R2 los archivos que quitaste de
 *   tu carpeta local (mirror completo, como `rsync --delete`).
 * - --dry-run: muestra qué haría, sin subir ni borrar nada.
 *
 * Run: pnpm media:sync [--prune] [--dry-run]
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { deleteFromR2, isR2Configured, listR2ObjectsDetailed, uploadToR2 } from "../lib/storage/r2"

const MEDIA_ROOT = path.join(process.cwd(), "public", "media")
const PRUNE = process.argv.includes("--prune")
const DRY_RUN = process.argv.includes("--dry-run")

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
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
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

  const localFiles = await walk(MEDIA_ROOT, "")
  const remoteObjects = await listR2ObjectsDetailed("")
  const remoteByKey = new Map(remoteObjects.map((object) => [object.key, object]))
  const localKeys = new Set(localFiles.map((file) => file.key))

  let uploaded = 0
  let unchanged = 0
  let skipped = 0

  for (const { key, absPath } of localFiles) {
    const ext = path.extname(key).toLowerCase()
    const contentType = CONTENT_TYPES[ext]
    if (!contentType) {
      console.warn(`Saltando (tipo desconocido): ${key}`)
      skipped++
      continue
    }

    const buffer = await readFile(absPath)
    const localMd5 = createHash("md5").update(buffer).digest("hex")
    const remote = remoteByKey.get(key)

    if (remote && remote.etag === localMd5) {
      unchanged++
      continue
    }

    if (DRY_RUN) {
      console.log(`${remote ? "Actualizaría" : "Subiría"}: ${key}`)
    } else {
      await uploadToR2(key, buffer, contentType)
      console.log(`${remote ? "Actualizado" : "Subido"}: ${key}`)
    }
    uploaded++
  }

  const orphaned = remoteObjects.filter((object) => !localKeys.has(object.key))
  if (orphaned.length > 0) {
    if (PRUNE) {
      for (const object of orphaned) {
        if (DRY_RUN) {
          console.log(`Borraría de R2: ${object.key}`)
        } else {
          await deleteFromR2(object.key)
          console.log(`Borrado de R2: ${object.key}`)
        }
      }
    } else {
      console.log(
        `\n${orphaned.length} archivo(s) existen en R2 pero no en tu carpeta local (no se tocaron). ` +
          `Corre con --prune si quieres que se borren también de R2:`
      )
      orphaned.forEach((object) => console.log(`  - ${object.key}`))
    }
  }

  console.log(
    `\nListo${DRY_RUN ? " (dry-run, no se subió/borró nada)" : ""}. Subidos/actualizados: ${uploaded}, sin cambios: ${unchanged}, saltados: ${skipped}, huérfanos en R2: ${orphaned.length}.`
  )
}

main().catch((error) => {
  console.error("Error sincronizando con R2:", error)
  process.exit(1)
})
