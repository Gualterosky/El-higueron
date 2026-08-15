import { setRequestLocale } from "next-intl/server"
import { assertSectionVisible } from "@/lib/site-settings"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function GaleriaLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await assertSectionVisible("galeria", locale)
  return children
}
