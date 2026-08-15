"use server"

import { getSession } from "@/lib/auth/session"
import { setMaintenanceMode } from "@/lib/site-settings"

export type SetMaintenanceModeResult =
  | { ok: true; maintenanceMode: boolean }
  | { ok: false; error: "unauthorized" | "failed" }

export async function setMaintenanceModeAction(
  enabled: boolean,
): Promise<SetMaintenanceModeResult> {
  const session = await getSession()

  if (
    !session ||
    session.user.role !== "administrador" ||
    session.user.mustChangePassword
  ) {
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
