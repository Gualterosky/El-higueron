import { RoutePageLayout } from "@/components/muro/route-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function RouteMBS09Page({ params }: Props) {
  const { locale } = await params
  return <RoutePageLayout routeId="MBS09" locale={locale} />
}
