import { RoutePageLayout } from "@/components/muro/route-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function RouteMBS02Page({ params }: Props) {
  const { locale } = await params
  return <RoutePageLayout routeId="MBS02" locale={locale} />
}
