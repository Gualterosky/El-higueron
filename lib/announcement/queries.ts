import { eq } from "drizzle-orm"
import { unstable_cache, revalidatePath, updateTag } from "next/cache"
import { db } from "@/lib/db"
import { siteAnnouncement } from "@/lib/db/schema"
import {
  DEFAULT_ANNOUNCEMENT,
  MAX_ANNOUNCEMENT_DELAY_SECONDS,
  isAnnouncementFrequency,
  isAnnouncementLive,
  toAnnouncementPayload,
  type AnnouncementConfig,
  type AnnouncementPayload,
} from "@/lib/announcement/types"

export const ANNOUNCEMENT_ID = "default"
export const ANNOUNCEMENT_TAG = "site-announcement"

function toIso(value: Date | null): string {
  return value ? value.toISOString() : ""
}

function fromIso(value: string): Date | null {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function rowToConfig(
  row: typeof siteAnnouncement.$inferSelect | undefined,
): AnnouncementConfig {
  if (!row) return { ...DEFAULT_ANNOUNCEMENT }

  return {
    enabled: Boolean(row.enabled),
    titleEs: row.titleEs ?? "",
    titleEn: row.titleEn ?? "",
    subtitleEs: row.subtitleEs ?? "",
    subtitleEn: row.subtitleEn ?? "",
    bodyEs: row.bodyEs ?? "",
    bodyEn: row.bodyEn ?? "",
    ctaLabelEs: row.ctaLabelEs ?? "",
    ctaLabelEn: row.ctaLabelEn ?? "",
    ctaUrl: row.ctaUrl ?? "",
    ctaNewTab: Boolean(row.ctaNewTab),
    imageUrl: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? "",
    startsAt: toIso(row.startsAt),
    endsAt: toIso(row.endsAt),
    frequency: isAnnouncementFrequency(row.frequency) ? row.frequency : "once",
    delaySeconds: row.delaySeconds ?? 0,
    version: row.version ?? 1,
  }
}

async function readAnnouncement(): Promise<AnnouncementConfig> {
  try {
    const [row] = await db
      .select()
      .from(siteAnnouncement)
      .where(eq(siteAnnouncement.id, ANNOUNCEMENT_ID))
      .limit(1)

    return rowToConfig(row)
  } catch (error) {
    console.error("[announcement] getAnnouncement failed:", error)
    return { ...DEFAULT_ANNOUNCEMENT }
  }
}

export const getAnnouncement = unstable_cache(
  readAnnouncement,
  ["site-announcement"],
  { tags: [ANNOUNCEMENT_TAG] },
)

/** Payload for the public modal, or null when the announcement is not live. */
export async function getLiveAnnouncement(
  locale: string,
): Promise<AnnouncementPayload | null> {
  const config = await getAnnouncement()
  if (!isAnnouncementLive(config)) return null
  return toAnnouncementPayload(config, locale)
}

function clampDelay(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(Math.max(Math.round(value), 0), MAX_ANNOUNCEMENT_DELAY_SECONDS)
}

export async function saveAnnouncement(
  config: AnnouncementConfig,
): Promise<AnnouncementConfig> {
  const [existing] = await db
    .select()
    .from(siteAnnouncement)
    .where(eq(siteAnnouncement.id, ANNOUNCEMENT_ID))
    .limit(1)

  const previous = rowToConfig(existing)
  /** Bump the version so visitors who already dismissed it see the new content. */
  const contentChanged =
    previous.titleEs !== config.titleEs ||
    previous.titleEn !== config.titleEn ||
    previous.subtitleEs !== config.subtitleEs ||
    previous.subtitleEn !== config.subtitleEn ||
    previous.bodyEs !== config.bodyEs ||
    previous.bodyEn !== config.bodyEn ||
    previous.ctaLabelEs !== config.ctaLabelEs ||
    previous.ctaLabelEn !== config.ctaLabelEn ||
    previous.ctaUrl !== config.ctaUrl ||
    previous.imageUrl !== config.imageUrl

  const values = {
    enabled: config.enabled,
    titleEs: config.titleEs.trim(),
    titleEn: config.titleEn.trim(),
    subtitleEs: config.subtitleEs.trim(),
    subtitleEn: config.subtitleEn.trim(),
    bodyEs: config.bodyEs.trim(),
    bodyEn: config.bodyEn.trim(),
    ctaLabelEs: config.ctaLabelEs.trim(),
    ctaLabelEn: config.ctaLabelEn.trim(),
    ctaUrl: config.ctaUrl.trim(),
    ctaNewTab: config.ctaNewTab,
    imageUrl: config.imageUrl.trim(),
    imageAlt: config.imageAlt.trim(),
    startsAt: fromIso(config.startsAt),
    endsAt: fromIso(config.endsAt),
    frequency: config.frequency,
    delaySeconds: clampDelay(config.delaySeconds),
    version: contentChanged ? previous.version + 1 : previous.version,
    updatedAt: new Date(),
  }

  if (existing) {
    await db
      .update(siteAnnouncement)
      .set(values)
      .where(eq(siteAnnouncement.id, ANNOUNCEMENT_ID))
  } else {
    await db
      .insert(siteAnnouncement)
      .values({ id: ANNOUNCEMENT_ID, ...values })
  }

  updateTag(ANNOUNCEMENT_TAG)
  revalidatePath("/", "layout")

  return {
    ...config,
    delaySeconds: values.delaySeconds,
    version: values.version,
  }
}

export async function setAnnouncementEnabled(
  enabled: boolean,
): Promise<void> {
  const [existing] = await db
    .select()
    .from(siteAnnouncement)
    .where(eq(siteAnnouncement.id, ANNOUNCEMENT_ID))
    .limit(1)

  if (existing) {
    await db
      .update(siteAnnouncement)
      .set({ enabled, updatedAt: new Date() })
      .where(eq(siteAnnouncement.id, ANNOUNCEMENT_ID))
  } else {
    await db
      .insert(siteAnnouncement)
      .values({ id: ANNOUNCEMENT_ID, enabled, updatedAt: new Date() })
  }

  updateTag(ANNOUNCEMENT_TAG)
  revalidatePath("/", "layout")
}
