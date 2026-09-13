"use client"

import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { phoneNumberClient } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), phoneNumberClient()],
})

export const { signIn, signUp, signOut, useSession, changePassword } = authClient
