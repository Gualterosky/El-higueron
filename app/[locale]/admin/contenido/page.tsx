import { setRequestLocale } from "next-intl/server"
import { AdminContentPanel } from "@/components/admin/admin-content-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminContentPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AdminContentPanel />
}
