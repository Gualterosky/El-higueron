"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/escalada", label: "Escalada" },
  { href: "/camping", label: "Camping" },
  { href: "/equipos", label: "Renta de equipos" },
  { href: "/visita", label: "Visita" },
  { href: "/galeria", label: "Galería" },
  { href: "/contacto", label: "Contacto" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src="/media/Logo.png"
            alt="El Higuerón - Camping y Escalada"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="text-lg font-semibold text-forest">El Higuerón</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-beige hover:text-forest",
                pathname === link.href
                  ? "text-forest"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button asChild className="bg-orange text-white hover:bg-orange/90">
            <Link href="/visita">Planifica tu visita</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-2 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-forest" />
          ) : (
            <Menu className="h-6 w-6 text-forest" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border/40 bg-background lg:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
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
                {link.label}
              </Link>
            ))}
            <div className="mt-4 border-t border-border/40 pt-4">
              <Button asChild className="w-full bg-orange text-white hover:bg-orange/90">
                <Link href="/visita" onClick={() => setIsOpen(false)}>
                  Planifica tu visita
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
