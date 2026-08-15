import { setRequestLocale } from "next-intl/server"
import { AdminContentPanel } from "@/components/admin/admin-content-panel"
import { getSiteSettings } from "@/lib/site-settings"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminContentPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const settings = await getSiteSettings()

  return (
    <AdminContentPanel
      initialMaintenance={settings.maintenanceMode}
      initialHidden={settings.hiddenSections}
    />
  )
}
