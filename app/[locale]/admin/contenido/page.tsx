import { setRequestLocale } from "next-intl/server"
import { AdminContentPanel } from "@/components/admin/admin-content-panel"
import { getSiteSettings } from "@/lib/site-settings"
import { getAnnouncement } from "@/lib/announcement/queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminContentPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [settings, announcement] = await Promise.all([
    getSiteSettings(),
    getAnnouncement(),
  ])

  return (
    <AdminContentPanel
      initialMaintenance={settings.maintenanceMode}
      initialHidden={settings.hiddenSections}
      initialAnnouncement={announcement}
    />
  )
}
