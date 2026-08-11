import { RoutePageLayout } from "@/components/muro/route-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function RouteMBS10Page({ params }: Props) {
  const { locale } = await params
  return <RoutePageLayout routeId="MBS10" locale={locale} />
}
