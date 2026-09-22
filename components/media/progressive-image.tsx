"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useInViewport } from "@/hooks/use-in-viewport"
import { getNextImageProxyUrl } from "@/lib/media/next-image-url"

type Props = {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  /**
   * Ancho deseado para pedirle al Image Optimizer de Next (misma URL que
   * generaría un <Image>, pero pedida a mano con fetch() para poder medir el
   * progreso real de descarga). Como la URL queda en el propio dominio, no
   * hay problema de CORS aunque el archivo real viva en Cloudflare R2.
   * Si se omite, se hace fetch directo de `src` (caso Cloudinary, que ya
   * entrega un tamaño razonable y sí permite CORS cross-origin).
   */
  optimizeWidth?: number
  quality?: number
  /**
   * "fill" (por defecto): la imagen rellena su contenedor con position
   * absolute — el contenedor (el padre) debe tener `position: relative` y un
   * tamaño/aspect-ratio definido (igual que <Image fill>).
   * "natural": sin recorte, respeta el aspect ratio real de la imagen
   * (útil para una sola foto de un post, donde no se quiere forzar un
   * tamaño). Mientras descarga muestra un placeholder de altura fija
   * (`naturalPlaceholderClassName`) con el anillo de progreso.
   */
  mode?: "fill" | "natural"
  naturalPlaceholderClassName?: string
}

/**
 * Imagen "inteligente": solo descarga contenido cuando está cerca del
 * viewport (useInViewport) y libera la memoria cuando se desplaza lejos de
 * la vista (útil en grillas largas como la Galería). Mientras descarga,
 * muestra un anillo de progreso con el porcentaje real (bytes recibidos vs.
 * Content-Length), no un spinner genérico. Si el fetch falla (red, CORS,
 * etc.) cae de forma silenciosa a un <img> normal con el src original.
 */
export function ProgressiveImage({
  src,
  alt,
  className,
  containerClassName,
  optimizeWidth,
  quality = 75,
  mode = "fill",
  naturalPlaceholderClassName,
}: Props) {
  const { ref, inView } = useInViewport<HTMLDivElement>()
  const [progress, setProgress] = useState(0)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!inView) {
      // Salió de la vista: libera la memoria de la imagen ya descargada.
      // Si el usuario vuelve a scrollear hasta aquí, se vuelve a pedir (el
      // navegador normalmente la sirve desde su caché HTTP, así que es
      // prácticamente instantáneo).
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      /* eslint-disable react-hooks/set-state-in-effect -- reset intencional al salir del viewport: descartar la imagen liberada */
      setObjectUrl(null)
      setProgress(0)
      setFailed(false)
      /* eslint-enable react-hooks/set-state-in-effect */
      return
    }

    const controller = new AbortController()
    const fetchUrl = optimizeWidth ? getNextImageProxyUrl(src, optimizeWidth, quality) : src

    async function load() {
      try {
        const response = await fetch(fetchUrl, { signal: controller.signal })
        if (!response.ok || !response.body) throw new Error("bad response")

        const total = Number(response.headers.get("content-length")) || 0
        const reader = response.body.getReader()
        const chunks: Uint8Array[] = []
        let received = 0
        let done = false

        while (!done) {
          const result = await reader.read()
          done = result.done
          if (result.value) {
            chunks.push(result.value)
            received += result.value.length
            if (total > 0) setProgress(Math.min(99, Math.round((received / total) * 100)))
          }
        }

        const blob = new Blob(chunks)
        const url = URL.createObjectURL(blob)
        objectUrlRef.current = url
        setProgress(100)
        setObjectUrl(url)
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setFailed(true)
        }
      }
    }

    load()

    return () => controller.abort()
  }, [inView, src, optimizeWidth, quality])

  const finalSrc = objectUrl ?? (failed ? src : null)

  if (mode === "natural") {
    return (
      <div ref={ref} className={containerClassName}>
        {finalSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={finalSrc}
            alt={alt}
            loading={failed ? "lazy" : undefined}
            className={cn("block max-h-[430px] max-w-full", className)}
            style={{ width: "auto", height: "auto" }}
          />
        ) : (
          <div
            className={cn(
              "flex h-64 w-full max-w-full items-center justify-center bg-stone-100",
              naturalPlaceholderClassName
            )}
          >
            {inView && <ProgressRing percentage={progress} />}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", containerClassName)}>
      {finalSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={finalSrc} alt={alt} className={cn("h-full w-full", className)} />
      ) : inView ? (
        <div className="flex h-full w-full items-center justify-center bg-stone-100">
          <ProgressRing percentage={progress} />
        </div>
      ) : (
        <div className="h-full w-full bg-stone-100" />
      )}
    </div>
  )
}

function ProgressRing({ percentage }: { percentage: number }) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24" cy="24" r={radius} fill="none" strokeWidth="4"
          className="stroke-stone-300"
        />
        <circle
          cx="24" cy="24" r={radius} fill="none" strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="stroke-forest transition-[stroke-dashoffset] duration-150"
        />
      </svg>
      <span className="absolute text-[11px] font-medium text-forest">{percentage}%</span>
    </div>
  )
}
