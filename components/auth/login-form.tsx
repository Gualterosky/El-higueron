"use client"

import { useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Lock, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { signIn } from "@/lib/auth-client"
import { homePathForRole, isRole } from "@/lib/auth/roles"
import { normalizeContact } from "@/lib/contacts/normalize"

export function LoginForm() {
  const t = useTranslations("Login")
  const locale = useLocale()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function navigateAfterAuth(path: string) {
    window.location.assign(`/${locale}${path}`)
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const identifier = String(form.get("identifier") ?? "").trim()
    const password = String(form.get("password") ?? "")

    const contact = normalizeContact(identifier)

    startTransition(async () => {
      let result
      if (contact?.kind === "email") {
        result = await signIn.email({
          email: contact.value,
          password,
        })
      } else if (contact?.kind === "phone") {
        result = await signIn.phoneNumber({
          phoneNumber: contact.value,
          password,
        })
      } else {
        setError(t("errors.invalid"))
        return
      }

      const { data, error: signInError } = result

      if (signInError || !data?.user) {
        setError(t("errors.invalid"))
        return
      }

      const user = data.user as {
        role?: string
        mustChangePassword?: boolean
      }

      if (user.mustChangePassword) {
        navigateAfterAuth("/cambiar-contrasena")
        return
      }

      const role = isRole(user.role) ? user.role : "visitante"
      navigateAfterAuth(homePathForRole(role))
    })
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="identifier" className="text-sm font-medium text-foreground">
          {t("identifier")}
        </Label>
        <Input
          id="identifier"
          name="identifier"
          type="text"
          placeholder={t("identifierPlaceholder")}
          autoComplete="username"
          required
          className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          {t("password")}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-1 h-10 w-full bg-forest text-white hover:bg-forest/90"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Lock className="mr-2 h-4 w-4" />
        )}
        {t("submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/registro" className="font-medium text-forest hover:underline">
          {t("registerLink")}
        </Link>
      </p>
    </form>
  )
}
