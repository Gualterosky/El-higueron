import { getTranslations, setRequestLocale } from "next-intl/server"
import { getSession } from "@/lib/auth/session"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CuentaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Cuenta")
  const session = await getSession()

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold text-forest">
        {t("welcome", { name: session?.user.name ?? "" })}
      </h2>
      <p className="text-muted-foreground">{t("description")}</p>
    </div>
  )
}
