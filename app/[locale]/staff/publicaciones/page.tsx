import { setRequestLocale } from "next-intl/server"
import { StaffPublicacionesPanel } from "@/components/staff/staff-publicaciones-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function StaffPostsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <StaffPublicacionesPanel />
}
