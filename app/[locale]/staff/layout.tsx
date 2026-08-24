import { getTranslations, setRequestLocale } from "next-intl/server"
import { PanelShell } from "@/components/panel/panel-shell"
import { requireRole } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function StaffLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [session, t] = await Promise.all([
    requireRole(locale, ["staff", "administrador"]),
    getTranslations("Panel"),
  ])

  const role = session.user.role === "administrador" ? "administrador" : "staff"
  const translations = {
    title: role === "administrador" ? t("adminTitle") : t("staffTitle"),
    signOut: t("signOut"),
    nav: {
      dashboard: t("nav.dashboard"),
      users: t("nav.users"),
      reviews: t("nav.reviews"),
      reservations: t("nav.reservations"),
      posts: t("nav.posts"),
      content: t("nav.content"),
    },
  }

  return (
    <PanelShell role={role} userName={session.user.name} translations={translations}>
      {children}
    </PanelShell>
  )
}
