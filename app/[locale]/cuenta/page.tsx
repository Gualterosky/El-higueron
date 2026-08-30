import { setRequestLocale } from "next-intl/server"
import { getSession } from "@/lib/auth/session"
import { CuentaHomePanel } from "@/components/cuenta/cuenta-home-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CuentaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await getSession()

  return <CuentaHomePanel userName={session?.user.name ?? ""} />
}
