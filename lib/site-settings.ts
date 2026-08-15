import { eq } from "drizzle-orm"
import { unstable_cache, revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import {
  DEFAULT_HIDDEN_SECTIONS,
  type AppSiteSettings,
  type ContentSection,
  type HiddenSections,
} from "@/lib/site-settings/types"

export const SITE_SETTINGS_ID = "default"
export const SITE_SETTINGS_TAG = "site-settings"

export {
  CONTENT_SECTIONS,
  DEFAULT_HIDDEN_SECTIONS,
  isContentSection,
  type ContentSection,
  type HiddenSections,
} from "@/lib/site-settings/types"

export type { AppSiteSettings } from "@/lib/site-settings/types"

const SECTION_COLUMN: Record<
  ContentSection,
  | "hideEscalada"
  | "hideMuro"
  | "hideBoulder"
  | "hideCamping"
  | "hideEquipos"
  | "hideVisita"
  | "hideGaleria"
> = {
  escalada: "hideEscalada",
  muro: "hideMuro",
  boulder: "hideBoulder",
  camping: "hideCamping",
  equipos: "hideEquipos",
  visita: "hideVisita",
  galeria: "hideGaleria",
}

function rowToSettings(
  row: typeof siteSettings.$inferSelect | undefined,
): AppSiteSettings {
  if (!row) {
    return {
      maintenanceMode: false,
      hiddenSections: { ...DEFAULT_HIDDEN_SECTIONS },
    }
  }

  return {
    maintenanceMode: Boolean(row.maintenanceMode),
    hiddenSections: {
      escalada: Boolean(row.hideEscalada),
      muro: Boolean(row.hideMuro),
      boulder: Boolean(row.hideBoulder),
      camping: Boolean(row.hideCamping),
      equipos: Boolean(row.hideEquipos),
      visita: Boolean(row.hideVisita),
      galeria: Boolean(row.hideGaleria),
    },
  }
}

async function readSiteSettings(): Promise<AppSiteSettings> {
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, SITE_SETTINGS_ID))
      .limit(1)

    return rowToSettings(row)
  } catch (error) {
    console.error("[site-settings] getSiteSettings failed:", error)
    return {
      maintenanceMode: false,
      hiddenSections: { ...DEFAULT_HIDDEN_SECTIONS },
    }
  }
}

export const getSiteSettings = unstable_cache(
  readSiteSettings,
  ["site-settings"],
  { tags: [SITE_SETTINGS_TAG] },
)

export async function getMaintenanceMode(): Promise<boolean> {
  const settings = await getSiteSettings()
  return settings.maintenanceMode
}

export async function getHiddenSections(): Promise<HiddenSections> {
  const settings = await getSiteSettings()
  return settings.hiddenSections
}

function invalidateSiteSettingsCache() {
  updateTag(SITE_SETTINGS_TAG)
  revalidatePath("/", "layout")
}

export async function setMaintenanceMode(enabled: boolean): Promise<void> {
  const [existing] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1)

  if (existing) {
    await db
      .update(siteSettings)
      .set({
        maintenanceMode: enabled,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, SITE_SETTINGS_ID))
  } else {
    await db.insert(siteSettings).values({
      id: SITE_SETTINGS_ID,
      maintenanceMode: enabled,
      updatedAt: new Date(),
    })
  }

  invalidateSiteSettingsCache()
}

export async function setHiddenSection(
  section: ContentSection,
  hidden: boolean,
): Promise<void> {
  const column = SECTION_COLUMN[section]
  const [existing] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1)

  if (existing) {
    await db
      .update(siteSettings)
      .set({
        [column]: hidden,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, SITE_SETTINGS_ID))
  } else {
    await db.insert(siteSettings).values({
      id: SITE_SETTINGS_ID,
      maintenanceMode: false,
      [column]: hidden,
      updatedAt: new Date(),
    })
  }

  invalidateSiteSettingsCache()
}

export async function assertSectionVisible(
  section: ContentSection,
  locale: string,
): Promise<void> {
  const hidden = await getHiddenSections()
  if (hidden[section]) {
    redirect(`/${locale}`)
  }
}
