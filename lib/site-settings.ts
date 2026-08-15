import { eq } from "drizzle-orm"
import { unstable_cache, revalidatePath, updateTag } from "next/cache"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"

export const SITE_SETTINGS_ID = "default"
export const SITE_SETTINGS_TAG = "site-settings"

async function readMaintenanceMode(): Promise<boolean> {
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, SITE_SETTINGS_ID))
      .limit(1)

    return Boolean(row?.maintenanceMode)
  } catch (error) {
    console.error("[site-settings] getMaintenanceMode failed:", error)
    return false
  }
}

export const getMaintenanceMode = unstable_cache(
  readMaintenanceMode,
  ["maintenance-mode"],
  { tags: [SITE_SETTINGS_TAG] },
)

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

  updateTag(SITE_SETTINGS_TAG)
  revalidatePath("/", "layout")
}
