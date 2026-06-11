import {
  Trophy,
  Users,
  MapPin,
  Mountain,
  Flame,
  Clock,
  GraduationCap,
  Tent,
  Calendar,
  Star,
  CheckCircle,
  type LucideIcon,
} from "lucide-react"

// Mapa de nombres de icono (string en los datos) a componentes de lucide-react.
// Permite definir iconos desde los archivos de configuración sin importarlos allí.
const iconos: Record<string, LucideIcon> = {
  Trophy,
  Users,
  MapPin,
  Mountain,
  Flame,
  Clock,
  GraduationCap,
  Tent,
  Calendar,
  Star,
  CheckCircle,
}

/** Devuelve el componente de icono por nombre, con Star como respaldo. */
export function getIcono(nombre: string): LucideIcon {
  return iconos[nombre] ?? Star
}
