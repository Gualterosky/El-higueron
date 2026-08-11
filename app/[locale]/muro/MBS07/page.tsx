import { RoutePageLayout } from "@/components/muro/route-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function RouteMBS07Page({ params }: Props) {
  const { locale } = await params
  return <RoutePageLayout routeId="MBS07" locale={locale} />
}
