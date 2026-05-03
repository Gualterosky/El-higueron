"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const galleryImages = [
  { src: "/media/Muro bendito sea/Img01.jpg", alt: "Escaladores en el muro Bendito Sea", category: "Escalada" },
  { src: "/placeholder.svg?height=800&width=600", alt: "Vista panorámica del sector", category: "Naturaleza" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Zona de camping al atardecer", category: "Camping" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Boulder en la mañana", category: "Boulder" },
  { src: "/media/Muro bendito sea/IMG_20250111_141453567_SR.jpg", alt: "Vista del muro desde el bosque", category: "Naturaleza" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Fogata nocturna", category: "Camping" },
  { src: "/media/Muro bendito sea/Img03.jpg", alt: "Escalador en ruta vertical", category: "Escalada" },
  { src: "/placeholder.svg?height=800&width=600", alt: "Amanecer en la montaña", category: "Naturaleza" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Problema de boulder", category: "Boulder" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Carpas bajo las estrellas", category: "Camping" },
  { src: "/media/Muro bendito sea/Img05.jpg", alt: "Escalador en ruta Bendito Sea 5.13a", category: "Escalada" },
  { src: "/media/Muro bendito sea/Img06.jpg", alt: "Escaladores en competencia", category: "Escalada" },
]

const categories = ["Todas", "Escalada", "Boulder", "Camping", "Naturaleza"]

export default function GaleriaPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages = selectedCategory === "Todas" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  
  const goToPrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1)
    }
  }
  
  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-forest">
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Galería
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Imágenes de la experiencia en Camping El Higuerón
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="border-b border-border bg-background py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category 
                    ? "bg-forest text-white hover:bg-forest-light" 
                    : "border-forest text-forest hover:bg-forest hover:text-white"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredImages.map((image, index) => (
              <div 
                key={index}
                className="group relative cursor-pointer overflow-hidden rounded-xl"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-[4/3]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-forest/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="p-4">
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {image.category}
                    </span>
                    <p className="mt-2 text-sm text-white">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
          
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div 
            className="relative max-h-[80vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            <div className="mt-4 text-center">
              <p className="text-white">{filteredImages[lightboxIndex].alt}</p>
              <span className="mt-1 inline-block text-sm text-white/70">
                {lightboxIndex + 1} / {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
