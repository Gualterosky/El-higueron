import { setRequestLocale } from "next-intl/server"
import { AdminReservationsPanel } from "@/components/admin/admin-reservations-panel"
import { getAllReservations } from "@/lib/reservas/queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminReservationsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const reservations = await getAllReservations()

  return <AdminReservationsPanel reservations={reservations} />
}
