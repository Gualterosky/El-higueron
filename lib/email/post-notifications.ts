import { normalizeEmail } from "@/lib/contacts/normalize"
import { getAdminNotificationEmail, sendEmail } from "./resend"

export type NotificationLocale = "es" | "en"

export type PostNotificationType = "muro" | "camping" | "boulder" | "equipos" | "comunidad"

export type PostNotificationInput = {
  type: PostNotificationType
  authorName: string
  contactInfo: string
  comment: string
  locale?: string
}

const SECTION_LABELS: Record<PostNotificationType, Record<NotificationLocale, string>> = {
  muro: { es: "Muro de escalada", en: "Climbing wall" },
  camping: { es: "Camping", en: "Camping" },
  boulder: { es: "Boulder", en: "Boulder" },
  equipos: { es: "Alquiler de equipos", en: "Equipment rental" },
  comunidad: { es: "Comunidad", en: "Community" },
}

const COPY = {
  es: {
    adminSubject: (section: string, author: string) => `Nueva publicación en ${section} de ${author}`,
    adminTitle: "Nueva publicación recibida",
    adminIntro: (section: string) => `Un visitante dejó un mensaje en la sección ${section}.`,
    author: "Autor",
    contact: "Contacto",
    message: "Mensaje",
    userSubject: "Recibimos tu publicación en El Higuerón",
    userTitle: (name: string) => `¡Gracias, ${name}!`,
    userIntro: (section: string) => `Recibimos tu publicación en la sección ${section}. Esta es una copia de lo que enviaste:`,
    footer: "El Higuerón · elhigueron.xyz",
  },
  en: {
    adminSubject: (section: string, author: string) => `New post in ${section} from ${author}`,
    adminTitle: "New post received",
    adminIntro: (section: string) => `A visitor left a message in the ${section} section.`,
    author: "Author",
    contact: "Contact",
    message: "Message",
    userSubject: "We received your post at El Higuerón",
    userTitle: (name: string) => `Thank you, ${name}!`,
    userIntro: (section: string) => `We received your post in the ${section} section. Here is a copy of what you sent:`,
    footer: "El Higuerón · elhigueron.xyz",
  },
} as const

function resolveLocale(locale?: string): NotificationLocale {
  return locale === "en" ? "en" : "es"
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function renderEmail(opts: {
  title: string
  intro: string
  rows: { label: string; value: string }[]
  footer: string
}): string {
  const rows = opts.rows
    .map(
      (row) =>
        `<tr><td style="padding:8px 0;vertical-align:top;color:#6b7280;font-size:13px;width:90px">${escapeHtml(row.label)}</td><td style="padding:8px 0;color:#111827;font-size:14px;white-space:pre-wrap">${escapeHtml(row.value)}</td></tr>`,
    )
    .join("")

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f1e8;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px">
<h1 style="margin:0 0 8px;font-size:20px;color:#1f4d3a">${escapeHtml(opts.title)}</h1>
<p style="margin:0 0 16px;font-size:14px;color:#374151">${escapeHtml(opts.intro)}</p>
<table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb">${rows}</table>
<p style="margin:24px 0 0;font-size:12px;color:#9ca3af">${escapeHtml(opts.footer)}</p>
</div></body></html>`
}

/**
 * Sends the "new post" emails: always one to the site admin and, when the
 * visitor's contact is a valid email, a copy to the visitor in their language.
 * Never throws — a mail failure must not block or revert the post submission.
 */
export async function sendPostCreatedNotifications(input: PostNotificationInput): Promise<void> {
  try {
    const locale = resolveLocale(input.locale)
    const copy = COPY[locale]
    const section = SECTION_LABELS[input.type][locale]
    const visitorEmail = normalizeEmail(input.contactInfo)

    const rows = [
      { label: copy.author, value: input.authorName },
      { label: copy.contact, value: input.contactInfo },
      { label: copy.message, value: input.comment },
    ]

    const jobs: Promise<boolean>[] = [
      sendEmail({
        to: getAdminNotificationEmail(),
        subject: copy.adminSubject(section, input.authorName),
        html: renderEmail({
          title: copy.adminTitle,
          intro: copy.adminIntro(section),
          rows,
          footer: copy.footer,
        }),
        ...(visitorEmail ? { replyTo: visitorEmail } : {}),
      }),
    ]

    if (visitorEmail) {
      jobs.push(
        sendEmail({
          to: visitorEmail,
          subject: copy.userSubject,
          html: renderEmail({
            title: copy.userTitle(input.authorName),
            intro: copy.userIntro(section),
            rows: [{ label: copy.message, value: input.comment }],
            footer: copy.footer,
          }),
        }),
      )
    }

    await Promise.allSettled(jobs)
  } catch (error) {
    console.error("[email] sendPostCreatedNotifications failed:", error)
  }
}
