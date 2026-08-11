import { RoutePageLayout } from "@/components/muro/route-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function RouteMBS11Page({ params }: Props) {
  const { locale } = await params
  return <RoutePageLayout routeId="MBS11" locale={locale} />
}
