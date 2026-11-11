"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ChevronDown, Languages, LogIn, LogOut, Menu, UserRound, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSwitcher, useLocaleSwitch } from "@/components/language-switcher"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "@/lib/auth-client"
import { homePathForRole, isRole } from "@/lib/auth/roles"
import {
  CONTENT_SECTIONS,
  type ContentSection,
  type HiddenSections,
} from "@/lib/site-settings/types"
import { R2_BASE_URL } from "@/lib/media/r2-url"
import { LEGAL_INFO } from "@/lib/legal-info"

const navHrefs = [
  { href: "/escalada" as const, key: "escalada" as const },
  { href: "/camping" as const, key: "camping" as const },
  { href: "/comunidad" as const, key: "comunidad" as const },
  { href: "/equipos" as const, key: "equipos" as const },
  { href: "/visita" as const, key: "visita" as const },
  { href: "/galeria" as const, key: "galeria" as const },
  { href: "/contacto" as const, key: "contacto" as const },
]

function isHideableSection(key: string): key is ContentSection {
  return (CONTENT_SECTIONS as readonly string[]).includes(key)
}

const LOCALE_LABELS: Record<Locale, string> = { es: "Español", en: "English" }

function DesktopUserMenu({
  signedIn,
  accountHref,
  onSignOut,
}: {
  signedIn: boolean
  accountHref: ReturnType<typeof homePathForRole> | null
  onSignOut: () => void
}) {
  const t = useTranslations("Nav")
  const { locale, switchLocale } = useLocaleSwitch()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="gap-1.5 px-3"
          aria-label={t("aria.userMenu")}
        >
          <UserRound className="h-4 w-4" />
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Languages className="h-3.5 w-3.5" />
          {t("language")}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => switchLocale(value as Locale)}
        >
          {routing.locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              {LOCALE_LABELS[code]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        {signedIn && accountHref ? (
          <>
            <DropdownMenuItem asChild>
              <Link href={accountHref}>
                <UserRound />
                {t("account")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onSignOut}>
              <LogOut />
              {t("signOut")}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login">
              <LogIn />
              {t("login")}
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Navbar({
  hiddenSections,
}: {
  hiddenSections?: HiddenSections
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("Nav")
  const tMeta = useTranslations("Meta")
  const tLegal = useTranslations("Legal")
  const { data: session } = useSession()

  const role = isRole(session?.user?.role) ? session.user.role : null
  const accountHref = role ? homePathForRole(role) : null
  const visibleLinks = navHrefs.filter(
    (link) => !(isHideableSection(link.key) && hiddenSections?.[link.key]),
  )
  const showVisitaCta = !hiddenSections?.visita

  async function handleSignOut() {
    await signOut()
    setIsOpen(false)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src={`${R2_BASE_URL}/Logo-verde.png`}
            alt={tMeta("logoAlt")}
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="text-lg font-semibold text-forest">{t("brand")}</span>
          <span className="inline-flex rounded-full border border-forest/30 bg-beige/50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-forest lg:hidden xl:inline-flex">
            {tLegal("badge", { rnt: LEGAL_INFO.rnt })}
          </span>
        </Link>

        <div className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-beige hover:text-forest xl:px-3",
                pathname === link.href
                  ? "bg-beige text-forest"
                  : "text-muted-foreground",
              )}
            >
              {t(`links.${link.key}`)}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
          {showVisitaCta ? (
            <Button
              asChild
              className="hidden bg-orange text-white hover:bg-orange/90 xl:inline-flex"
            >
              <Link href="/visita">{t("cta")}</Link>
            </Button>
          ) : null}
          <DesktopUserMenu
            signedIn={Boolean(session?.user && accountHref)}
            accountHref={accountHref}
            onSignOut={handleSignOut}
          />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            className="rounded-md p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t("aria.closeMenu") : t("aria.openMenu")}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-forest" />
            ) : (
              <Menu className="h-6 w-6 text-forest" />
            )}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-border/40 bg-background lg:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-beige",
                  pathname === link.href
                    ? "bg-beige text-forest"
                    : "text-muted-foreground",
                )}
              >
                {t(`links.${link.key}`)}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
              {session?.user && accountHref ? (
                <>
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link href={accountHref} onClick={() => setIsOpen(false)}>
                      <UserRound className="h-4 w-4" />
                      {t("account")}
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {t("signOut")}
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" className="w-full gap-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    {t("login")}
                  </Link>
                </Button>
              )}
              {showVisitaCta ? (
                <Button asChild className="w-full bg-orange text-white hover:bg-orange/90">
                  <Link href="/visita" onClick={() => setIsOpen(false)}>
                    {t("cta")}
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
