import { RoutePageLayout } from "@/components/muro/route-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function RouteMBS12Page({ params }: Props) {
  const { locale } = await params
  return <RoutePageLayout routeId="MBS12" locale={locale} />
}
