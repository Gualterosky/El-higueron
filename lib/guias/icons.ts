import {
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Youtube,
  type LucideIcon,
} from "lucide-react"
import type { GuideLinkIcon } from "@/lib/guias/types"

/** Mapa ícono (lucide) por valor de `guide_link.icon`. */
export const GUIDE_LINK_ICON_COMPONENTS: Record<GuideLinkIcon, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  web: Globe,
  mail: Mail,
  other: ExternalLink,
}