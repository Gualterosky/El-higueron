import { AlertTriangle } from "lucide-react"
import { getTranslations } from "next-intl/server"

/** Franja que indica que la información del evento aún no es oficial. */
export async function EventoBorradorAviso() {
  const t = await getTranslations("Evento")

  return (
    <div className="bg-orange/15 border-b border-orange/30">
      <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-3 text-center lg:px-8">
        <AlertTriangle className="h-4 w-4 shrink-0 text-orange" />
        <p className="text-sm text-foreground">{t("draft.banner")}</p>
      </div>
    </div>
  )
}
