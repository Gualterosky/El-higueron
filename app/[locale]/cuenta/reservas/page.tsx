import { setRequestLocale } from "next-intl/server"
import { requireRole } from "@/lib/auth/session"
import { CuentaReservasPanel } from "@/components/cuenta/cuenta-reservas-panel"
import { getMyReservations } from "@/lib/cuenta/queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CuentaReservasPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireRole(locale, ["visitante"])
  const reservations = await getMyReservations(session.user.id)

  return <CuentaReservasPanel reservations={reservations} />
}
