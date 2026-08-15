import type { Metadata } from "next"
import { TreePine } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ChangePasswordForm } from "@/components/auth/change-password-form"
import { requirePasswordChange } from "@/lib/auth/session"

type Props = {
  params: Promise<{ locale: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Meta" })

  return {
    title: t("changePasswordTitle"),
    robots: { index: false, follow: false },
  }
}

export default async function ChangePasswordPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await requirePasswordChange(locale)
  const t = await getTranslations("ChangePassword")

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-forest-light/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-forest-light/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm rounded-2xl bg-white/95 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 rounded-t-2xl bg-forest px-8 py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20">
            <TreePine className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-white/60">
              {t("brand")}
            </p>
            <h1 className="mt-0.5 text-xl font-bold text-white">{t("title")}</h1>
          </div>
        </div>

        <div className="px-8 py-8">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}
