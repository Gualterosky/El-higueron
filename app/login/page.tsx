import type { Metadata } from "next"
import { TreePine, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Acceso administrativo | El Higuerón",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest px-4">

      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-forest-light/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-forest-light/20 blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white/95 shadow-2xl backdrop-blur-sm">

        {/* Cabecera */}
        <div className="flex flex-col items-center gap-3 rounded-t-2xl bg-forest px-8 py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20">
            <TreePine className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-white/60">
              El Higuerón
            </p>
            <h1 className="mt-0.5 text-xl font-bold text-white">
              Acceso administrativo
            </h1>
          </div>
        </div>

        {/* Formulario */}
        <div className="px-8 py-8">
          <form className="flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@elhigueron.com"
                autoComplete="email"
                className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
              />
            </div>

            <Button
              type="submit"
              className="mt-1 h-10 w-full bg-forest text-white hover:bg-forest/90"
              disabled
            >
              <Lock className="mr-2 h-4 w-4" />
              Iniciar sesión
            </Button>

          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Acceso restringido solo a personal autorizado.
          </p>
        </div>

      </div>
    </div>
  )
}
