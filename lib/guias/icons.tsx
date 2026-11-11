import type { ComponentType } from "react"
import {
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Youtube,
} from "lucide-react"
import type { GuideLinkIcon } from "@/lib/guias/types"

type GuideIconComponent = ComponentType<{ className?: string }>

/** Lucide no incluye TikTok, así que se dibuja como SVG propio (usa currentColor). */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  )
}

/** Mapa ícono por valor de `guide_link.icon`. */
export const GUIDE_LINK_ICON_COMPONENTS: Record<GuideLinkIcon, GuideIconComponent> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: TikTokIcon,
  linkedin: Linkedin,
  web: Globe,
  mail: Mail,
  other: ExternalLink,
}
