import { setRequestLocale } from "next-intl/server"
import { AdminReviewsPanel } from "@/components/admin/admin-reviews-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminReviewsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AdminReviewsPanel />
}
