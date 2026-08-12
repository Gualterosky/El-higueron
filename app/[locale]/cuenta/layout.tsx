import { setRequestLocale } from "next-intl/server"
import { requireRole } from "@/lib/auth/session"
import { CuentaShell } from "@/components/panel/cuenta-shell"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function CuentaLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireRole(locale, ["visitante"])

  return <CuentaShell userName={session.user.name}>{children}</CuentaShell>
}
