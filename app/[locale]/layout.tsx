import type { Metadata } from "next"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import { LayoutShell } from "@/components/layout-shell"
import { routing } from "@/i18n/routing"
import { getSiteSettings } from "@/lib/site-settings"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Meta" })

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      locale: locale === "en" ? "en_US" : "es_CO",
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const [messages, settings] = await Promise.all([
    getMessages(),
    getSiteSettings(),
  ])

  return (
    <html lang={locale} className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <LayoutShell
              maintenanceMode={settings.maintenanceMode}
              hiddenSections={settings.hiddenSections}
            >
              {children}
            </LayoutShell>
          </div>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
