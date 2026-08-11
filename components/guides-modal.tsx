'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X, Instagram, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function GuidesModal() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('Escalada.guides')

  const guides = [
    {
      name: t('skalePeregrino.name'),
      instagram: 'https://www.instagram.com/skale_peregrino/',
      whatsapp: '+573217475413',
    },
  ]

  const formatWhatsappLink = (number: string) => {
    const cleaned = number.replace(/\D/g, '')
    return `https://wa.me/${cleaned}`
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="w-full bg-orange text-white hover:bg-orange/90"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        {t('cta')}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="border-b border-border px-6 py-6 sm:px-8">
              <h2 className="text-2xl font-bold text-foreground">{t('modalTitle')}</h2>
              <p className="mt-2 text-muted-foreground">
                {t('modalSubtitle')}
              </p>
            </div>

            {/* Guides Grid */}
            <div className="p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {guides.map((guide) => (
                  <div
                    key={guide.name}
                    className="flex flex-col items-center rounded-xl border border-border p-6 text-center"
                  >
                    <h3 className="mb-6 text-xl font-semibold text-foreground">{guide.name}</h3>

                    <div className="flex w-full flex-col gap-3">
                      <Button
                        asChild
                        variant="outline"
                        className="gap-2 border-[#E1306C] text-[#E1306C] hover:bg-[#E1306C] hover:text-white"
                      >
                        <a
                          href={guide.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="h-4 w-4" />
                          {t('instagram')}
                        </a>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        className="gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                      >
                        <a
                          href={formatWhatsappLink(guide.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {t('whatsapp')}
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-4 sm:px-8">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="w-full"
              >
                {t('close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
