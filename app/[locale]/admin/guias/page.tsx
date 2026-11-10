import { setRequestLocale } from "next-intl/server"
import { AdminGuidesPanel } from "@/components/admin/admin-guides-panel"
import { getAllGuides } from "@/lib/guias/queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminGuidesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const guides = await getAllGuides()

  return <AdminGuidesPanel initialGuides={guides} />
}