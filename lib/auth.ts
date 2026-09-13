import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin, phoneNumber } from "better-auth/plugins"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

const baseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

/**
 * Better Auth instance.
 * Requires BETTER_AUTH_SECRET (+ DATABASE_URL) in every deployed environment.
 */
export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "https://elhigueron.xyz",
    "https://www.elhigueron.xyz",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    "http://localhost:3000",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    // Allows default seed password "Mbs2024"; forced change requires 8+ chars.
    minPasswordLength: 7,
  },
  user: {
    additionalFields: {
      role: {
        type: ["administrador", "staff", "visitante"],
        required: true,
        defaultValue: "visitante",
        input: false,
      },
      mustChangePassword: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: false,
      },
    },
  },
  plugins: [
    admin(),
    phoneNumber({
      // Verification/SMS provider is not configured yet. The plugin is enabled
      // so users can sign in with phone+password once their phone number is set.
      // TODO: replace this stub with a real SMS/WhatsApp provider.
      sendOTP: async ({ phoneNumber, code }) => {
        console.warn("[phoneNumber] OTP not sent (no provider configured):", { phoneNumber, code })
      },
      phoneNumberValidator: async (phoneNumber) => /^\+\d{7,15}$/.test(phoneNumber),
    }),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
