import { useEffect, useRef, useState } from "react"

/**
 * Observa un elemento y devuelve si está dentro (o cerca) del viewport.
 * A diferencia de un "lazy load una sola vez", sigue reportando cambios en
 * ambas direcciones: al entrar Y al salir del área observada, para que quien
 * lo use pueda "cerrar" (desmontar) contenido pesado cuando se desplaza lejos
 * de la vista y liberar memoria, no solo diferir la primera carga.
 *
 * `rootMargin` controla qué tan pronto se considera "cerca" (precarga antes
 * de que sea visible del todo) y qué tan lejos hay que scrollear para que se
 * considere "lejos" y se libere.
 */
export function useInViewport<T extends Element>(rootMargin = "600px 0px") {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
