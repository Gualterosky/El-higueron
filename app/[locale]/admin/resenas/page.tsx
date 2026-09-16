import { setRequestLocale } from "next-intl/server"
import { AdminReviewsPanel } from "@/components/admin/admin-reviews-panel"
import { getAllReviewsUnified, getReviewStats } from "@/lib/reviews/aggregate"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminReviewsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [reviews, stats] = await Promise.all([getAllReviewsUnified(), getReviewStats()])

  return <AdminReviewsPanel initialReviews={reviews} stats={stats} />
}
