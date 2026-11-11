import { eq } from "drizzle-orm"
import { normalizeEmail } from "@/lib/contacts/normalize"
import { db } from "@/lib/db"
import { boulderPost, campingPost, climbPost, communityPost, equipmentPost } from "@/lib/db/schema"
import type { PostType } from "@/lib/posts/shared"
import { getCategoryLabel, getSectionInfo, resolveEmailLocale } from "./labels"
import { getAdminNotificationEmail, getSiteUrl, sendEmail } from "./resend"
import { buildReplyEmails, type EmailLocale, type ReplyEmailData } from "./templates"

export type ReplyNotificationInput = {
  postType: PostType
  postId: string
  authorName: string
  contactInfo: string
  comment: string
  locale?: string
}

type OriginalPost = {
  authorName: string
  contactInfo: string
  text: string
  category: string | null
}

const EXCERPT_LENGTH = 240

function excerpt(text: string): string {
  const clean = text.trim()
  return clean.length > EXCERPT_LENGTH ? `${clean.slice(0, EXCERPT_LENGTH).trimEnd()}…` : clean
}

/** Looks the replied-to post up in whichever table its family lives in. */
async function findOriginalPost(postType: PostType, postId: string): Promise<OriginalPost | null> {
  const pick = <T extends { authorName: string; contactInfo: string }>(
    rows: T[],
    text: (row: T) => string,
    category: (row: T) => string | null,
  ): OriginalPost | null => {
    const row = rows[0]
    return row ? { authorName: row.authorName, contactInfo: row.contactInfo, text: text(row), category: category(row) } : null
  }

  switch (postType) {
    case "muro":
      return pick(await db.select().from(climbPost).where(eq(climbPost.id, postId)).limit(1), (r) => r.comment, (r) => r.category)
    case "camping":
      return pick(await db.select().from(campingPost).where(eq(campingPost.id, postId)).limit(1), (r) => r.comment, (r) => r.category)
    case "boulder":
      return pick(await db.select().from(boulderPost).where(eq(boulderPost.id, postId)).limit(1), (r) => r.comment, (r) => r.category)
    case "equipos":
      return pick(await db.select().from(equipmentPost).where(eq(equipmentPost.id, postId)).limit(1), (r) => r.comment, () => null)
    case "comunidad":
      return pick(
        await db.select().from(communityPost).where(eq(communityPost.id, postId)).limit(1),
        (r) => r.notes || r.locationText || r.activity,
        () => null,
      )
  }
}

/**
 * Sends the "new reply" emails: the admin, the author of the original post
 * (only if their contact is an email; the replier's contact is never shared
 * with them) and a confirmation copy to the replier (if they left an email).
 * Never throws — a mail failure must not block or revert the reply.
 */
export async function sendReplyCreatedNotifications(input: ReplyNotificationInput): Promise<void> {
  try {
    const locale: EmailLocale = resolveEmailLocale(input.locale)
    const original = await findOriginalPost(input.postType, input.postId)
    const categoryLabel = original?.category ? await getCategoryLabel(original.category, locale) : null

    const data: ReplyEmailData = {
      locale,
      siteUrl: getSiteUrl(),
      ...getSectionInfo(input.postType, locale),
      original: original
        ? { authorName: original.authorName, excerpt: excerpt(original.text), categoryLabel }
        : null,
      replierName: input.authorName,
      replierContact: input.contactInfo,
      reply: input.comment,
    }

    const emails = buildReplyEmails(data)
    const replierEmail = normalizeEmail(input.contactInfo)
    const authorEmail = original ? normalizeEmail(original.contactInfo) : null

    const jobs: Promise<boolean>[] = [
      sendEmail({
        to: getAdminNotificationEmail(),
        subject: emails.admin.subject,
        html: emails.admin.html,
        ...(replierEmail ? { replyTo: replierEmail } : {}),
      }),
    ]
    if (authorEmail && authorEmail !== replierEmail) {
      jobs.push(sendEmail({ to: authorEmail, subject: emails.postAuthor.subject, html: emails.postAuthor.html }))
    }
    if (replierEmail) {
      jobs.push(sendEmail({ to: replierEmail, subject: emails.replier.subject, html: emails.replier.html }))
    }

    await Promise.allSettled(jobs)
  } catch (error) {
    console.error("[email] sendReplyCreatedNotifications failed:", error)
  }
}
