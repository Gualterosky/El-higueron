import { setRequestLocale } from "next-intl/server"
import { CuentaReservasPanel } from "@/components/cuenta/cuenta-reservas-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CuentaReservasPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CuentaReservasPanel />
}
