import Image from "next/image"
import { MessageCircle, Mail, MapPin, Instagram, Facebook } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const whatsappNumber = "573172973537"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Contacto")
  const tCommon = await getTranslations("Common")

  const whatsappMessage = encodeURIComponent(t("whatsapp.prefill"))
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-forest">
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-forest md:text-4xl">
              {t("findUs.title")}
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              {t("findUs.subtitle")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Ubicación */}
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-beige">
                  <MapPin className="h-8 w-8 text-forest" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{t("location.title")}</h3>
                <p className="mb-1 text-muted-foreground">{t("location.line1")}</p>
                <p className="mb-6 text-muted-foreground">{t("location.line2")}</p>
                <Button asChild variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                  <a
                    href="https://maps.app.goo.gl/TDdgkTqjRL3mNb816"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("location.mapsCta")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card className="border-2 border-[#25D366] bg-[#25D366]/5 shadow-sm">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{t("whatsapp.title")}</h3>
                <p className="mb-6 text-muted-foreground">
                  {t("whatsapp.body")}
                </p>
                <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#20BD5A]">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t("whatsapp.cta")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Correo */}
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-beige">
                  <Mail className="h-8 w-8 text-forest" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{t("email.title")}</h3>
                <p className="mb-6 text-muted-foreground break-all">
                  kevinleonardogm01@gmail.com
                </p>
                <Button asChild variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                  <a href="mailto:kevinleonardogm01@gmail.com">
                    {t("email.cta")}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Redes Sociales */}
          <div className="mt-16 text-center">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              {t("social.title")}
            </h3>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-beige text-forest transition-colors hover:bg-forest hover:text-white"
                aria-label={tCommon("instagram")}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-beige text-forest transition-colors hover:bg-forest hover:text-white"
                aria-label={tCommon("facebook")}
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <Image
          src="/media/Naturaleza-paisajes/IMG_20250126_165116990_HDR.jpg"
          alt={t("banner.imageAlt")}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-lg font-medium text-white">
            {t("banner.text")}
          </p>
        </div>
      </section>
    </div>
  )
}
