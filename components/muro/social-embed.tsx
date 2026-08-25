"use client"

import Script from "next/script"
import { ExternalLink } from "lucide-react"
import { useEffect } from "react"

export type SocialPlatform =
  | "youtube"
  | "vimeo"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "unknown"

export function detectPlatform(url: string): SocialPlatform {
  try {
    const { hostname } = new URL(url)
    if (hostname.includes("youtube") || hostname.includes("youtu.be")) return "youtube"
    if (hostname.includes("vimeo")) return "vimeo"
    if (hostname.includes("instagram")) return "instagram"
    if (hostname.includes("facebook") || hostname.includes("fb.watch")) return "facebook"
    if (hostname.includes("tiktok")) return "tiktok"
  } catch {}
  return "unknown"
}

function getYoutubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

function getTikTokVideoId(url: string): string | null {
  const m = url.match(/\/video\/(\d+)/)
  return m ? m[1] : null
}

type Props = { url: string; className?: string }

export function SocialEmbed({ url, className = "" }: Props) {
  const platform = detectPlatform(url)

  if (platform === "youtube") {
    const id = getYoutubeId(url)
    if (!id) return <FallbackLink url={url} />
    return (
      <div className={`aspect-video w-full overflow-hidden rounded-lg ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    )
  }

  if (platform === "vimeo") {
    const id = getVimeoId(url)
    if (!id) return <FallbackLink url={url} />
    return (
      <div className={`aspect-video w-full overflow-hidden rounded-lg ${className}`}>
        <iframe
          src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0`}
          title="Vimeo video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    )
  }

  if (platform === "facebook") {
    const encoded = encodeURIComponent(url)
    return (
      <div className={`overflow-hidden rounded-lg ${className}`}>
        <iframe
          src={`https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=560`}
          width="560"
          height="315"
          className="max-w-full border-0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  if (platform === "instagram") {
    return <InstagramEmbed url={url} className={className} />
  }

  if (platform === "tiktok") {
    const videoId = getTikTokVideoId(url)
    if (!videoId) return <FallbackLink url={url} />
    return <TikTokEmbed url={url} videoId={videoId} className={className} />
  }

  return <FallbackLink url={url} />
}

function InstagramEmbed({ url, className }: { url: string; className?: string }) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as { instgrm?: { Embeds: { process: () => void } } }).instgrm) {
      (window as { instgrm?: { Embeds: { process: () => void } } }).instgrm!.Embeds.process()
    }
  }, [url])

  return (
    <div className={className}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ maxWidth: "100%", minWidth: 0, border: "none" }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          Ver en Instagram
        </a>
      </blockquote>
      <Script
        src="//www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          const w = window as { instgrm?: { Embeds: { process: () => void } } }
          if (w.instgrm) w.instgrm.Embeds.process()
        }}
      />
    </div>
  )
}

function TikTokEmbed({
  url,
  videoId,
  className,
}: {
  url: string
  videoId: string
  className?: string
}) {
  return (
    <div className={className}>
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: "100%", minWidth: 0 }}
      >
        <section />
      </blockquote>
      <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
    </div>
  )
}

function FallbackLink({ url }: { url: string }) {
  let display = url
  try {
    display = new URL(url).hostname
  } catch {}
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
    >
      <ExternalLink className="h-4 w-4 shrink-0" />
      <span className="truncate">{display}</span>
    </a>
  )
}
