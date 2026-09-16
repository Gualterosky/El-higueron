"use client"

import { useState } from "react"
import { Phone } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

/** Click-to-reveal contact info: shown in the DOM only after an explicit
 *  click, to make automated scraping of emails/phones a bit harder than
 *  printing them directly in the initial HTML. It's still public to any
 *  visitor who asks — see system_architecture.md for the privacy trade-off
 *  that makes this different from every other post family, where contact
 *  info is never shown publicly at all. */
export function ContactReveal({ contactInfo }: { contactInfo: string }) {
  const t = useTranslations("Comunidad.feed")
  const [revealed, setRevealed] = useState(false)

  if (revealed) {
    return (
      <p className="flex items-center gap-1.5 text-sm font-medium text-forest">
        <Phone className="h-3.5 w-3.5" />
        {contactInfo}
      </p>
    )
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-forest/40 text-forest hover:bg-forest/10"
      onClick={() => setRevealed(true)}
    >
      <Phone className="h-3.5 w-3.5" />
      {t("contactButton")}
    </Button>
  )
}
