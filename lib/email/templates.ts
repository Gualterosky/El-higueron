/**
 * Pure email templates (no DB, no next-intl, no env): everything they need
 * arrives already resolved, so they can be rendered in a throwaway script to
 * preview the HTML. Label resolution lives in ./labels.ts, sending in
 * ./post-notifications.ts and ./reply-notifications.ts.
 */

export type EmailLocale = "es" | "en"

/** Which message the email delivers. Categories of muro/camping/boulder posts
 *  map 1:1; equipos is a "review"; comunidad is a "plan". */
export type PostEmailKind = "incident" | "review" | "tip" | "question" | "plan"

export type UrgencyKey = "low" | "medium" | "high" | "critical"

export type RenderedEmail = { subject: string; html: string }

export type PostEmailData = {
  locale: EmailLocale
  siteUrl: string
  kind: PostEmailKind
  /** Translated section name, e.g. "Muro de escalada". */
  sectionLabel: string
  /** Public section path, e.g. "/muro". */
  sectionPath: string
  /** Moderation panel path the admin button points to. */
  adminPath: string
  authorName: string
  contactInfo: string
  comment: string
  urgencyLevel?: UrgencyKey | null
  /** Translated urgency, e.g. "Crítica". */
  urgencyLabel?: string | null
  rating?: number | null
  /** Translated route/problem chips. */
  tags?: string[]
  mediaUrls?: string[] | null
  socialMediaUrl?: string | null
  /** Extra label/value rows (used by the community plan). */
  details?: { label: string; value: string }[]
}

export type ReplyEmailData = {
  locale: EmailLocale
  siteUrl: string
  sectionLabel: string
  sectionPath: string
  adminPath: string
  /** Null when the original post no longer exists. */
  original: { authorName: string; excerpt: string; categoryLabel?: string | null } | null
  replierName: string
  replierContact: string
  reply: string
}

const COLORS = {
  forest: "#1f4d3a",
  orange: "#e8731a",
  blue: "#2b6cb0",
  purple: "#6b46c1",
  urgency: { low: "#2f855a", medium: "#d69e2e", high: "#dd6b20", critical: "#c53030" } as Record<UrgencyKey, string>,
  incidentDefault: "#c53030",
}

const pick = <T>(locale: EmailLocale, es: T, en: T): T => (locale === "en" ? en : es)

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Only plain http(s) links are ever rendered as hrefs (blocks javascript:/data:). */
function safeUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed && /^https?:\/\//i.test(trimmed) ? trimmed : null
}

function stars(rating: number): string {
  const n = Math.max(0, Math.min(5, Math.round(rating)))
  return "★".repeat(n) + "☆".repeat(5 - n)
}

type Layout = {
  accent: string
  badge?: string
  title: string
  intro: string
  rows?: { label: string; value: string; html?: boolean }[]
  messageLabel?: string
  message?: string
  links?: { label: string; url: string }[]
  button?: { label: string; url: string }
  footer: string
}

