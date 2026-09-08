import { BoulderPageLayout } from "@/components/boulder/boulder-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function BoulderBLDR01Page({ params }: Props) {
  const { locale } = await params
  return <BoulderPageLayout boulderId="BLDR01" locale={locale} />
}
