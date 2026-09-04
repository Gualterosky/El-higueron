export const ANNOUNCEMENT_FREQUENCIES = ["always", "once", "daily"] as const

export type AnnouncementFrequency = (typeof ANNOUNCEMENT_FREQUENCIES)[number]

export function isAnnouncementFrequency(
  value: string,
): value is AnnouncementFrequency {
  return (ANNOUNCEMENT_FREQUENCIES as readonly string[]).includes(value)
}

/** Full editable announcement config (admin panel shape). */
export type AnnouncementConfig = {
  enabled: boolean
  titleEs: string
  titleEn: string
  subtitleEs: string
  subtitleEn: string
  bodyEs: string
  bodyEn: string
  ctaLabelEs: string
  ctaLabelEn: string
  ctaUrl: string
  ctaNewTab: boolean
  imageUrl: string
  imageAlt: string
  /** ISO UTC strings (e.g. 2026-01-31T18:00:00.000Z) or empty when not scheduled. */
  startsAt: string
  endsAt: string
  frequency: AnnouncementFrequency
  delaySeconds: number
  version: number
}

/** Locale-resolved payload sent to the public modal. */
export type AnnouncementPayload = {
  version: number
  title: string
  subtitle: string
  body: string
  ctaLabel: string
  ctaUrl: string
  ctaNewTab: boolean
  imageUrl: string
  imageAlt: string
  frequency: AnnouncementFrequency
  delaySeconds: number
}

export const DEFAULT_ANNOUNCEMENT: AnnouncementConfig = {
  enabled: false,
  titleEs: "",
  titleEn: "",
  subtitleEs: "",
  subtitleEn: "",
  bodyEs: "",
  bodyEn: "",
  ctaLabelEs: "",
  ctaLabelEn: "",
  ctaUrl: "",
  ctaNewTab: false,
  imageUrl: "",
  imageAlt: "",
  startsAt: "",
  endsAt: "",
  frequency: "once",
  delaySeconds: 2,
  version: 1,
}

export const MAX_ANNOUNCEMENT_DELAY_SECONDS = 60

/** Locale-resolved view of the config, without checking schedule or enabled flag. */
export function toAnnouncementPayload(
  config: AnnouncementConfig,
  locale: string,
): AnnouncementPayload {
  const isEnglish = locale === "en"
  const pick = (es: string, en: string) => {
    const value = isEnglish ? en || es : es || en
    return value.trim()
  }

  return {
    version: config.version,
    title: pick(config.titleEs, config.titleEn),
    subtitle: pick(config.subtitleEs, config.subtitleEn),
    body: pick(config.bodyEs, config.bodyEn),
    ctaLabel: pick(config.ctaLabelEs, config.ctaLabelEn),
    ctaUrl: config.ctaUrl.trim(),
    ctaNewTab: config.ctaNewTab,
    imageUrl: config.imageUrl.trim(),
    imageAlt: config.imageAlt.trim(),
    frequency: config.frequency,
    delaySeconds: config.delaySeconds,
  }
}

/** True when the announcement should be visible right now. */
export function isAnnouncementLive(
  config: AnnouncementConfig,
  now: Date = new Date(),
): boolean {
  if (!config.enabled) return false

  const hasContent =
    Boolean(config.titleEs.trim()) ||
    Boolean(config.titleEn.trim()) ||
    Boolean(config.bodyEs.trim()) ||
    Boolean(config.bodyEn.trim()) ||
    Boolean(config.imageUrl.trim())
  if (!hasContent) return false

  if (config.startsAt) {
    const start = new Date(config.startsAt)
    if (!Number.isNaN(start.getTime()) && now < start) return false
  }

  if (config.endsAt) {
    const end = new Date(config.endsAt)
    if (!Number.isNaN(end.getTime()) && now > end) return false
  }

  return true
}
