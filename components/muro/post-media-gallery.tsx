"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

function isVideo(url: string): boolean {
  return /\.(mp4|mov|avi|webm)(\?|$)/i.test(url) || url.includes("/video/upload/")
}

/**
 * Single media item.
 *
 * fixedHeight=false (default): item renders at its natural aspect ratio,
 * capped at max-h-[430px]. No cropping, no bars.
 *
 * fixedHeight=true: item fills a fixed-height container (needed for the
 * carousel so all slides have the same height). Uses object-contain so
 * content is never cropped; letterbox bars take the container background color.
 */
function MediaItem({ url, fixedHeight = false }: { url: string; fixedHeight?: boolean }) {
  const video = isVideo(url)

  if (fixedHeight) {
    return (
      <div
        className={cn(
          "flex h-80 items-center justify-center overflow-hidden rounded-lg",
          video ? "bg-black" : "bg-stone-100"
        )}
      >
        {video ? (
          <video src={url} controls className="h-full w-full object-contain" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-full w-full object-contain" />
        )}
      </div>
    )
  }

  // Natural-height mode: the CSS trick below lets the browser honour both
  // max-width:100% and max-height:430px simultaneously while preserving the
  // intrinsic aspect ratio (no cropping, no distortion).
  return (
    <div
      className={cn(
        "flex justify-center overflow-hidden rounded-lg",
        video ? "bg-black" : "bg-stone-100"
      )}
    >
      {video ? (
        <video
          src={url}
          controls
          className="block max-h-[430px] max-w-full"
          style={{ width: "auto", height: "auto" }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="block max-h-[430px] max-w-full"
          style={{ width: "auto", height: "auto" }}
        />
      )}
    </div>
  )
}

interface Props {
  mediaUrls: string[]
}

export function PostMediaGallery({ mediaUrls }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrent(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  if (mediaUrls.length === 0) return null

  // Single item: natural aspect ratio display
  if (mediaUrls.length === 1) {
    return <MediaItem url={mediaUrls[0]} />
  }

  // Multiple items: carousel with dots and arrow buttons
  return (
    <div className="mt-2 space-y-2">
      {/* Viewport */}
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden rounded-lg">
          <div className="flex">
            {mediaUrls.map((url, i) => (
              <div key={i} className="flex-none w-full">
                <MediaItem url={url} fixedHeight />
              </div>
            ))}
          </div>
        </div>

        {/* Arrow buttons – overlaid on the media, hidden when at the edge */}
        {current > 0 && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white backdrop-blur-sm transition-opacity hover:bg-black/70"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {current < mediaUrls.length - 1 && (
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white backdrop-blur-sm transition-opacity hover:bg-black/70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5">
        {mediaUrls.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir a elemento ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200",
              i === current
                ? "w-4 bg-forest"
                : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
            )}
          />
        ))}
      </div>
    </div>
  )
}
