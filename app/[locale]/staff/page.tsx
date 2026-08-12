import { getTranslations, setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function StaffHomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Panel")

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold text-forest">{t("staffWelcome")}</h2>
      <p className="max-w-2xl text-muted-foreground">{t("staffDescription")}</p>
    </div>
  )
}
