import Link from "next/link"
import { Mountain, Instagram, Facebook, Mail, Phone } from "lucide-react"

const quickLinks = [
  { href: "/", label: "Inicio" },
  { href: "/el-lugar", label: "El Lugar" },
  { href: "/escalada", label: "Escalada" },
  { href: "/boulder", label: "Boulder" },
  { href: "/camping", label: "Camping" },
]

const moreLinks = [
  { href: "/equipos", label: "Equipos" },
  { href: "/visita", label: "Visita" },
  { href: "/galeria", label: "Galería" },
  { href: "/contacto", label: "Contacto" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-forest text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Mountain className="h-8 w-8" />
              <span className="text-xl font-semibold">El Higuerón</span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-primary-foreground/80">
              Un espacio natural para la escalada, el boulder y el camping en el corazón del bosque alto andino colombiano.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Enlaces Rápidos
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

          {/* More Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Más Información
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

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://wa.me/573001234567"
                  className="flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  <Phone className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@campingelhigueron.com"
                  className="flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  <Mail className="h-4 w-4" />
                  <span>info@campingelhigueron.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Camping El Higuerón. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
