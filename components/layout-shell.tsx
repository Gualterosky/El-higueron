"use client"

import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { usePathname } from "@/i18n/navigation"

const ChatBot = dynamic(() => import("@/components/chat-bot").then((mod) => mod.ChatBot), {
  ssr: false,
})

const AUTH_ROUTES = ["/login"]

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (isAuthRoute) {
    return <main className="flex-1">{children}</main>
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatBot />
    </>
  )
}
