/**
 * Downloads every object from the R2 media bucket into public/media/,
 * mirroring the folder structure (key "Boulders/Img17.jpg" -> local file
 * "public/media/Boulders/Img17.jpg"). public/media/ is gitignored — it's a
 * local working copy, not the source of truth (R2 is).
 *
 * Run: pnpm media:download
 * Use this once to set up your local folder, or any time you want to pull
 * down changes someone else made directly in the Cloudflare dashboard.
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { isR2Configured, listR2Objects } from "../lib/storage/r2"

const MEDIA_ROOT = path.join(process.cwd(), "public", "media")

function getClient(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
}

async function main() {
  if (!isR2Configured()) {
    console.error(
      "Faltan variables de entorno de R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL) en .env.local"
    )
    process.exit(1)
  }

  const client = getClient()
  const keys = await listR2Objects("")
  console.log(`Encontrados ${keys.length} objetos en el bucket`)

  let downloaded = 0
  for (const key of keys) {
    const localPath = path.join(MEDIA_ROOT, ...key.split("/"))
    await mkdir(path.dirname(localPath), { recursive: true })

    const response = await client.send(
      new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key })
    )
    const bytes = await response.Body?.transformToByteArray()
    if (!bytes) continue

    await writeFile(localPath, Buffer.from(bytes))
    downloaded++
    console.log(`Descargado: ${key}`)
  }

  console.log(`\nListo. Descargados ${downloaded}/${keys.length} archivos en public/media/`)
}

main().catch((error) => {
  console.error("Error descargando desde R2:", error)
  process.exit(1)
})
