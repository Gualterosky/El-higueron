import { S3Client, PutObjectCommand, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"

/**
 * Cloudflare R2 (API compatible con S3) — almacenamiento de las imágenes
 * estáticas del sitio (galería, boulder, camping, naturaleza, equipos,
 * novedades). El contenido generado por visitantes (Muro) sigue en
 * Cloudinary (components/muro/media-uploader.tsx) — son dos almacenamientos
 * de imágenes distintos a propósito, ver system_architecture.md sección 15.
 */

const REQUIRED_ENV = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
] as const

export function isR2Configured(): boolean {
  return REQUIRED_ENV.every((key) => !!process.env[key])
}

function getEnv(key: (typeof REQUIRED_ENV)[number]): string {
  const value = process.env[key]
  if (!value) throw new Error(`Falta la variable de entorno ${key} (configuración de Cloudflare R2)`)
  return value
}

let cachedClient: S3Client | null = null

function getClient(): S3Client {
  if (cachedClient) return cachedClient
  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${getEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
    },
  })
  return cachedClient
}

/** Sube (o sobrescribe) un objeto y devuelve su URL pública. */
export async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<string> {
  const client = getClient()
  await client.send(
    new PutObjectCommand({
      Bucket: getEnv("R2_BUCKET_NAME"),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return getR2PublicUrl(key)
}

export async function r2ObjectExists(key: string): Promise<boolean> {
  const client = getClient()
  try {
    await client.send(new HeadObjectCommand({ Bucket: getEnv("R2_BUCKET_NAME"), Key: key }))
    return true
  } catch {
    return false
  }
}

/** Lista todas las keys bajo un prefijo (ej. "Equipos/", "Novedades/"), paginando si hace falta. */
export async function listR2Objects(prefix: string): Promise<string[]> {
  const client = getClient()
  const keys: string[] = []
  let continuationToken: string | undefined

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: getEnv("R2_BUCKET_NAME"),
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    )
    for (const object of response.Contents ?? []) {
      if (object.Key) keys.push(object.Key)
    }
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined
  } while (continuationToken)

  return keys
}

export function getR2PublicUrl(key: string): string {
  const base = getEnv("R2_PUBLIC_URL").replace(/\/+$/, "")
  return `${base}/${key.split("/").map(encodeURIComponent).join("/")}`
}
