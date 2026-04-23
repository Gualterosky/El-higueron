"use client"

import { useState } from "react"
import Image from "next/image"
import { MessageCircle, Mail, Instagram, Facebook, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

export default function ContactoPage() {
  const [formState, setFormState] = useState({
    name: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormState({ name: "", message: "" })
  }

  const whatsappNumber = "573172973537"
  const whatsappMessage = encodeURIComponent("Hola, me gustaría obtener información sobre Camping El Higuerón")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-forest">
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Contacto
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Estamos aquí para ayudarte a planificar tu visita
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* WhatsApp Primary */}
            <div>
              <div className="mb-8">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Escríbenos
                </h2>
                <p className="text-lg text-muted-foreground">
                  La forma más rápida de contactarnos es a través de WhatsApp. Te responderemos lo antes posible.
                </p>
              </div>

              {/* WhatsApp Card */}
              <Card className="mb-8 border-2 border-[#25D366] bg-[#25D366]/5">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">WhatsApp</h3>
                  <p className="mb-6 text-muted-foreground">
                    Respuesta rápida y directa
                  </p>
                  <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#20BD5A]">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contactar por WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Social Media */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Síguenos en redes
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-beige text-forest transition-colors hover:bg-forest hover:text-white"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-beige text-forest transition-colors hover:bg-forest hover:text-white"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:info@campingelhigueron.com"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-beige text-forest transition-colors hover:bg-forest hover:text-white"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-forest" />
                    Envíanos un mensaje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-foreground">
                        Mensaje enviado
                      </h3>
                      <p className="mb-6 text-muted-foreground">
                        Gracias por contactarnos. Te responderemos lo antes posible.
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-forest text-forest hover:bg-forest hover:text-white"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Enviar otro mensaje
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="name">Nombre</FieldLabel>
                          <Input
                            id="name"
                            placeholder="Tu nombre"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            required
                          />
                        </Field>
                        
                        <Field>
                          <FieldLabel htmlFor="message">Mensaje</FieldLabel>
                          <Textarea
                            id="message"
                            placeholder="Escribe tu mensaje o consulta..."
                            rows={5}
                            value={formState.message}
                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                            required
                          />
                        </Field>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-orange text-white hover:bg-orange/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                        </Button>
                      </FieldGroup>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <Image
          src="/placeholder.svg?height=600&width=1920"
          alt="Vista de Camping El Higuerón"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-lg font-medium text-white">
            Te esperamos en la montaña
          </p>
        </div>
      </section>
    </div>
  )
}
