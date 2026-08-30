import { BoulderPageLayout } from "@/components/boulder/boulder-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function BoulderHIG03Page({ params }: Props) {
  const { locale } = await params
  return <BoulderPageLayout boulderId="HIG03" locale={locale} />
}
