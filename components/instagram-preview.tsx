"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BadgeCheck,
  Copy,
  Download,
  Check,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  extractGoogleDriveId,
  getGoogleDriveDownloadPath,
  getGoogleDrivePreviewUrl,
  isGoogleDriveUrl,
} from "@/lib/google-drive"

export type MediaItem = {
  type: "image" | "video"
  src: string
  alt?: string
  poster?: string
  downloadName?: string
}

export type PostConfig = {
  date: string
  profile: {
    username: string
    avatar?: string
    verified?: boolean
  }
  location?: string
  media: MediaItem[]
  caption: string
  likes?: number
  aspectRatio?: "square" | "portrait" | "9:16" | "landscape"
}

// ─── Parser de hashtags y menciones ──────────────────────────
function renderCaption(text: string) {
  const parts = text.split(/([@#][\w\u00C0-\u024F]+)/g)
  return parts.map((part, i) =>
    /^[#@]/.test(part)
      ? <span key={i} className="text-blue-500">{part}</span>
      : part
  )
}

// ─── Tarjeta individual ───────────────────────────────────────
function PostCard({ config, index }: { config: PostConfig; index: number }) {
  const [slide, setSlide] = useState(0)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  const { profile, media, caption, location, date, likes = 0, aspectRatio = "square" } = config
  const isCarousel = media.length > 1
  const ratioClass = aspectRatio === "portrait" ? "aspect-[4/5]" : aspectRatio === "9:16" ? "aspect-[9/16]" : aspectRatio === "landscape" ? "aspect-[1.91/1]" : "aspect-square"
  const current = media[slide]
  const initials = profile.username.slice(0, 2).toUpperCase()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* silencioso */
    }
  }

  const downloadFile = async (src: string, name: string) => {
    try {
      const res = await fetch(src)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(src, "_blank")
    }
  }

  const handleSingleDownload = (item: MediaItem, i: number) => {
    const driveId = extractGoogleDriveId(item.src)
    const downloadSrc = driveId
      ? getGoogleDriveDownloadPath(driveId, item.downloadName)
      : item.src
    const originalName =
      item.downloadName ?? item.src.split("/").pop()?.split("?")[0] ?? `archivo-${i + 1}`
    downloadFile(downloadSrc, `pub${index + 1}-${originalName}`)
  }

  const driveVideoId =
    current?.type === "video" && isGoogleDriveUrl(current.src)
      ? extractGoogleDriveId(current.src)
      : null

  return (
    <div>
      {/* Etiqueta y fecha */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
          Publicación {index + 1}
        </span>
        <div className="inline-flex items-center bg-white rounded-full px-3.5 py-1 shadow-sm border border-neutral-200">
          <span className="text-[12px] font-semibold text-neutral-700">📅 {date}</span>
        </div>
      </div>

      {/* Tarjeta de Instagram */}
      <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 overflow-hidden">

        {/* Cabecera del post */}
        <div className="flex items-center justify-between px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 flex-shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <div className="rounded-full overflow-hidden w-full h-full bg-white p-[1.5px]">
                {profile.avatar ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={profile.avatar}
                      alt={profile.username}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold leading-none">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-semibold leading-tight">
                  {profile.username}
                </span>
                {profile.verified && (
                  <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
                )}
              </div>
              {location && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  <MapPin className="h-2.5 w-2.5 text-neutral-400" />
                  <span className="text-[10px] text-neutral-500">{location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-[13px] font-semibold text-blue-500">Seguir</button>
            <MoreHorizontal className="h-5 w-5 text-neutral-700" />
          </div>
        </div>

        {/* Área de medios */}
        <div className={`relative ${ratioClass} bg-neutral-200 overflow-hidden select-none`}>
          {media.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-neutral-300 flex items-center justify-center">
                <ImageIcon className="h-7 w-7 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-400 font-medium">Contenido por agregar</p>
            </div>
          ) : current.type === "video" ? (
            driveVideoId ? (
              <iframe
                src={getGoogleDrivePreviewUrl(driveVideoId)}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Video"
              />
            ) : (
              <video
                src={current.src}
                poster={current.poster}
                className="w-full h-full object-cover"
                controls
                playsInline
                suppressHydrationWarning
              />
            )
          ) : (
            <Image
              src={current.src}
              alt={current.alt ?? "Post"}
              fill
              className="object-cover"
              unoptimized
            />
          )}

          {/* Controles del carrusel */}
          {isCarousel && media.length > 0 && (
            <>
              <div className="absolute top-3 right-3 bg-black/50 text-white text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                {slide + 1} / {media.length}
              </div>
              {slide > 0 && (
                <button
                  onClick={() => setSlide((s) => s - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md active:scale-95 transition-transform"
                >
                  <ChevronLeft className="h-4 w-4 text-neutral-800" />
                </button>
              )}
              {slide < media.length - 1 && (
                <button
                  onClick={() => setSlide((s) => s + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md active:scale-95 transition-transform"
                >
                  <ChevronRight className="h-4 w-4 text-neutral-800" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Barra de acciones */}
        <div className="px-3.5 pt-3 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setLiked((l) => !l)} className="active:scale-125 transition-transform">
                <Heart
                  className={cn(
                    "h-[26px] w-[26px] transition-colors duration-150",
                    liked ? "fill-red-500 text-red-500" : "text-neutral-800"
                  )}
                />
              </button>
              <button className="active:scale-110 transition-transform">
                <MessageCircle className="h-[26px] w-[26px] text-neutral-800" />
              </button>
              <button className="active:scale-110 transition-transform">
                <Send
                  className="h-[26px] w-[26px] text-neutral-800"
                  style={{ transform: "rotate(-20deg)" }}
                />
              </button>
            </div>

            {/* Puntos del carrusel */}
            {isCarousel && media.length > 0 && (
              <div className="flex items-center gap-1">
                {media.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      i === slide ? "bg-blue-500 w-2 h-2" : "bg-neutral-300 w-1.5 h-1.5"
                    )}
                  />
                ))}
              </div>
            )}

            <button onClick={() => setSaved((s) => !s)} className="active:scale-110 transition-transform">
              <Bookmark
                className={cn(
                  "h-[26px] w-[26px] transition-colors duration-150",
                  saved ? "fill-neutral-800 text-neutral-800" : "text-neutral-800"
                )}
              />
            </button>
          </div>
        </div>

        {/* Me gusta y descripción */}
        <div className="px-3.5 pb-5 pt-1.5">
          {likes > 0 && (
            <p className="text-[13px] font-semibold mb-1.5">
              {likes.toLocaleString("es-CO")} Me gusta
            </p>
          )}
          {caption ? (
            <p className="text-[13px] leading-snug text-neutral-800 whitespace-pre-line">
              <span className="font-semibold mr-1">{profile.username}</span>
              {renderCaption(caption)}
            </p>
          ) : (
            <p className="text-[13px] text-neutral-400 italic">Descripción por agregar…</p>
          )}
          <p className="text-[11px] text-neutral-400 mt-2 uppercase tracking-wide">Hace 2 horas</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-4 space-y-2.5">
        <Button
          onClick={handleCopy}
          disabled={!caption}
          variant="outline"
          size="lg"
          className="w-full gap-2.5 border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-xl h-12 disabled:opacity-40"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500 shrink-0" />
          ) : (
            <Copy className="h-4 w-4 shrink-0" />
          )}
          {copied ? "¡Descripción copiada!" : "Copiar descripción"}
        </Button>

        {media.length === 0 ? (
          <Button disabled size="lg" className="w-full gap-2.5 bg-neutral-900 text-white rounded-xl h-12 opacity-40">
            <Download className="h-4 w-4 shrink-0" />
            Sin archivos
          </Button>
        ) : media.length === 1 ? (
          <Button
            onClick={() => handleSingleDownload(media[0], 0)}
            size="lg"
            className="w-full gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-12"
          >
            <Download className="h-4 w-4 shrink-0" />
            {media[0].type === "video" ? "Descargar video" : "Descargar imagen"}
          </Button>
        ) : (
          <div>
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest mb-2">
              Descargar archivos
            </p>
            <div className="grid grid-cols-3 gap-2">
              {media.map((item, i) => (
                <Button
                  key={i}
                  onClick={() => handleSingleDownload(item, i)}
                  size="sm"
                  className="gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl"
                >
                  <Download className="h-3.5 w-3.5 shrink-0" />
                  {item.type === "video" ? "Video" : `Foto ${i + 1}`}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Página completa ──────────────────────────────────────────
export default function InstagramPreview({ posts }: { posts: PostConfig[] }) {
  const username = posts[0]?.profile.username ?? "cuenta"

  return (
    <div className="min-h-screen bg-neutral-100 py-10 px-4">
      {/* Encabezado */}
      <div className="mx-auto max-w-sm mb-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 mb-1">
          Vista previa · {username}
        </p>
        <p className="text-[11px] text-neutral-400">
          {posts.length} publicación{posts.length !== 1 ? "es" : ""} programada{posts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Lista de posts */}
      <div className="mx-auto max-w-sm space-y-4">
        {posts.map((post, i) => (
          <div key={i}>
            {i > 0 && <div className="border-t border-dashed border-neutral-300 pt-10" />}
            <PostCard config={post} index={i} />
          </div>
        ))}
      </div>

      <p className="text-center text-[11px] text-neutral-400 mt-10">
        Vista previa para revisión · No publicar sin aprobación
      </p>
    </div>
  )
}
