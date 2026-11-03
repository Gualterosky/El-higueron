"use server"

import { getModeratorSession } from "@/lib/auth/guards"
import { isR2Configured, missingR2EnvVars, uploadToR2 } from "@/lib/storage/r2"

/** Uploaded equipment photos live in the "Equipos/" prefix of the R2 media bucket, square (1:1) as per design decision. */
const R2_PREFIX = "Equipos"
const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}

export type UploadEquipmentImageResult =
  | { ok: true; url: string }
  | {
      ok: false
      error:
        | "unauthorized"
        | "missing_file"
        | "invalid_type"
        | "too_large"
        | "not_configured"
        | "failed"
      message?: string
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

export async function uploadEquipmentImageAction(
  formData: FormData,
): Promise<UploadEquipmentImageResult> {
  if (!(await getModeratorSession())) {
    return { ok: false, error: "unauthorized" }
  }

  if (!isR2Configured()) {
    const missing = missingR2EnvVars()
    console.error("[equipos] uploadEquipmentImageAction: faltan variables R2:", missing.join(", "))
    return {
      ok: false,
      error: "not_configured",
      message: `Faltan variables de entorno: ${missing.join(", ")}`,
    }
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
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, error: "failed", message }
  }
}