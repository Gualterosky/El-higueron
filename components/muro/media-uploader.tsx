"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

const ALLOWED_IMAGE = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const ALLOWED_VIDEO = ["video/mp4", "video/quicktime"]
const ALLOWED_ALL = [...ALLOWED_IMAGE, ...ALLOWED_VIDEO]
const MAX_SIZE = 8 * 1024 * 1024
const MAX_IMAGES = 3
const MAX_VIDEOS = 1

type FileEntry = {
  id: string
  file: File
  previewUrl: string
  kind: "image" | "video"
  status: "uploading" | "done" | "error"
  cloudUrl?: string
}

type Props = {
  onUrlsChange: (urls: string[]) => void
}

export function MediaUploader({ onUrlsChange }: Props) {
  const t = useTranslations("MuroRoute")
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const onUrlsChangeRef = useRef(onUrlsChange)
  onUrlsChangeRef.current = onUrlsChange

  useEffect(() => {
    const urls = entries
      .filter((e) => e.status === "done" && e.cloudUrl)
      .map((e) => e.cloudUrl!)
    onUrlsChangeRef.current(urls)
  }, [entries])

  const imageCount = entries.filter((e) => e.kind === "image").length
  const videoCount = entries.filter((e) => e.kind === "video").length

  const uploadEntry = useCallback(async (entry: FileEntry) => {
    try {
      const fd = new FormData()
      fd.append("file", entry.file)
      fd.append("upload_preset", UPLOAD_PRESET!)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: "POST", body: fd }
      )
      if (!res.ok) throw new Error()

      const json = await res.json()
      const cloudUrl: string = json.secure_url

      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, status: "done", cloudUrl } : e))
      )
    } catch {
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, status: "error" } : e))
      )
    }
  }, [])

  const handleFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming)
      let imgs = imageCount
      let vids = videoCount
      const toAdd: FileEntry[] = []

      for (const file of arr) {
        if (!ALLOWED_ALL.includes(file.type)) continue
        if (file.size > MAX_SIZE) continue

        const isVideo = ALLOWED_VIDEO.includes(file.type)
        if (isVideo && vids >= MAX_VIDEOS) continue
        if (!isVideo && imgs >= MAX_IMAGES) continue

        if (isVideo) vids++
        else imgs++

        toAdd.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          kind: isVideo ? "video" : "image",
          status: "uploading",
        })
      }

      if (toAdd.length === 0) return
      setEntries((prev) => [...prev, ...toAdd])
      toAdd.forEach((e) => uploadEntry(e))
    },
    [imageCount, videoCount, uploadEntry]
  )

  const removeEntry = (id: string) => {
    setEntries((prev) => {
      const hit = prev.find((e) => e.id === id)
      if (hit) URL.revokeObjectURL(hit.previewUrl)
      return prev.filter((e) => e.id !== id)
    })
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        {t("ascentForm.uploadNotConfigured")}
      </p>
    )
  }

  const canAdd = imageCount < MAX_IMAGES || videoCount < MAX_VIDEOS

  return (
    <div className="space-y-3">
      {canAdd && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors select-none",
            dragOver
              ? "border-forest bg-forest/5"
              : "border-border hover:border-forest/50 hover:bg-muted/30"
          )}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("ascentForm.uploadDrop")}</p>
          <p className="text-xs text-muted-foreground/70">{t("ascentForm.uploadHint")}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ""
        }}
      />

      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              {entry.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={entry.previewUrl}
                  className="h-full w-full object-cover"
                  muted
                />
              )}

              {entry.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
              {entry.status === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-xs text-white">Error</span>
                </div>
              )}
              {entry.status === "done" && (
                <div className="absolute bottom-1 right-1 rounded-full bg-black/30 p-0.5">
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
              )}

              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-black/80"
                aria-label="Eliminar"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
