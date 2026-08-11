"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const navHrefs = [
  { href: "/escalada" as const, key: "escalada" as const },
  { href: "/camping" as const, key: "camping" as const },
  { href: "/equipos" as const, key: "equipos" as const },
  { href: "/visita" as const, key: "visita" as const },
  { href: "/galeria" as const, key: "galeria" as const },
  { href: "/contacto" as const, key: "contacto" as const },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations("Nav")
  const tMeta = useTranslations("Meta")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src="/media/Logo-verde.png"
            alt={tMeta("logoAlt")}
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="text-lg font-semibold text-forest">{t("brand")}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navHrefs.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-beige hover:text-forest",
                pathname === link.href ? "text-forest" : "text-muted-foreground"
              )}
            >
              {t(`links.${link.key}`)}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Button asChild className="bg-orange text-white hover:bg-orange/90">
            <Link href="/visita">{t("cta")}</Link>
          </Button>
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
            {navHrefs.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-beige",
                  pathname === link.href
                    ? "bg-beige text-forest"
                    : "text-muted-foreground"
                )}
              >
                {t(`links.${link.key}`)}
              </Link>
            ))}
            <div className="mt-4 border-t border-border/40 pt-4">
              <Button asChild className="w-full bg-orange text-white hover:bg-orange/90">
                <Link href="/visita" onClick={() => setIsOpen(false)}>
                  {t("cta")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
