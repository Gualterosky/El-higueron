import { setRequestLocale } from "next-intl/server"
import { CuentaPublicacionesPanel } from "@/components/cuenta/cuenta-publicaciones-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CuentaPublicacionesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CuentaPublicacionesPanel />
}
