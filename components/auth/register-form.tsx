"use client"

import { useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Loader2, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Link, useRouter } from "@/i18n/navigation"
import { signIn } from "@/lib/auth-client"
import { registerWithEmailOrPhone } from "@/lib/auth/actions"
import { homePathForRole, isRole } from "@/lib/auth/roles"

export function RegisterForm() {
  const t = useTranslations("Register")
  const locale = useLocale()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function navigateAfterAuth(path: string) {
    window.location.assign(`/${locale}${path}`)
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const identifier = String(form.get("identifier") ?? "").trim()
    const password = String(form.get("password") ?? "")
    const confirm = String(form.get("confirm") ?? "")

    if (password !== confirm) {
      setError(t("errors.mismatch"))
      return
    }

    if (password.length < 8) {
      setError(t("errors.tooShort"))
      return
    }

    startTransition(async () => {
      const registerResult = await registerWithEmailOrPhone({
        name,
        identifier,
        password,
      })

      if (!registerResult.ok) {
        setError(t(registerResult.error === "taken" ? "errors.taken" : "errors.failed"))
        return
      }

      const signInResult =
        registerResult.method === "email"
          ? await signIn.email({ email: registerResult.identifier, password })
          : await signIn.phoneNumber({ phoneNumber: registerResult.identifier, password })

      if (signInResult.error || !signInResult.data?.user) {
        setError(t("errors.failed"))
        return
      }

      const user = signInResult.data.user as {
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
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="identifier">{t("identifier")}</Label>
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
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm">{t("confirm")}</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
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
          <UserPlus className="mr-2 h-4 w-4" />
        )}
        {t("submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-forest hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </form>
  )
}
