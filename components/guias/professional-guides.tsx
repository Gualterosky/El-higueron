import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { Compass, MessageCircle } from "lucide-react"
import { formatWhatsappUrl, isGuideLinkIcon } from "@/lib/guias/types"
import { GUIDE_LINK_BUTTON_CLASSES, GUIDE_LINK_ICON_COMPONENTS } from "@/lib/guias/icons"
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
                className="group flex flex-col overflow-hidden rounded-3xl border border-forest/10 bg-white text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-orange/50 hover:shadow-2xl"
              >
                <div className="bg-gradient-to-b from-forest/15 via-forest/5 to-white px-5 pb-2 pt-5">
                  <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
                    {guide.logoUrl ? (
                      <Image
                        src={guide.logoUrl}
                        alt={guide.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-3"
                      />
                    ) : (
                      <Compass className="h-16 w-16 text-forest/50" />
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-4">
                <h3 className="text-xl font-bold text-forest">{guide.name}</h3>
                <span className="mb-6 mt-3 h-1 w-12 rounded-full bg-orange" />

                <div className="flex w-full flex-col gap-3">
                  {hasWhatsapp ? (
                    <a
                      href={formatWhatsappUrl(guide.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1ebe5a] hover:shadow-md"
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
                        className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow-md ${GUIDE_LINK_BUTTON_CLASSES[toIcon(link.icon)]}`}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </a>
                    )
                  })}
                </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}