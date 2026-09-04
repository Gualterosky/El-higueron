"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Eye, ImageIcon, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnnouncementModal } from "@/components/announcement-modal"
import {
  listMediaImagesAction,
  saveAnnouncementAction,
  setAnnouncementEnabledAction,
  uploadAnnouncementImageAction,
} from "@/lib/announcement/actions"
import {
  ANNOUNCEMENT_FREQUENCIES,
  DEFAULT_ANNOUNCEMENT,
  MAX_ANNOUNCEMENT_DELAY_SECONDS,
  toAnnouncementPayload,
  type AnnouncementConfig,
  type AnnouncementFrequency,
} from "@/lib/announcement/types"

const NO_IMAGE_VALUE = "__none__"

/** Converts an ISO UTC string into the local value expected by datetime-local. */
function isoToLocalInput(iso: string): string {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function localInputToIso(value: string): string {
  if (!value) return ""
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "" : date.toISOString()
}

export function AdminAnnouncementSection({
  initialConfig = DEFAULT_ANNOUNCEMENT,
}: {
  initialConfig?: AnnouncementConfig
}) {
  const t = useTranslations("Panel.content.announcement")
  const locale = useLocale()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [config, setConfig] = useState<AnnouncementConfig>(initialConfig)
  const [mediaImages, setMediaImages] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isSaving, startSaving] = useTransition()
  const [isToggling, startToggling] = useTransition()

  useEffect(() => {
    let active = true
    listMediaImagesAction().then((result) => {
      if (active && result.ok) setMediaImages(result.images)
    })
    return () => {
      active = false
    }
  }, [])

  function update<K extends keyof AnnouncementConfig>(
    key: K,
    value: AnnouncementConfig[K],
  ) {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setStatus("idle")
  }

  function onToggleEnabled(checked: boolean) {
    const previous = config.enabled
    update("enabled", checked)

    startToggling(async () => {
      const result = await setAnnouncementEnabledAction(checked)
      if (!result.ok) {
        update("enabled", previous)
        setStatus("error")
        return
      }
      router.refresh()
    })
  }

  function onSave() {
    startSaving(async () => {
      const result = await saveAnnouncementAction(config)
      if (!result.ok) {
        setStatus("error")
        return
      }
      setConfig(result.config)
      setStatus("saved")
      router.refresh()
    })
  }

  async function onUpload(file: File) {
    setUploadError(null)
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadAnnouncementImageAction(formData)
    setIsUploading(false)

    if (!result.ok) {
      setUploadError(t(`uploadErrors.${result.error}`))
      return
    }

    update("imageUrl", result.url)
    setMediaImages((prev) =>
      prev.includes(result.url) ? prev : [...prev, result.url].sort(),
    )
  }

  const previewPayload = toAnnouncementPayload(config, locale)

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-forest">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3 sm:px-5">
        <div>
          <Label htmlFor="announcement-enabled" className="text-sm font-medium">
            {t("toggle")}
          </Label>
          <p className="text-xs text-muted-foreground">
            {isToggling
              ? t("saving")
              : config.enabled
                ? t("enabledOn")
                : t("enabledOff")}
          </p>
        </div>
        <Switch
          id="announcement-enabled"
          checked={config.enabled}
          disabled={isToggling}
          onCheckedChange={onToggleEnabled}
          aria-label={t("toggle")}
        />
      </div>

      <div className="space-y-6 rounded-xl border border-border/60 p-4 sm:p-5">
        <Tabs defaultValue="es">
          <TabsList>
            <TabsTrigger value="es">{t("langEs")}</TabsTrigger>
            <TabsTrigger value="en">{t("langEn")}</TabsTrigger>
          </TabsList>

          <TabsContent value="es" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title-es">{t("fields.title")}</Label>
              <Input
                id="title-es"
                value={config.titleEs}
                maxLength={120}
                placeholder={t("placeholders.title")}
                onChange={(event) => update("titleEs", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle-es">{t("fields.subtitle")}</Label>
              <Input
                id="subtitle-es"
                value={config.subtitleEs}
                maxLength={180}
                placeholder={t("placeholders.subtitle")}
                onChange={(event) => update("subtitleEs", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body-es">{t("fields.body")}</Label>
              <Textarea
                id="body-es"
                value={config.bodyEs}
                maxLength={1200}
                rows={5}
                placeholder={t("placeholders.body")}
                onChange={(event) => update("bodyEs", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-label-es">{t("fields.ctaLabel")}</Label>
              <Input
                id="cta-label-es"
                value={config.ctaLabelEs}
                maxLength={60}
                placeholder={t("placeholders.ctaLabel")}
                onChange={(event) => update("ctaLabelEs", event.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="en" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title-en">{t("fields.title")}</Label>
              <Input
                id="title-en"
                value={config.titleEn}
                maxLength={120}
                placeholder={t("placeholders.title")}
                onChange={(event) => update("titleEn", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle-en">{t("fields.subtitle")}</Label>
              <Input
                id="subtitle-en"
                value={config.subtitleEn}
                maxLength={180}
                placeholder={t("placeholders.subtitle")}
                onChange={(event) => update("subtitleEn", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body-en">{t("fields.body")}</Label>
              <Textarea
                id="body-en"
                value={config.bodyEn}
                maxLength={1200}
                rows={5}
                placeholder={t("placeholders.body")}
                onChange={(event) => update("bodyEn", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-label-en">{t("fields.ctaLabel")}</Label>
              <Input
                id="cta-label-en"
                value={config.ctaLabelEn}
                maxLength={60}
                placeholder={t("placeholders.ctaLabel")}
                onChange={(event) => update("ctaLabelEn", event.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cta-url">{t("fields.ctaUrl")}</Label>
            <Input
              id="cta-url"
              value={config.ctaUrl}
              placeholder={t("placeholders.ctaUrl")}
              onChange={(event) => update("ctaUrl", event.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("hints.ctaUrl")}</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 px-3 py-2">
            <Label htmlFor="cta-new-tab" className="text-sm font-normal">
              {t("fields.ctaNewTab")}
            </Label>
            <Switch
              id="cta-new-tab"
              checked={config.ctaNewTab}
              onCheckedChange={(checked) => update("ctaNewTab", checked)}
              aria-label={t("fields.ctaNewTab")}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">{t("fields.image")}</Label>
            <p className="text-xs text-muted-foreground">{t("hints.image")}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
              {config.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={encodeURI(config.imageUrl)}
                  alt={config.imageAlt || t("fields.image")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-6 w-6" aria-hidden />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void onUpload(file)
                    event.target.value = ""
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Upload className="mr-1 h-4 w-4" aria-hidden />
                  )}
                  {t("uploadButton")}
                </Button>

                <Select
                  value={config.imageUrl || NO_IMAGE_VALUE}
                  onValueChange={(value) =>
                    update("imageUrl", value === NO_IMAGE_VALUE ? "" : value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-72" size="sm">
                    <SelectValue placeholder={t("pickExisting")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_IMAGE_VALUE}>{t("noImage")}</SelectItem>
                    {mediaImages.map((image) => (
                      <SelectItem key={image} value={image}>
                        {image.replace("/media/", "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                value={config.imageUrl}
                placeholder="/media/Novedades/mi-imagen.jpg"
                onChange={(event) => update("imageUrl", event.target.value)}
              />
              <Input
                value={config.imageAlt}
                maxLength={160}
                placeholder={t("placeholders.imageAlt")}
                onChange={(event) => update("imageAlt", event.target.value)}
              />
              {uploadError ? (
                <p className="text-xs text-destructive" role="alert">
                  {uploadError}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="starts-at">{t("fields.startsAt")}</Label>
            <Input
              id="starts-at"
              type="datetime-local"
              value={isoToLocalInput(config.startsAt)}
              onChange={(event) =>
                update("startsAt", localInputToIso(event.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ends-at">{t("fields.endsAt")}</Label>
            <Input
              id="ends-at"
              type="datetime-local"
              value={isoToLocalInput(config.endsAt)}
              onChange={(event) =>
                update("endsAt", localInputToIso(event.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">{t("fields.frequency")}</Label>
            <Select
              value={config.frequency}
              onValueChange={(value) =>
                update("frequency", value as AnnouncementFrequency)
              }
            >
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ANNOUNCEMENT_FREQUENCIES.map((frequency) => (
                  <SelectItem key={frequency} value={frequency}>
                    {t(`frequencies.${frequency}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="delay">{t("fields.delay")}</Label>
            <Input
              id="delay"
              type="number"
              min={0}
              max={MAX_ANNOUNCEMENT_DELAY_SECONDS}
              value={config.delaySeconds}
              onChange={(event) =>
                update("delaySeconds", Number(event.target.value))
              }
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">{t("hints.schedule")}</p>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {t("save")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="mr-1 h-4 w-4" aria-hidden />
            {t("preview")}
          </Button>
          {status === "saved" ? (
            <span className="text-xs text-muted-foreground">{t("saved")}</span>
          ) : null}
          {status === "error" ? (
            <span className="text-xs text-destructive" role="alert">
              {t("error")}
            </span>
          ) : null}
        </div>
      </div>

      {previewOpen ? (
        <AnnouncementModal
          announcement={previewPayload}
          forceOpen
          onOpenChange={(open) => {
            if (!open) setPreviewOpen(false)
          }}
        />
      ) : null}
    </section>
  )
}
