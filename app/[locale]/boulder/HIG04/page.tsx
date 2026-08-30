import { BoulderPageLayout } from "@/components/boulder/boulder-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function BoulderHIG04Page({ params }: Props) {
  const { locale } = await params
  return <BoulderPageLayout boulderId="HIG04" locale={locale} />
}
