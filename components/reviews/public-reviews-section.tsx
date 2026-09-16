import { getTranslations } from "next-intl/server"
import { getPublicReviews } from "@/lib/reviews/aggregate"
import { PublicReviewsClient } from "@/components/reviews/public-reviews-client"

/** Home page section: aggregated reviews from the 4 review sources
 *  (muro, camping, boulder, equipos). Server-fetches approved/pending
 *  reviews (never "hidden", same rule as each source's public feed) and
 *  hands them to a client component for sorting/filtering. */
export async function PublicReviewsSection() {
  const [reviews, t] = await Promise.all([getPublicReviews(), getTranslations("Home.reviews")])

  if (reviews.length === 0) return null

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <section className="bg-beige py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-forest">
            {t("eyebrow")}
          </span>
          <h2 className="mt-2 mb-4 text-3xl font-bold text-forest md:text-4xl">{t("title")}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <PublicReviewsClient
          reviews={reviews.map((r) => ({
            id: r.id,
            source: r.source,
            rating: r.rating,
            comment: r.comment,
            authorName: r.authorName,
            createdAt: r.createdAt.toISOString(),
          }))}
          averageRating={averageRating}
        />
      </div>
    </section>
  )
}
