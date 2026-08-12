import { setRequestLocale } from "next-intl/server"
import { PanelShell } from "@/components/panel/panel-shell"
import { requireRole } from "@/lib/auth/session"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function StaffLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireRole(locale, ["staff", "administrador"])

  return (
    <PanelShell role={session.user.role === "administrador" ? "administrador" : "staff"} userName={session.user.name}>
      {children}
    </PanelShell>
  )
}
