import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Meta" })

  return {
    title: t("formTitle"),
    description: t("formDescription"),
  }
}

export default async function FormPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Form")

  return (
    <section className="min-h-screen bg-beige py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-md">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdZ5dywE09D_xcrcbpfr1GeKaozagYXcpr8tNywqrqJ_Aubig/viewform?embedded=true"
            width="100%"
            height="900"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title={t("iframeTitle")}
            className="block"
          >
            {t("loading")}
          </iframe>
        </div>
      </div>
    </section>
  )
}
