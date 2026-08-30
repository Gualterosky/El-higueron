import { setRequestLocale } from "next-intl/server"
import { StaffReservasPanel } from "@/components/staff/staff-reservas-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function StaffReservationsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <StaffReservasPanel />
}
