"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"

export function ComingSoonBadge({ className }: { className?: string }) {
  const t = useTranslations("Panel")
  return (
    <Badge variant="secondary" className={className}>
      {t("comingSoon")}
    </Badge>
  )
}
