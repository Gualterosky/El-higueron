import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { Compass, MessageCircle } from "lucide-react"
import { formatWhatsappUrl, isGuideLinkIcon } from "@/lib/guias/types"
import { GUIDE_LINK_ICON_COMPONENTS } from "@/lib/guias/icons"
import type { GuideRow } from "@/lib/guias/queries"

function toIcon(value: string) {
  return isGuideLinkIcon(value) ? value : "web"
}

export async function ProfessionalGuides({ guides }: { guides: GuideRow[] }) {
  const t = await getTranslations("Escalada.guides")

  if (guides.length === 0) return null

  return (
    <section id="guias-profesionales" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Compass className="h-5 w-5 text-forest" />
            <span className="text-sm font-medium uppercase tracking-wider text-forest">
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const hasWhatsapp = guide.phone.trim().length > 0

            return (
              <div
                key={guide.id}
                className="flex flex-col items-center rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
              >
                <div className="relative mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-beige/40">
                  {guide.logoUrl ? (
                    <Image
                      src={guide.logoUrl}
                      alt={guide.name}
                      fill
                      sizes="80px"
                      className="object-contain p-3"
                    />
                  ) : (
                    <Compass className="h-9 w-9 text-forest/50" />
                  )}
                </div>

                <h3 className="mb-6 text-xl font-semibold text-foreground">{guide.name}</h3>

                <div className="flex w-full flex-col gap-3">
                  {hasWhatsapp ? (
                    <a
                      href={formatWhatsappUrl(guide.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#25D366] text-sm font-medium text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t("whatsapp")}
                    </a>
                  ) : null}

                  {guide.links.map((link) => {
                    const Icon = GUIDE_LINK_ICON_COMPONENTS[toIcon(link.icon)]
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border text-sm font-medium text-foreground transition-colors hover:border-forest hover:bg-forest hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </a>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}