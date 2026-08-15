"use server"

import { getSession } from "@/lib/auth/session"
import {
  isContentSection,
  setHiddenSection,
  setMaintenanceMode,
  type ContentSection,
} from "@/lib/site-settings"

export type SetMaintenanceModeResult =
  | { ok: true; maintenanceMode: boolean }
  | { ok: false; error: "unauthorized" | "failed" }

export type SetHiddenSectionResult =
  | { ok: true; section: ContentSection; hidden: boolean }
  | { ok: false; error: "unauthorized" | "failed" | "invalid_section" }

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

export async function setMaintenanceModeAction(
  enabled: boolean,
): Promise<SetMaintenanceModeResult> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "unauthorized" }
  }

  try {
    await setMaintenanceMode(enabled)
    return { ok: true, maintenanceMode: enabled }
  } catch (error) {
    console.error("[site-settings] setMaintenanceModeAction failed:", error)
    return { ok: false, error: "failed" }
  }
}

export async function setHiddenSectionAction(
  section: string,
  hidden: boolean,
): Promise<SetHiddenSectionResult> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "unauthorized" }
  }

  if (!isContentSection(section)) {
    return { ok: false, error: "invalid_section" }
  }

  try {
    await setHiddenSection(section, hidden)
    return { ok: true, section, hidden }
  } catch (error) {
    console.error("[site-settings] setHiddenSectionAction failed:", error)
    return { ok: false, error: "failed" }
  }
}
