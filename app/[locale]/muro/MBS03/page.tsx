import { RoutePageLayout } from "@/components/muro/route-page-layout"

type Props = { params: Promise<{ locale: string }> }

export default async function RouteMBS03Page({ params }: Props) {
  const { locale } = await params
  return <RoutePageLayout routeId="MBS03" locale={locale} />
}
