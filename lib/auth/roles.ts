export const ROLES = ["administrador", "staff", "visitante"] as const

export type Role = (typeof ROLES)[number]

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value)
}

export function homePathForRole(role: Role): "/admin" | "/staff" | "/cuenta" {
  if (role === "administrador") return "/admin"
  if (role === "staff") return "/staff"
  return "/cuenta"
}

export function canAccessPath(role: Role, pathWithoutLocale: string): boolean {
  if (pathWithoutLocale.startsWith("/admin")) {
    return role === "administrador"
  }
  if (pathWithoutLocale.startsWith("/staff")) {
    return role === "administrador" || role === "staff"
  }
  if (pathWithoutLocale.startsWith("/cuenta")) {
    return role === "visitante"
  }
  return true
}
