"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import {
  ArrowDown,
  ArrowUp,
  Compass,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  uploadGuideLogoAction,
  createGuideAction,
  updateGuideAction,
  deleteGuideAction,
  reorderGuidesAction,
  type GuideInput,
} from "@/lib/guias/actions"
import type { GuideRow } from "@/lib/guias/queries"
import {
  GUIDE_LINK_ICONS,
  MAX_GUIDE_LINKS,
  isGuideLinkIcon,
  type GuideLinkIcon,
} from "@/lib/guias/types"
import { GUIDE_LINK_ICON_COMPONENTS } from "@/lib/guias/icons"

type Props = {
  initialGuides: GuideRow[]
}

type LinkDraft = {
  label: string
  url: string
  icon: GuideLinkIcon
}

function toIcon(value: string): GuideLinkIcon {
  return isGuideLinkIcon(value) ? value : "web"
}

export function AdminGuidesPanel({ initialGuides }: Props) {
  const t = useTranslations("Panel.guides")
  const router = useRouter()
  const [guides, setGuides] = useState<GuideRow[]>(initialGuides)
  const [createOpen, setCreateOpen] = useState(false)
  const [editGuide, setEditGuide] = useState<GuideRow | null>(null)
  const [deleteGuide, setDeleteGuide] = useState<GuideRow | null>(null)
  const [isReordering, setIsReordering] = useState(false)

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= guides.length || isReordering) return

    const previous = guides
    const next = [...guides]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setGuides(next)
    setIsReordering(true)

    const result = await reorderGuidesAction(next.map((g) => g.id))
    setIsReordering(false)
    if (!result.ok) {
      setGuides(previous)
      toast.error(t(`errors.${result.error}`))
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-forest text-white hover:bg-forest/90"
        >
          <Plus className="h-4 w-4" />
          {t("addGuide")}
        </Button>
      </div>

      {guides.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("noGuides")}
        </p>
      ) : (
        <div className="space-y-3">
          {guides.map((guide, index) => (
            <div
              key={guide.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige/40">
                  {guide.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={guide.logoUrl} alt="" className="h-full w-full object-contain p-1" />
                  ) : (
                    <Compass className="h-7 w-7 text-forest/50" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{guide.name}</p>
                  {guide.phone ? (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                      {guide.phone}
                    </p>
                  ) : null}
                  {guide.links.length > 0 ? (
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {guide.links.map((link) => {
                        const Icon = GUIDE_LINK_ICON_COMPONENTS[toIcon(link.icon)]
                        return (
                          <span
                            key={link.id}
                            className="inline-flex items-center gap-1 rounded-full bg-beige px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            <Icon className="h-3 w-3" />
                            {link.label}
                          </span>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="ml-auto flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || isReordering}
                  aria-label={t("moveUp")}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => move(index, 1)}
                  disabled={index === guides.length - 1 || isReordering}
                  aria-label={t("moveDown")}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditGuide(guide)}
                  aria-label={t("editGuide")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteGuide(guide)}
                  aria-label={t("deleteGuide")}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <GuideFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => {
          setCreateOpen(false)
          router.refresh()
        }}
      />

      {editGuide && (
        <GuideFormDialog
          guide={editGuide}
          open={!!editGuide}
          onOpenChange={(open) => {
            if (!open) setEditGuide(null)
          }}
          onSaved={() => {
            setEditGuide(null)
            router.refresh()
          }}
        />
      )}

      {deleteGuide && (
        <DeleteGuideDialog
          guide={deleteGuide}
          open={!!deleteGuide}
          onOpenChange={(open) => {
            if (!open) setDeleteGuide(null)
          }}
          onDeleted={() => {
            setDeleteGuide(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

function GuideFormDialog({
  guide,
  open,
  onOpenChange,
  onSaved,
}: {
  guide?: GuideRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const t = useTranslations("Panel.guides")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [logoUrl, setLogoUrl] = useState(guide?.logoUrl ?? "")
  const [isUploading, setIsUploading] = useState(false)
  const [links, setLinks] = useState<LinkDraft[]>(
    guide
      ? guide.links.map((link) => ({
          label: link.label,
          url: link.url,
          icon: toIcon(link.icon),
        }))
      : [],
  )

  async function handleImageUpload(file: File) {
    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set("file", file)
      const result = await uploadGuideLogoAction(formData)
      if (!result.ok) {
        setError(result.message || t(`uploadErrors.${result.error}`))
        return
      }
      setLogoUrl(result.url)
    } finally {
      setIsUploading(false)
    }
  }

  function updateLink(index: number, patch: Partial<LinkDraft>) {
    setLinks((prev) => prev.map((link, i) => (i === index ? { ...link, ...patch } : link)))
  }

  function addLink() {
    setLinks((prev) =>
      prev.length >= MAX_GUIDE_LINKS ? prev : [...prev, { label: "", url: "", icon: "web" }],
    )
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index))
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const phone = String(form.get("phone") ?? "").trim()

    if (!name) return

    const cleanedLinks = links
      .filter((link) => link.label.trim() && link.url.trim())
      .map((link) => ({
        label: link.label.trim(),
        url: link.url.trim(),
        icon: link.icon,
      }))

    const input: GuideInput = {
      name,
      phone,
      logoUrl: logoUrl || null,
      links: cleanedLinks,
    }

    startTransition(async () => {
      const result = guide
        ? await updateGuideAction(guide.id, input)
        : await createGuideAction(input)

      if (!result.ok) {
        setError(t(`errors.${result.error}`))
        return
      }
      toast.success(guide ? t("updateSuccess") : t("createSuccess"))
      onSaved()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{guide ? t("editGuide") : t("addGuide")}</DialogTitle>
          <DialogDescription>{t("formDescription")}</DialogDescription>
        </DialogHeader>

        <form id="guide-form" onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gd-name">{t("form.name")}</Label>
            <Input id="gd-name" name="name" defaultValue={guide?.name} required className="h-10" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gd-phone">{t("form.phone")}</Label>
            <Input
              id="gd-phone"
              name="phone"
              type="tel"
              defaultValue={guide?.phone ?? ""}
              required
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">{t("form.phoneHint")}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gd-logo">{t("form.logo")}</Label>
            <p className="text-xs text-muted-foreground">{t("form.logoHint")}</p>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-beige/40">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="" className="h-full w-full object-contain p-1" />
                ) : (
                  <Compass className="h-6 w-6 text-forest/40" />
                )}
              </div>
              <Input
                id="gd-logo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleImageUpload(file)
                }}
                className="h-10"
              />
              {isUploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>{t("form.linksTitle")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLink}
                disabled={links.length >= MAX_GUIDE_LINKS}
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("form.addLink")}
              </Button>
            </div>

            {links.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
                {t("form.noLinks")}
              </p>
            ) : (
              <div className="space-y-3">
                {links.map((link, index) => (
                  <div key={index} className="rounded-lg border border-border/60 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {t("form.linkLabel")} #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLink(index)}
                        aria-label={t("form.removeLink")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`gd-link-label-${index}`}>{t("form.linkLabel")}</Label>
                        <Input
                          id={`gd-link-label-${index}`}
                          value={link.label}
                          onChange={(e) => updateLink(index, { label: e.target.value })}
                          placeholder="Instagram"
                          className="h-9"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`gd-link-icon-${index}`}>{t("form.linkIcon")}</Label>
                        <Select
                          value={link.icon}
                          onValueChange={(v) => updateLink(index, { icon: v as GuideLinkIcon })}
                        >
                          <SelectTrigger id={`gd-link-icon-${index}`} className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GUIDE_LINK_ICONS.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                {t(`icons.${icon}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label htmlFor={`gd-link-url-${index}`}>{t("form.linkUrl")}</Label>
                        <Input
                          id={`gd-link-url-${index}`}
                          value={link.url}
                          onChange={(e) => updateLink(index, { url: e.target.value })}
                          placeholder="https://…"
                          inputMode="url"
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            form="guide-form"
            disabled={isPending || isUploading}
            className="bg-forest text-white hover:bg-forest/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteGuideDialog({
  guide,
  open,
  onOpenChange,
  onDeleted,
}: {
  guide: GuideRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}) {
  const t = useTranslations("Panel.guides")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteGuideAction(guide.id)
      if (!result.ok) {
        setError(t(`errors.${result.error}`))
        return
      }
      toast.success(t("deleteSuccess"))
      onDeleted()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteGuide")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteConfirm", { name: guide.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("cancel")}</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
            className="text-white"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("deleteConfirmAction")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}