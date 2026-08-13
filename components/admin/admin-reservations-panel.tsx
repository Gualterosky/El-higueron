"use client"

import { useTranslations } from "next-intl"
import { Check, X } from "lucide-react"
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

const MOCK_RESERVATIONS = [
  {
    id: "1",
    guest: "Camila Restrepo",
    dates: "12–14 ago 2026",
    type: "camping",
    people: 3,
    status: "pending",
  },
  {
    id: "2",
    guest: "Juan Herrera",
    dates: "15–16 ago 2026",
    type: "escalada",
    people: 2,
    status: "confirmed",
  },
  {
    id: "3",
    guest: "Valentina Díaz",
    dates: "20–22 ago 2026",
    type: "camping",
    people: 5,
    status: "pending",
  },
  {
    id: "4",
    guest: "Mateo Jiménez",
    dates: "05–06 ago 2026",
    type: "visita",
    people: 1,
    status: "cancelled",
  },
] as const

export function AdminReservationsPanel() {
  const t = useTranslations("Panel.reservations")

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
          <ComingSoonBadge />
        </div>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.guest")}</TableHead>
            <TableHead>{t("columns.dates")}</TableHead>
            <TableHead>{t("columns.type")}</TableHead>
            <TableHead>{t("columns.people")}</TableHead>
            <TableHead>{t("columns.status")}</TableHead>
            <TableHead className="text-right">{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_RESERVATIONS.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{reservation.guest}</TableCell>
              <TableCell className="text-muted-foreground">{reservation.dates}</TableCell>
              <TableCell>{t(`types.${reservation.type}`)}</TableCell>
              <TableCell>{reservation.people}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    reservation.status === "confirmed"
                      ? "default"
                      : reservation.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                  }
                  className={
                    reservation.status === "confirmed"
                      ? "border-transparent bg-forest text-white"
                      : undefined
                  }
                >
                  {t(`status.${reservation.status}`)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled
                    aria-label={t("confirm")}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled
                    aria-label={t("cancel")}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
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