function renderLayout(l: Layout): string {
  const rows = (l.rows ?? [])
    .map(
      (row) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#6b7280;font-size:13px;white-space:nowrap">${escapeHtml(row.label)}</td><td style="padding:6px 0;color:#111827;font-size:14px">${row.html ? row.value : escapeHtml(row.value)}</td></tr>`,
    )
    .join("")

  const message = l.message
    ? `<div style="margin:16px 0 0">
<p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280">${escapeHtml(l.messageLabel ?? "")}</p>
<div style="border-left:4px solid ${l.accent};background:#f9fafb;border-radius:4px;padding:12px 14px;font-size:14px;line-height:1.5;color:#111827;white-space:pre-wrap">${escapeHtml(l.message)}</div></div>`
    : ""

  const links = l.links?.length
    ? `<ul style="margin:16px 0 0;padding-left:18px;font-size:13px;line-height:1.7">${l.links
        .map((link) => `<li><a href="${escapeHtml(link.url)}" style="color:${l.accent}">${escapeHtml(link.label)}</a></li>`)
        .join("")}</ul>`
    : ""

  const button = l.button
    ? `<p style="margin:24px 0 0"><a href="${escapeHtml(l.button.url)}" style="display:inline-block;background:${l.accent};color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:10px 18px;border-radius:8px">${escapeHtml(l.button.label)}</a></p>`
    : ""

  const badge = l.badge
    ? `<span style="display:inline-block;background:rgba(255,255,255,.2);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:bold;letter-spacing:.04em">${escapeHtml(l.badge)}</span>`
    : ""

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f1e8;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
<div style="background:${l.accent};color:#ffffff;padding:20px 28px">${badge}<h1 style="margin:${badge ? "10px" : "0"} 0 0;font-size:20px;line-height:1.3">${escapeHtml(l.title)}</h1></div>
<div style="padding:24px 28px">
<p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#374151">${escapeHtml(l.intro)}</p>
${rows ? `<table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb">${rows}</table>` : ""}
${message}${links}${button}
<p style="margin:28px 0 0;font-size:12px;color:#9ca3af">${escapeHtml(l.footer)}</p>
</div></div></body></html>`
}

function footer(_locale: EmailLocale): string {
  return "El Higuerón · elhigueron.xyz"
}

function mediaLinks(data: Pick<PostEmailData, "locale" | "mediaUrls" | "socialMediaUrl">) {
  const links: { label: string; url: string }[] = []
  const social = safeUrl(data.socialMediaUrl)
  if (social) links.push({ label: pick(data.locale, "Enlace de redes sociales", "Social media link"), url: social })
  ;(data.mediaUrls ?? []).forEach((raw, i) => {
    const url = safeUrl(raw)
    if (url) links.push({ label: pick(data.locale, `Archivo adjunto ${i + 1}`, `Attachment ${i + 1}`), url })
  })
  return links
}

function accentFor(data: PostEmailData): string {
  switch (data.kind) {
    case "incident":
      return (data.urgencyLevel && COLORS.urgency[data.urgencyLevel]) || COLORS.incidentDefault
    case "review":
      return COLORS.forest
    case "tip":
      return COLORS.blue
    case "question":
      return COLORS.purple
    case "plan":
      return COLORS.orange
  }
}

/** Subjects are plain text: collapse any line breaks a visitor typed into a name. */
const oneLine = (value: string) => value.replace(/\s+/g, " ").trim()

function adminSubject(d: PostEmailData): string {
  const l = d.locale
  const author = oneLine(d.authorName)
  switch (d.kind) {
    case "incident": {
      const level = d.urgencyLabel ? ` · ${d.urgencyLabel}` : ""
      const urgent = d.urgencyLevel === "high" || d.urgencyLevel === "critical"
      return pick(
        l,
        `[${urgent ? "URGENTE" : "ALERTA"}${level}] Incidente reportado en ${d.sectionLabel}`,
        `[${urgent ? "URGENT" : "ALERT"}${level}] Incident reported in ${d.sectionLabel}`,
      )
    }
    case "review":
      return pick(l, `Nueva reseña en ${d.sectionLabel} de ${author}`, `New review in ${d.sectionLabel} from ${author}`)
    case "tip":
      return pick(l, `Nuevo tip técnico en ${d.sectionLabel}`, `New technical tip in ${d.sectionLabel}`)
    case "question":
      return pick(l, `Nueva pregunta en ${d.sectionLabel} de ${author}`, `New question in ${d.sectionLabel} from ${author}`)
    case "plan":
      return pick(l, `Nuevo plan publicado en Comunidad por ${author}`, `New community plan posted by ${author}`)
  }
}

function adminCopy(d: PostEmailData) {
  const l = d.locale
  switch (d.kind) {
    case "incident":
      return {
        title: pick(l, "Alerta de seguridad reportada", "Safety alert reported"),
        intro: pick(
          l,
          `Un visitante reportó un incidente en ${d.sectionLabel}. Revísalo cuanto antes.`,
          `A visitor reported an incident in ${d.sectionLabel}. Please review it as soon as possible.`,
        ),
        badge: pick(l, "ALERTA", "ALERT"),
      }
    case "review":
      return {
        title: pick(l, "Nueva reseña recibida", "New review received"),
        intro: pick(l, `Un visitante compartió su experiencia en ${d.sectionLabel}.`, `A visitor shared their experience in ${d.sectionLabel}.`),
        badge: undefined,
      }
    case "tip":
      return {
        title: pick(l, "Nuevo tip técnico", "New technical tip"),
        intro: pick(l, `Un visitante compartió un consejo en ${d.sectionLabel}.`, `A visitor shared a tip in ${d.sectionLabel}.`),
        badge: undefined,
      }
    case "question":
      return {
        title: pick(l, "Nueva pregunta de un visitante", "New visitor question"),
        intro: pick(
          l,
          `Un visitante hizo una pregunta en ${d.sectionLabel}. Puedes responderle escribiéndole directamente.`,
          `A visitor asked a question in ${d.sectionLabel}. You can answer by writing to them directly.`,
        ),
        badge: undefined,
      }
    case "plan":
      return {
        title: pick(l, "Nuevo plan en Comunidad", "New community plan"),
        intro: pick(l, "Un visitante publicó un plan para coordinar con otros.", "A visitor posted a plan to coordinate with others."),
        badge: undefined,
      }
  }
}

function visitorCopy(d: PostEmailData) {
  const l = d.locale
  const name = d.authorName
  switch (d.kind) {
    case "incident":
      return {
        subject: pick(l, "Recibimos tu reporte de seguridad", "We received your safety report"),
        title: pick(l, `Gracias por avisarnos, ${name}`, `Thanks for letting us know, ${name}`),
        intro: pick(
          l,
          "La seguridad es nuestra prioridad. El equipo de El Higuerón revisará tu reporte lo antes posible. Mientras tanto, extrema la precaución en la zona señalada. Esta es una copia de lo que enviaste:",
          "Safety is our priority. The El Higuerón team will review your report as soon as possible. In the meantime, please take extra care around the area you mentioned. Here is a copy of what you sent:",
        ),
        messageLabel: pick(l, "Tu reporte", "Your report"),
      }
    case "review":
      return {
        subject: pick(l, "Gracias por tu reseña en El Higuerón", "Thanks for your review at El Higuerón"),
        title: pick(l, `¡Gracias por compartir tu experiencia, ${name}!`, `Thanks for sharing your experience, ${name}!`),
        intro: pick(
          l,
          `Tu reseña en ${d.sectionLabel} ya fue recibida y ayuda a otros visitantes y a nosotros a mejorar. Esta es una copia:`,
          `Your review in ${d.sectionLabel} was received and helps other visitors and us improve. Here is a copy:`,
        ),
        messageLabel: pick(l, "Tu reseña", "Your review"),
      }
    case "tip":
      return {
        subject: pick(l, "Gracias por tu consejo en El Higuerón", "Thanks for your tip at El Higuerón"),
        title: pick(l, `¡Gran aporte, ${name}!`, `Great contribution, ${name}!`),
        intro: pick(
          l,
          `Tu consejo técnico en ${d.sectionLabel} puede ayudar a otros escaladores. Esta es una copia de lo que compartiste:`,
          `Your technical tip in ${d.sectionLabel} can help other climbers. Here is a copy of what you shared:`,
        ),
        messageLabel: pick(l, "Tu consejo", "Your tip"),
      }
    case "question":
      return {
        subject: pick(l, "Recibimos tu pregunta en El Higuerón", "We received your question at El Higuerón"),
        title: pick(l, `Recibimos tu pregunta, ${name}`, `We got your question, ${name}`),
        intro: pick(
          l,
          "La comunidad y el equipo de El Higuerón podrán responderte. Te avisaremos a este correo cuando alguien responda tu publicación. Esta es una copia:",
          "The community and the El Higuerón team can answer you. We will email you at this address when someone replies to your post. Here is a copy:",
        ),
        messageLabel: pick(l, "Tu pregunta", "Your question"),
      }
    case "plan":
      return {
        subject: pick(l, "Tu plan fue publicado en El Higuerón", "Your plan was posted at El Higuerón"),
        title: pick(l, `¡Tu plan ya está publicado, ${name}!`, `Your plan is live, ${name}!`),
        intro: pick(
          l,
          "Otros visitantes ya pueden verlo y contactarte para coordinar. Avisaremos a este correo si alguien responde. Esto es lo que publicaste:",
          "Other visitors can now see it and contact you to coordinate. We will email you if someone replies. Here is what you posted:",
        ),
        messageLabel: pick(l, "Notas", "Notes"),
      }
  }
}

function tagsRow(d: PostEmailData, label: string) {
  if (!d.tags?.length) return []
  return [{ label, value: d.tags.join(" · ") }]
}

function ratingRow(d: PostEmailData) {
  if (d.rating == null || d.rating < 1) return []
  return [
    {
      label: pick(d.locale, "Calificación", "Rating"),
      value: `<span style="color:${COLORS.orange};font-size:16px;letter-spacing:2px">${stars(d.rating)}</span> <span style="color:#6b7280">${d.rating}/5</span>`,
      html: true,
    },
  ]
}

export function buildPostEmails(d: PostEmailData): { admin: RenderedEmail; visitor: RenderedEmail } {
  const l = d.locale
  const accent = accentFor(d)
  const links = mediaLinks(d)
  const tagLabel = pick(l, "Ruta / zona", "Route / area")
  const urgencyRow =
    d.kind === "incident" && d.urgencyLabel
      ? [{ label: pick(l, "Urgencia", "Urgency"), value: d.urgencyLabel }]
      : []

  const admin = adminCopy(d)
  const adminHtml = renderLayout({
    accent,
    badge: admin.badge,
    title: admin.title,
    intro: admin.intro,
    rows: [
      { label: pick(l, "Autor", "Author"), value: d.authorName },
      { label: pick(l, "Contacto", "Contact"), value: d.contactInfo },
      ...urgencyRow,
      ...ratingRow(d),
      ...tagsRow(d, tagLabel),
      ...(d.details ?? []),
    ],
    messageLabel: d.kind === "plan" ? pick(l, "Notas", "Notes") : pick(l, "Mensaje", "Message"),
    message: d.comment,
    links,
    button: { label: pick(l, "Abrir panel de moderación", "Open moderation panel"), url: `${d.siteUrl}/${l}${d.adminPath}` },
    footer: footer(l),
  })

  const v = visitorCopy(d)
  const visitorHtml = renderLayout({
    accent,
    title: v.title,
    intro: v.intro,
    rows: [...urgencyRow, ...ratingRow(d), ...tagsRow(d, tagLabel), ...(d.details ?? [])],
    messageLabel: v.messageLabel,
    message: d.comment,
    links,
    button: { label: pick(l, `Ver ${d.sectionLabel}`, `View ${d.sectionLabel}`), url: `${d.siteUrl}/${l}${d.sectionPath}` },
    footer: footer(l),
  })

  return {
    admin: { subject: adminSubject(d), html: adminHtml },
    visitor: { subject: v.subject, html: visitorHtml },
  }
}

export function buildReplyEmails(d: ReplyEmailData): {
  admin: RenderedEmail
  postAuthor: RenderedEmail
  replier: RenderedEmail
} {
  const l = d.locale
  const sectionUrl = `${d.siteUrl}/${l}${d.sectionPath}`
  const original = d.original
  const originalRows = original
    ? [
        {
          label: pick(l, "Publicación de", "Post by"),
          value: original.categoryLabel ? `${original.authorName} (${original.categoryLabel})` : original.authorName,
        },
        { label: pick(l, "Texto original", "Original text"), value: original.excerpt },
      ]
    : []

  const admin = renderLayout({
    accent: COLORS.forest,
    title: pick(l, "Nueva respuesta recibida", "New reply received"),
    intro: pick(l, `Un visitante respondió a una publicación en ${d.sectionLabel}.`, `A visitor replied to a post in ${d.sectionLabel}.`),
    rows: [
      { label: pick(l, "Responde", "Replier"), value: d.replierName },
      { label: pick(l, "Contacto", "Contact"), value: d.replierContact },
      ...originalRows,
    ],
    messageLabel: pick(l, "Respuesta", "Reply"),
    message: d.reply,
    button: { label: pick(l, "Abrir panel de moderación", "Open moderation panel"), url: `${d.siteUrl}/${l}${d.adminPath}` },
    footer: footer(l),
  })

  const postAuthor = renderLayout({
    accent: COLORS.forest,
    title: pick(l, `${d.replierName} respondió a tu publicación`, `${d.replierName} replied to your post`),
    intro: pick(
      l,
      `Alguien de la comunidad respondió tu publicación en ${d.sectionLabel}:`,
      `Someone from the community replied to your post in ${d.sectionLabel}:`,
    ),
    rows: original ? [{ label: pick(l, "Tu publicación", "Your post"), value: original.excerpt }] : [],
    messageLabel: pick(l, `Respuesta de ${d.replierName}`, `Reply from ${d.replierName}`),
    message: d.reply,
    button: { label: pick(l, "Ver la conversación", "View the conversation"), url: sectionUrl },
    footer: footer(l),
  })

  const replier = renderLayout({
    accent: COLORS.forest,
    title: pick(l, `¡Gracias por responder, ${d.replierName}!`, `Thanks for replying, ${d.replierName}!`),
    intro: pick(
      l,
      `Recibimos tu respuesta en ${d.sectionLabel}. Esta es una copia de lo que enviaste:`,
      `We received your reply in ${d.sectionLabel}. Here is a copy of what you sent:`,
    ),
    rows: original ? [{ label: pick(l, "Publicación original", "Original post"), value: original.excerpt }] : [],
    messageLabel: pick(l, "Tu respuesta", "Your reply"),
    message: d.reply,
    button: { label: pick(l, "Ver la conversación", "View the conversation"), url: sectionUrl },
    footer: footer(l),
  })

  return {
    admin: {
      subject: pick(l, `Nueva respuesta en ${d.sectionLabel} de ${oneLine(d.replierName)}`, `New reply in ${d.sectionLabel} from ${oneLine(d.replierName)}`),
      html: admin,
    },
    postAuthor: {
      subject: pick(l, `${oneLine(d.replierName)} respondió a tu publicación en El Higuerón`, `${oneLine(d.replierName)} replied to your post at El Higuerón`),
      html: postAuthor,
    },
    replier: {
      subject: pick(l, "Recibimos tu respuesta en El Higuerón", "We received your reply at El Higuerón"),
      html: replier,
    },
  }
}
