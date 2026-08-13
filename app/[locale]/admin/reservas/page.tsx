import { setRequestLocale } from "next-intl/server"
import { AdminReservationsPanel } from "@/components/admin/admin-reservations-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminReservationsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AdminReservationsPanel />
}
