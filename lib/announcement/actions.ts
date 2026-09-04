"use server"

import { mkdir, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { getSession } from "@/lib/auth/session"
import {
  getAnnouncement,
  saveAnnouncement,
  setAnnouncementEnabled,
} from "@/lib/announcement/queries"
import {
  isAnnouncementFrequency,
  MAX_ANNOUNCEMENT_DELAY_SECONDS,
  type AnnouncementConfig,
} from "@/lib/announcement/types"

/** Uploaded announcement images live here so they sit next to the other site media. */
const UPLOAD_DIR = ["public", "media", "Novedades"] as const
const PUBLIC_PREFIX = "/media/Novedades"
const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
}

export type SaveAnnouncementResult =
  | { ok: true; config: AnnouncementConfig }
  | { ok: false; error: "unauthorized" | "failed" | "invalid" }

export type ToggleAnnouncementResult =
  | { ok: true; enabled: boolean }
  | { ok: false; error: "unauthorized" | "failed" }

export type UploadAnnouncementImageResult =
  | { ok: true; url: string }
  | {
      ok: false
      error: "unauthorized" | "missing_file" | "invalid_type" | "too_large" | "read_only" | "failed"
    }

export type ListMediaImagesResult =
  | { ok: true; images: string[] }
  | { ok: false; error: "unauthorized" | "failed" }

async function requireAdmin() {
  const session = await getSession()
  if (
    !session ||
    session.user.role !== "administrador" ||
    session.user.mustChangePassword
  ) {
    return null
  }
  return session
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, maxLength)
}

/** Allows same-origin paths (/media/...) plus http(s), mailto and tel links. */
function sanitizeUrl(value: unknown): string {
  const raw = sanitizeText(value, 500)
  if (!raw) return ""
  if (raw.startsWith("/")) return raw
  if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) return raw
  return `https://${raw}`
}

function sanitizeIsoDate(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return ""
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString()
}

export async function getAnnouncementConfigAction(): Promise<AnnouncementConfig | null> {
  if (!(await requireAdmin())) return null
  return getAnnouncement()
}

export async function saveAnnouncementAction(
  input: AnnouncementConfig,
): Promise<SaveAnnouncementResult> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "unauthorized" }
  }

  if (!input || typeof input !== "object") {
    return { ok: false, error: "invalid" }
  }

  const frequency = isAnnouncementFrequency(String(input.frequency))
    ? input.frequency
    : "once"

  const delaySeconds = Number(input.delaySeconds)

  const config: AnnouncementConfig = {
    enabled: Boolean(input.enabled),
    titleEs: sanitizeText(input.titleEs, 120),
    titleEn: sanitizeText(input.titleEn, 120),
    subtitleEs: sanitizeText(input.subtitleEs, 180),
    subtitleEn: sanitizeText(input.subtitleEn, 180),
    bodyEs: sanitizeText(input.bodyEs, 1200),
    bodyEn: sanitizeText(input.bodyEn, 1200),
    ctaLabelEs: sanitizeText(input.ctaLabelEs, 60),
    ctaLabelEn: sanitizeText(input.ctaLabelEn, 60),
    ctaUrl: sanitizeUrl(input.ctaUrl),
    ctaNewTab: Boolean(input.ctaNewTab),
    imageUrl: sanitizeUrl(input.imageUrl),
    imageAlt: sanitizeText(input.imageAlt, 160),
    startsAt: sanitizeIsoDate(input.startsAt),
    endsAt: sanitizeIsoDate(input.endsAt),
    frequency,
    delaySeconds: Number.isFinite(delaySeconds)
      ? Math.min(Math.max(Math.round(delaySeconds), 0), MAX_ANNOUNCEMENT_DELAY_SECONDS)
      : 0,
    version: 1,
  }

  try {
    const saved = await saveAnnouncement(config)
    return { ok: true, config: saved }
  } catch (error) {
    console.error("[announcement] saveAnnouncementAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function setAnnouncementEnabledAction(
  enabled: boolean,
): Promise<ToggleAnnouncementResult> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "unauthorized" }
  }

  try {
    await setAnnouncementEnabled(enabled)
    return { ok: true, enabled }
  } catch (error) {
    console.error("[announcement] setAnnouncementEnabledAction failed:", error)
    return { ok: false, error: "failed" }
  }
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

export async function uploadAnnouncementImageAction(
  formData: FormData,
): Promise<UploadAnnouncementImageResult> {
  if (!(await requireAdmin())) {
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

  const baseName =
    slugify(file.name.replace(/\.[^.]+$/, "")) || "novedad"
  const fileName = `${baseName}-${Date.now()}.${extension}`
  const directory = path.join(process.cwd(), ...UPLOAD_DIR)

  try {
    await mkdir(directory, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(directory, fileName), buffer)
    return { ok: true, url: `${PUBLIC_PREFIX}/${fileName}` }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      console.error("[announcement] upload blocked by read-only filesystem:", error)
      return { ok: false, error: "read_only" }
    }
    console.error("[announcement] uploadAnnouncementImageAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"])

/** Lists every image already stored in public/media so the admin can reuse one. */
export async function listMediaImagesAction(): Promise<ListMediaImagesResult> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "unauthorized" }
  }

  const mediaRoot = path.join(process.cwd(), "public", "media")

  async function walk(directory: string, prefix: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true })
    const results: string[] = []

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue
      const entryPath = path.join(directory, entry.name)
      const publicPath = `${prefix}/${entry.name}`

      if (entry.isDirectory()) {
        results.push(...(await walk(entryPath, publicPath)))
      } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        results.push(publicPath)
      }
    }

    return results
  }

  try {
    const images = await walk(mediaRoot, "/media")
    images.sort((a, b) => a.localeCompare(b))
    return { ok: true, images }
  } catch (error) {
    console.error("[announcement] listMediaImagesAction failed:", error)
    return { ok: false, error: "failed" }
  }
}
