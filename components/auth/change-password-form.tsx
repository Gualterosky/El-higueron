"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { KeyRound, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"
import { completeForcedPasswordChange } from "@/lib/auth/actions"

export function ChangePasswordForm() {
  const t = useTranslations("ChangePassword")
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const currentPassword = String(form.get("currentPassword") ?? "")
    const newPassword = String(form.get("newPassword") ?? "")
    const confirm = String(form.get("confirm") ?? "")

    if (newPassword !== confirm) {
      setError(t("errors.mismatch"))
      return
    }

    startTransition(async () => {
      const result = await completeForcedPasswordChange({
        currentPassword,
        newPassword,
      })

      if (!result.ok) {
        const key =
          result.error === "too_short"
            ? "tooShort"
            : result.error === "same_password"
              ? "samePassword"
              : result.error === "invalid_current"
                ? "invalidCurrent"
                : "failed"
        setError(t(`errors.${key}`))
        return
      }

      router.push(result.redirectTo)
      router.refresh()
    })
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <p className="text-sm text-muted-foreground">{t("description")}</p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="newPassword">{t("newPassword")}</Label>
        <Input
          id="newPassword"
          name="newPassword"
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
          <KeyRound className="mr-2 h-4 w-4" />
        )}
        {t("submit")}
      </Button>
    </form>
  )
}
