"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const whatsappNumber = "573172973537"
  const message = encodeURIComponent("Hola, me gustaría obtener información sobre Camping El Higuerón")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-[104px] right-6 z-50 flex h-14 w-14 items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      {/* Tooltip */}
      <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-2 scale-95 whitespace-nowrap rounded-full bg-stone-900/90 px-3.5 py-2 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
        Contáctanos por WhatsApp
        <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-stone-900/90" />
      </span>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />

      {/* Button */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#31E37B] via-[#25D366] to-[#1DA851] text-white shadow-lg shadow-[#128C7E]/30 ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
        <MessageCircle className="h-7 w-7 drop-shadow-sm" strokeWidth={2.25} />
      </span>
    </a>
  )
}
