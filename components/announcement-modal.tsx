"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { AnnouncementPayload } from "@/lib/announcement/types"

const STORAGE_PREFIX = "higueron:announcement"

function storageKey(version: number) {
  return `${STORAGE_PREFIX}:v${version}`
}

/** Returns true when this visitor already dismissed the current announcement. */
function wasDismissed(announcement: AnnouncementPayload): boolean {
  if (announcement.frequency === "always") return false
  if (typeof window === "undefined") return true

  try {
    const stored = window.localStorage.getItem(storageKey(announcement.version))
    if (!stored) return false
    if (announcement.frequency === "once") return true

    const dismissedAt = Number(stored)
    if (!Number.isFinite(dismissedAt)) return false
    return Date.now() - dismissedAt < 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

function rememberDismissal(announcement: AnnouncementPayload) {
  if (announcement.frequency === "always") return
  try {
    window.localStorage.setItem(storageKey(announcement.version), String(Date.now()))
  } catch {
    /* Storage unavailable (private mode): the modal will simply show again. */
  }
}

export function AnnouncementModal({
  announcement,
  forceOpen = false,
  onOpenChange,
}: {
  announcement: AnnouncementPayload | null
  /** Used by the admin preview to bypass the delay and dismissal memory. */
  forceOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const t = useTranslations("Announcement")
  const [open, setOpen] = useState(forceOpen)

  useEffect(() => {
    if (!announcement || forceOpen) return
    if (wasDismissed(announcement)) return

    const timeout = window.setTimeout(
      () => setOpen(true),
      Math.max(announcement.delaySeconds, 0) * 1000,
    )
    return () => window.clearTimeout(timeout)
  }, [announcement, forceOpen])

  if (!announcement) return null

  const paragraphs = announcement.body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    onOpenChange?.(next)
    if (!next && announcement && !forceOpen) {
      rememberDismissal(announcement)
    }
  }

  const hasCta = Boolean(announcement.ctaUrl)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-xl"
        aria-describedby={undefined}
      >
        {announcement.imageUrl ? (
          <div className="relative aspect-[16/9] w-full bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={encodeURI(announcement.imageUrl)}
              alt={announcement.imageAlt || announcement.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="space-y-3 p-6">
          {announcement.title ? (
            <DialogTitle className="text-2xl font-semibold tracking-tight text-forest">
              {announcement.title}
            </DialogTitle>
          ) : (
            <DialogTitle className="sr-only">{t("fallbackTitle")}</DialogTitle>
          )}

          {announcement.subtitle ? (
            <DialogDescription className="text-base text-muted-foreground">
              {announcement.subtitle}
            </DialogDescription>
          ) : null}

          {paragraphs.length > 0 ? (
            <div className="space-y-2 text-sm leading-relaxed text-foreground/80">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="sm:order-1"
            >
              {t("dismiss")}
            </Button>
            {hasCta ? (
              <Button asChild className="sm:order-2">
                <a
                  href={announcement.ctaUrl}
                  target={announcement.ctaNewTab ? "_blank" : undefined}
                  rel={announcement.ctaNewTab ? "noopener noreferrer" : undefined}
                  onClick={() => handleOpenChange(false)}
                >
                  {announcement.ctaLabel || t("defaultCta")}
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
