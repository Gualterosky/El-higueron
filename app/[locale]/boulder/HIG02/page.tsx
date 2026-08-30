import { BoulderPageLayout } from "@/components/boulder/boulder-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function BoulderHIG02Page({ params }: Props) {
  const { locale } = await params
  return <BoulderPageLayout boulderId="HIG02" locale={locale} />
}
