"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Download, ZoomIn, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RouteGuideSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const t = useTranslations("Muro.guide")

  return (
    <>
      <section className="bg-beige py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <ZoomIn className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium uppercase tracking-wider text-forest">
                {t("eyebrow")}
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t("title")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="group relative overflow-hidden rounded-2xl shadow-md">
              <div
                className="relative aspect-[3/4] cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src="/media/Rutas bendito sea.png"
                  alt={t("imageAlt")}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-forest/0 transition-colors duration-300 group-hover:bg-forest/10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomIn className="h-6 w-6 text-forest" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-forest text-white hover:bg-forest/90"
                onClick={() => setLightboxOpen(true)}
              >
                <ZoomIn className="mr-2 h-5 w-5" />
                {t("fullscreen")}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-forest text-forest hover:bg-forest hover:text-white"
              >
                <a href="/media/Rutas bendito sea.png" download="Rutas-Bendito-Sea.png">
                  <Download className="mr-2 h-5 w-5" />
                  {t("download")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightboxOpen(false)}
            aria-label={t("close")}
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/media/Rutas bendito sea.png"
              alt={t("imageAlt")}
              width={900}
              height={1200}
              className="h-full max-h-[90vh] w-auto mx-auto rounded-xl object-contain shadow-2xl"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <Button
              asChild
              size="lg"
              className="bg-orange text-white hover:bg-orange/90 shadow-lg"
            >
              <a
                href="/media/Rutas bendito sea.png"
                download="Rutas-Bendito-Sea.png"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="mr-2 h-5 w-5" />
                {t("download")}
              </a>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
