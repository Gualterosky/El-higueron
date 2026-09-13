import { setRequestLocale } from "next-intl/server"
import { requireRole } from "@/lib/auth/session"
import { CuentaPublicacionesPanel } from "@/components/cuenta/cuenta-publicaciones-panel"
import { getMyPublications } from "@/lib/cuenta/queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CuentaPublicacionesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireRole(locale, ["visitante"])
  const publications = await getMyPublications(session.user.id)

  return <CuentaPublicacionesPanel publications={publications} />
}
