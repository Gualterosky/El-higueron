"use client"

import { useTranslations } from "next-intl"
import {
  CalendarDays,
  LogOut,
  Newspaper,
  UserRound,
} from "lucide-react"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"

const items = [
  { href: "/cuenta", labelKey: "profile", icon: UserRound },
  { href: "/cuenta/publicaciones", labelKey: "posts", icon: Newspaper },
  { href: "/cuenta/reservas", labelKey: "reservations", icon: CalendarDays },
] as const

export function CuentaShell({
  userName,
  children,
}: {
  userName: string
  children: React.ReactNode
}) {
  const t = useTranslations("Cuenta")
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-beige/40">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 rounded-2xl border border-border/60 bg-white p-5 lg:w-60">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              El Higuerón
            </p>
            <h1 className="mt-1 text-lg font-semibold text-forest">{t("title")}</h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">{userName}</p>
          </div>

          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon
              const active =
                pathname === item.href ||
                (item.href !== "/cuenta" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-forest text-white"
                      : "text-muted-foreground hover:bg-beige hover:text-forest",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(`nav.${item.labelKey}`)}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              {t("signOut")}
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link href="/">{t("backHome")}</Link>
            </Button>
          </div>
        </aside>

        <section className="min-w-0 flex-1 rounded-2xl border border-border/60 bg-white p-6 lg:p-8">
          {children}
        </section>
      </div>
    </div>
  )
}
