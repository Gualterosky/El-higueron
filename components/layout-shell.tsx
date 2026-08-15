"use client"

import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { MaintenanceScreen } from "@/components/maintenance-screen"
import { usePathname } from "@/i18n/navigation"
import type { HiddenSections } from "@/lib/site-settings/types"

const ChatBot = dynamic(() => import("@/components/chat-bot").then((mod) => mod.ChatBot), {
  ssr: false,
})

const AUTH_ROUTES = ["/login", "/registro", "/cambiar-contrasena"]
const PANEL_PREFIXES = ["/admin", "/staff", "/cuenta"]

/** Routes reachable while the public site is in maintenance mode. */
const MAINTENANCE_ALLOWED = ["/login", "/admin", "/cambiar-contrasena"] as const

function isMaintenanceAllowed(pathname: string) {
  return MAINTENANCE_ALLOWED.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

export function LayoutShell({
  children,
  maintenanceMode = false,
  hiddenSections,
}: {
  children: React.ReactNode
  maintenanceMode?: boolean
  hiddenSections?: HiddenSections
}) {
  const pathname = usePathname()

  if (maintenanceMode && !isMaintenanceAllowed(pathname)) {
    return <MaintenanceScreen />
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
  const isPanelRoute = PANEL_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  if (isAuthRoute || isPanelRoute) {
    return <main className="flex-1">{children}</main>
  }

  return (
    <>
      <Navbar hiddenSections={hiddenSections} />
      <main className="flex-1">{children}</main>
      <Footer hiddenSections={hiddenSections} />
      <WhatsAppButton />
      <ChatBot />
    </>
  )
}
