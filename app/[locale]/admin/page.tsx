import { setRequestLocale } from "next-intl/server"
import { AdminHomePanel } from "@/components/admin/admin-home-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminHomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AdminHomePanel />
}
