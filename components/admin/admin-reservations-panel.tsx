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
import type { ReservationRow } from "@/lib/reservas/queries"

function formatDate(date: string) {
  if (!date) return "—"
  const [year, month, day] = date.split("-")
  return `${day}/${month}/${year}`
}

type Props = {
  reservations: ReservationRow[]
}

export function AdminReservationsPanel({ reservations }: Props) {
  const t = useTranslations("Panel.reservations")

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      {reservations.length === 0 ? (
        <p className="text-muted-foreground">{t("noResults")}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("columns.guest")}</TableHead>
                <TableHead>{t("columns.dates")}</TableHead>
                <TableHead>{t("columns.type")}</TableHead>
                <TableHead>{t("columns.people")}</TableHead>
                <TableHead>{t("columns.contact")}</TableHead>
                <TableHead>{t("columns.status")}</TableHead>
                <TableHead className="text-right">{t("columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(reservation.arrivalDate)}
                    {reservation.departureDate
                      ? ` – ${formatDate(reservation.departureDate)}`
                      : ""}
                    {reservation.mayStayExtra ? (
                      <span className="ml-1 text-xs text-orange">+1?</span>
                    ) : null}
                  </TableCell>
                  <TableCell>{t(`types.${reservation.type}`)}</TableCell>
                  <TableCell>{reservation.numberOfPeople}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-xs text-muted-foreground">
                    {reservation.contactInfo}
                  </TableCell>
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
      )}

      {reservations.some((r) => r.notes) && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">{t("notesTitle")}</h3>
          <ul className="space-y-2">
            {reservations
              .filter((r) => r.notes)
              .map((r) => (
                <li key={r.id} className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{r.name}:</span>{" "}
                  <span className="text-muted-foreground">{r.notes}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
