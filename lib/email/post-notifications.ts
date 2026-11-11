import { normalizeEmail } from "@/lib/contacts/normalize"
import { normalizePostCategory, urgencyLevelSchema, type PostType } from "@/lib/posts/shared"
import {
  getBoulderProblemLabels,
  getCategoryLabel,
  getCommunityLabels,
  getMuroRouteLabels,
  getSectionInfo,
  getUrgencyLabel,
  resolveEmailLocale,
} from "./labels"
import { getAdminNotificationEmail, getSiteUrl, sendEmail } from "./resend"
import { buildPostEmails, type PostEmailData, type PostEmailKind } from "./templates"

export type PostNotificationInput = {
  type: PostType
  authorName: string
  contactInfo: string
  /** Post body (community plans: the optional notes). */
  comment: string
  locale?: string
  /** muro/camping/boulder only; equipos is always a review, comunidad a plan. */
  category?: string
  urgencyLevel?: string | null
  rating?: number | null
  routeIds?: string[] | null
  problemIds?: string[] | null
  mediaUrls?: string[] | null
  socialMediaUrl?: string | null
  plan?: {
    activity: string
    eventDate: string
    locationText?: string | null
    level?: string | null
    maxParticipants?: number | null
  }
}

function resolveKind(input: PostNotificationInput): PostEmailKind {
  if (input.type === "comunidad") return "plan"
  if (input.type === "equipos") return "review"
  return normalizePostCategory(input.category ?? "review")
}

/**
 * Sends the "new post" emails: always one to the site admin and, when the
 * visitor's contact is a valid email, a copy to the visitor. The message is
 * different per kind (incident / review / tip / question / community plan),
 * in the visitor's language. Never throws — a mail failure must not block or
 * revert the post submission.
 */
export async function sendPostCreatedNotifications(input: PostNotificationInput): Promise<void> {
  try {
    const locale = resolveEmailLocale(input.locale)
    const kind = resolveKind(input)
    const urgency = urgencyLevelSchema.safeParse(input.urgencyLevel)
    const urgencyLevel = kind === "incident" && urgency.success ? urgency.data : null

    const [urgencyLabel, tags, planLabels] = await Promise.all([
      urgencyLevel ? getUrgencyLabel(urgencyLevel, locale) : Promise.resolve(null),
      input.type === "muro"
        ? getMuroRouteLabels(input.routeIds, locale)
        : input.type === "boulder"
          ? getBoulderProblemLabels(input.problemIds, locale)
          : Promise.resolve([] as string[]),
      input.plan ? getCommunityLabels(input.plan.activity, input.plan.level, locale) : Promise.resolve(null),
    ])

    const details: PostEmailData["details"] = []
    if (input.plan && planLabels) {
      const isEn = locale === "en"
      details.push({ label: isEn ? "Activity" : "Actividad", value: planLabels.activity })
      details.push({ label: isEn ? "Date" : "Fecha", value: input.plan.eventDate })
      if (input.plan.locationText) details.push({ label: isEn ? "Place" : "Lugar", value: input.plan.locationText })
      if (planLabels.level) details.push({ label: isEn ? "Level" : "Nivel", value: planLabels.level })
      if (input.plan.maxParticipants) {
        details.push({ label: isEn ? "Max. people" : "Máx. personas", value: String(input.plan.maxParticipants) })
      }
    }

    const data: PostEmailData = {
      locale,
      siteUrl: getSiteUrl(),
      kind,
      ...getSectionInfo(input.type, locale),
      authorName: input.authorName,
      contactInfo: input.contactInfo,
      comment: input.comment,
      urgencyLevel,
      urgencyLabel,
      rating: kind === "review" ? input.rating : null,
      tags,
      mediaUrls: input.mediaUrls,
      socialMediaUrl: input.socialMediaUrl,
      details,
    }

    const emails = buildPostEmails(data)
    const visitorEmail = normalizeEmail(input.contactInfo)

    const jobs: Promise<boolean>[] = [
      sendEmail({
        to: getAdminNotificationEmail(),
        subject: emails.admin.subject,
        html: emails.admin.html,
        ...(visitorEmail ? { replyTo: visitorEmail } : {}),
      }),
    ]
    if (visitorEmail) {
      jobs.push(sendEmail({ to: visitorEmail, subject: emails.visitor.subject, html: emails.visitor.html }))
    }

    await Promise.allSettled(jobs)
  } catch (error) {
    console.error("[email] sendPostCreatedNotifications failed:", error)
  }
}
