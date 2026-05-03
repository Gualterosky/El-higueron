"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const galleryImages = [
  // Escalada - Muro Bendito Sea
  { src: "/media/Muro bendito sea/Img01.jpg", alt: "Escaladores en el muro Bendito Sea", category: "Escalada" },
  { src: "/media/Muro bendito sea/Img03.jpg", alt: "Escalador en ruta vertical", category: "Escalada" },
  { src: "/media/Muro bendito sea/Img05.jpg", alt: "Escalador en ruta Bendito Sea 5.13a", category: "Escalada" },
  { src: "/media/Muro bendito sea/Img06.jpg", alt: "Escaladores en competencia", category: "Escalada" },
  { src: "/media/Muro bendito sea/Img11.jpg", alt: "Vista del muro principal", category: "Escalada" },
  { src: "/media/Muro bendito sea/Img12.jpg", alt: "Escalador en ruta técnica", category: "Escalada" },
  { src: "/media/Muro bendito sea/Img13.jpg", alt: "Vista panorámica del muro", category: "Escalada" },
  { src: "/media/Muro bendito sea/Img14.jpg", alt: "Escalador en desplome", category: "Escalada" },
  { src: "/media/Muro bendito sea/Img15.jpg", alt: "Sector de escalada", category: "Escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_102757.jpg", alt: "Escalada en roca natural", category: "Escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_103619.jpg", alt: "Escalador asegurando", category: "Escalada" },
  { src: "/media/Muro bendito sea/IMG_20250111_112116166_SR.jpg", alt: "Vista del muro al amanecer", category: "Escalada" },
  { src: "/media/Muro bendito sea/IMG_20250127_143630903_SR.jpg", alt: "Escaladores practicando", category: "Escalada" },
  { src: "/media/Muro bendito sea/IMG_20250322_174755948_HDR.jpg", alt: "Atardecer en el muro", category: "Escalada" },
  { src: "/media/Muro bendito sea/IMG_20251004_151608316_SR.jpg", alt: "Escalador en plomo", category: "Escalada" },
  
  // Boulder
  { src: "/media/Boulders/Img20.jpg", alt: "Problema de boulder", category: "Boulder" },
  { src: "/media/Boulders/Img21.jpg", alt: "Escalador en boulder", category: "Boulder" },
  { src: "/media/Boulders/Img22.jpg", alt: "Movimiento de boulder", category: "Boulder" },
  { src: "/media/Boulders/Img23.jpg", alt: "Boulder en la naturaleza", category: "Boulder" },
  { src: "/media/Boulders/Img24.jpg", alt: "Sesión de boulder", category: "Boulder" },
  { src: "/media/Boulders/Img25.jpg", alt: "Escalador en bloque", category: "Boulder" },
  { src: "/media/Boulders/Img26.jpg", alt: "Problema técnico de boulder", category: "Boulder" },
  { src: "/media/Boulders/Img27.jpg", alt: "Boulder al aire libre", category: "Boulder" },
  { src: "/media/Boulders/Img31.jpg", alt: "Vista zona de boulders", category: "Boulder" },
  { src: "/media/Boulders/IMG_20250225_134033932_HDR.jpg", alt: "Formaciones de boulder", category: "Boulder" },
  { src: "/media/Boulders/IMG_20250920_100954059_HDR.jpg", alt: "Boulder con crashpad", category: "Boulder" },
  { src: "/media/Boulders/IMG_20250920_162115607_MFNR.jpg", alt: "Atardecer en zona boulder", category: "Boulder" },
  { src: "/media/Boulders/IMG_20260430_120745606_HDR.jpg", alt: "Escalador en bloque natural", category: "Boulder" },
  
  // Camping
  { src: "/media/Camping/IMG_20240914_110259.jpg", alt: "Zona de camping", category: "Camping" },
  { src: "/media/Camping/IMG_20250129_074449185_HDR.jpg", alt: "Amanecer en el camping", category: "Camping" },
  { src: "/media/Camping/IMG_20250225_134602260_HDR.jpg", alt: "Carpas en el bosque", category: "Camping" },
  { src: "/media/Camping/IMG_20250225_134723182_MFNR.jpg", alt: "Área de camping", category: "Camping" },
  { src: "/media/Camping/IMG_20250225_134741147_HDR.jpg", alt: "Camping entre árboles", category: "Camping" },
  { src: "/media/Camping/IMG_20250225_134909280_HDR.jpg", alt: "Vista del camping", category: "Camping" },
  { src: "/media/Camping/IMG_20250225_135524468_HDR.jpg", alt: "Zona de descanso", category: "Camping" },
  { src: "/media/Camping/IMG_20250914_155323584_MFNR.jpg", alt: "Tarde en el camping", category: "Camping" },
  { src: "/media/Camping/IMG_20260116_132733975_MFNR.jpg", alt: "Paisaje desde el camping", category: "Camping" },
  { src: "/media/Camping/IMG_20260116_175452246_MFNR.jpg", alt: "Atardecer en el camping", category: "Camping" },
  { src: "/media/Camping/Img19.jpg", alt: "Camping con vista a la montaña", category: "Camping" },
  
  // Naturaleza
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162640140_HDR.jpg", alt: "Paisaje del bosque andino", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162645017_MFNR.jpg", alt: "Vegetación del páramo", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162948502_MFNR.jpg", alt: "Vista panorámica", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162950272_MFNR.jpg", alt: "Montañas de Choachí", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_163002929_MFNR.jpg", alt: "Bosque de niebla", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_163432836_HDR.jpg", alt: "Sendero en el bosque", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_165114112_HDR.jpg", alt: "Atardecer en la montaña", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250127_121755579_MFNR.jpg", alt: "Vista del valle", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_134919014_MFNR.jpg", alt: "Flora nativa", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_134946534_MFNR.jpg", alt: "Vegetación andina", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_135610722_HDR.jpg", alt: "Paisaje de montaña", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_140042979_HDR.jpg", alt: "Rocas y vegetación", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_140049571_HDR.jpg", alt: "Formaciones rocosas", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250121_174825464_HDR.jpg", alt: "Cielo al atardecer", category: "Naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250121_174834480_MFNR.jpg", alt: "Colores del atardecer", category: "Naturaleza" },
  { src: "/media/Muro bendito sea/IMG_20250111_141453567_SR.jpg", alt: "Vista del muro desde el bosque", category: "Naturaleza" },
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
