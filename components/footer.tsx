"use client"

import { Mountain, Instagram, Facebook, Mail, Phone } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export function Footer() {
  const t = useTranslations("Footer")
  const tCommon = useTranslations("Common")

  const quickLinks = [
    { href: "/" as const, label: t("links.inicio") },
    { href: "/el-lugar" as const, label: t("links.elLugar") },
    { href: "/escalada" as const, label: t("links.escalada") },
    { href: "/boulder" as const, label: t("links.boulder") },
    { href: "/camping" as const, label: t("links.camping") },
  ]

  const moreLinks = [
    { href: "/equipos" as const, label: t("links.equipos") },
    { href: "/visita" as const, label: t("links.visita") },
    { href: "/galeria" as const, label: t("links.galeria") },
    { href: "/contacto" as const, label: t("links.contacto") },
  ]

  return (
    <footer className="border-t border-border bg-forest text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Mountain className="h-8 w-8" />
              <span className="text-xl font-semibold">{t("brand")}</span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-primary-foreground/80">
              {t("tagline")}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20"
                aria-label={tCommon("instagram")}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20"
                aria-label={tCommon("facebook")}
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              {t("sections.quickLinks")}
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              {t("sections.moreInfo")}
            </h3>
            <ul className="flex flex-col gap-2">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              {t("sections.contact")}
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://wa.me/573172973537"
                  className="flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  <Phone className="h-4 w-4" />
                  <span>{t("whatsapp")}</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:kevinleonardogm01@gmail.com"
                  className="flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  <Mail className="h-4 w-4" />
                  <span>kevinleonardogm01@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
