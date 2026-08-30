import { setRequestLocale } from "next-intl/server"
import { StaffContenidoPanel } from "@/components/staff/staff-contenido-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function StaffContenidoPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <StaffContenidoPanel />
}
