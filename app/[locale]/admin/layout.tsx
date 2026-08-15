import { setRequestLocale } from "next-intl/server"
import { PanelShell } from "@/components/panel/panel-shell"
import { requireRole } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireRole(locale, ["administrador"])

  return (
    <PanelShell role="administrador" userName={session.user.name}>
      {children}
    </PanelShell>
  )
}
