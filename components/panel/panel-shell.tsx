"use client"

import {
  BotMessageSquare,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Newspaper,
  PanelsTopLeft,
  Users,
} from "lucide-react"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import type { Role } from "@/lib/auth/roles"

type NavItem = {
  href: string
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
  roles: Role[]
}

const STAFF_ITEMS: NavItem[] = [
  {
    href: "/staff",
    labelKey: "dashboard",
    icon: LayoutDashboard,
    roles: ["staff", "administrador"],
  },
  {
    href: "/staff/resenas",
    labelKey: "reviews",
    icon: MessageSquareText,
    roles: ["staff", "administrador"],
  },
  {
    href: "/staff/reservas",
    labelKey: "reservations",
    icon: CalendarDays,
    roles: ["staff", "administrador"],
  },
  {
    href: "/staff/publicaciones",
    labelKey: "posts",
    icon: Newspaper,
    roles: ["staff", "administrador"],
  },
]

const ADMIN_ITEMS: NavItem[] = [
  {
    href: "/admin",
    labelKey: "dashboard",
    icon: LayoutDashboard,
    roles: ["administrador"],
  },
  {
    href: "/admin/usuarios",
    labelKey: "users",
    icon: Users,
    roles: ["administrador"],
  },
  {
    href: "/admin/resenas",
    labelKey: "reviews",
    icon: MessageSquareText,
    roles: ["administrador"],
  },
  {
    href: "/admin/reservas",
    labelKey: "reservations",
    icon: CalendarDays,
    roles: ["administrador"],
  },
  {
    href: "/admin/publicaciones",
    labelKey: "posts",
    icon: Newspaper,
    roles: ["administrador"],
  },
  {
    href: "/admin/contenido",
    labelKey: "content",
    icon: PanelsTopLeft,
    roles: ["administrador"],
  },
  {
    href: "/admin/chatbot",
    labelKey: "chatbot",
    icon: BotMessageSquare,
    roles: ["administrador"],
  },
]

type PanelTranslations = {
  title: string
  signOut: string
  nav: Record<string, string>
}

export function PanelShell({
  role,
  userName,
  children,
  translations,
}: {
  role: Role
  userName: string
  children: React.ReactNode
  translations: PanelTranslations
}) {
  const pathname = usePathname()
  const router = useRouter()
  const items = role === "administrador" ? ADMIN_ITEMS : STAFF_ITEMS
  const title = translations.title

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-beige/40">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 rounded-2xl border border-border/60 bg-white p-5 lg:w-64">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              El Higuerón
            </p>
            <h1 className="mt-1 text-lg font-semibold text-forest">{title}</h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">{userName}</p>
          </div>

          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon
              const active =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  item.href !== "/staff" &&
                  pathname.startsWith(item.href))
              return (
                <Link
                  key={`${item.href}-${item.labelKey}`}
                  href={item.href as "/admin" | "/staff" | "/cuenta"}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-forest text-white"
                      : "text-muted-foreground hover:bg-beige hover:text-forest",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {translations.nav[item.labelKey]}
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
              {translations.signOut}
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
