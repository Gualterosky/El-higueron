"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("Panel")

  useEffect(() => {
    console.error("[admin]", error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-semibold text-forest">{t("errorTitle")}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{t("errorBody")}</p>
      <Button type="button" onClick={reset} className="bg-forest text-white hover:bg-forest/90">
        {t("errorRetry")}
      </Button>
    </div>
  )
}
