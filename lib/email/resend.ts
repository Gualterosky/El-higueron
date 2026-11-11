import { Resend } from "resend"

export const EMAIL_FROM = "El Higuerón <notificaciones@elhigueron.xyz>"

const DEFAULT_ADMIN_NOTIFICATION_EMAIL = "kevinleonardogm01@gmail.com"

let client: Resend | null = null

/** Lazy Resend client. Returns null when RESEND_API_KEY is not configured so
 *  local/dev environments without the key keep working (emails are skipped). */
export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  client ??= new Resend(apiKey)
  return client
}

/** Public origin used to build links inside emails (no trailing slash). */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "https://elhigueron.xyz"
  return url.replace(/\/+$/, "")
}

export function getAdminNotificationEmail(): string {
  return process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || DEFAULT_ADMIN_NOTIFICATION_EMAIL
}

export type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

/** Sends one email. Never throws: failures are logged and reported as `false`. */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput): Promise<boolean> {
  const resend = getResend()
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set; skipping email:", subject)
    return false
  }

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    })
    if (error) {
      console.error("[email] Resend rejected email:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("[email] sendEmail failed:", error)
    return false
  }
}
