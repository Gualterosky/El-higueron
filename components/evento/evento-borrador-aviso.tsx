import { AlertTriangle } from "lucide-react"

/** Franja que indica que la información del evento aún no es oficial. */
export function EventoBorradorAviso() {
  return (
    <div className="bg-orange/15 border-b border-orange/30">
      <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-3 text-center lg:px-8">
        <AlertTriangle className="h-4 w-4 shrink-0 text-orange" />
        <p className="text-sm text-foreground">
          <span className="font-semibold">Vista previa:</span> la información de este evento es
          tentativa y aún no es oficial. Fechas, premios y precios pueden cambiar.
        </p>
      </div>
    </div>
  )
}
