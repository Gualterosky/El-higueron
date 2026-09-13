"use client"

import { useTranslations } from "next-intl"
import { CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MyReservation } from "@/lib/cuenta/queries"

type Props = {
  reservations: MyReservation[]
}

function statusVariant(status: string) {
  if (status === "confirmed") return "default"
  if (status === "cancelled") return "destructive"
  return "secondary"
}

export function CuentaReservasPanel({ reservations }: Props) {
  const t = useTranslations("Cuenta")

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("reservas.title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("reservas.description")}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("reservas.columns.date")}</TableHead>
              <TableHead>{t("reservas.columns.type")}</TableHead>
              <TableHead>{t("reservas.columns.people")}</TableHead>
              <TableHead>{t("reservas.columns.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                      <CalendarDays className="h-6 w-6" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{t("reservas.emptyTitle")}</p>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        {t("reservas.emptyDescription")}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.arrivalDate}</TableCell>
                  <TableCell>{t(`reservas.types.${r.type}` as any)}</TableCell>
                  <TableCell>{r.numberOfPeople}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(r.status)}>{t(`reservas.status.${r.status}` as any)}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
