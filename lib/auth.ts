import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
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
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
