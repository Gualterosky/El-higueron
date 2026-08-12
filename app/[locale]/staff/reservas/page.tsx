import { getTranslations, setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function StaffReservationsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Panel.placeholders")

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold text-forest">{t("reservationsTitle")}</h2>
      <p className="text-muted-foreground">{t("reservationsBody")}</p>
    </div>
  )
}
