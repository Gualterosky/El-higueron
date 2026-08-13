"use client"

import { useTranslations } from "next-intl"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ComingSoonBadge } from "@/components/admin/coming-soon-badge"

const MOCK_USERS = [
  {
    id: "1",
    name: "Ana Ruiz",
    email: "ana.ruiz@elhigeron.com",
    role: "staff",
    status: "active",
  },
  {
    id: "2",
    name: "Carlos Méndez",
    email: "carlos.mendez@elhigeron.com",
    role: "staff",
    status: "active",
  },
  {
    id: "3",
    name: "Laura Pérez",
    email: "laura@email.com",
    role: "visitante",
    status: "active",
  },
  {
    id: "4",
    name: "Diego Soto",
    email: "diego.soto@elhigeron.com",
    role: "staff",
    status: "inactive",
  },
] as const

export function AdminUsersPanel() {
  const t = useTranslations("Panel.users")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
            <ComingSoonBadge />
          </div>
          <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
        </div>
        <Button type="button" disabled className="shrink-0 gap-2 bg-forest text-white opacity-60">
          <Plus className="h-4 w-4" />
          {t("create")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.name")}</TableHead>
            <TableHead>{t("columns.email")}</TableHead>
            <TableHead>{t("columns.role")}</TableHead>
            <TableHead>{t("columns.status")}</TableHead>
            <TableHead className="text-right">{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_USERS.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{t(`roles.${user.role}`)}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                  className={
                    user.status === "active"
                      ? "border-transparent bg-forest text-white"
                      : undefined
                  }
                >
                  {t(`status.${user.status}`)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button type="button" variant="ghost" size="icon" disabled aria-label={t("edit")}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled
                    aria-label={t("delete")}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
