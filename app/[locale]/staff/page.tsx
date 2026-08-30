import { setRequestLocale } from "next-intl/server"
import { StaffHomePanel } from "@/components/staff/staff-home-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function StaffHomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <StaffHomePanel />
}
