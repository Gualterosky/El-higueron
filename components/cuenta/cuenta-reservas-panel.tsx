"use client"

import { useTranslations } from "next-intl"
import { CalendarDays, Construction } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/** Skeleton rows that show the shape of a real reservation history. */
const SKELETON_ROWS = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
]

export function CuentaReservasPanel() {
  const t = useTranslations("Cuenta")
  const tPanel = useTranslations("Panel")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold text-forest">
              {t("reservas.title")}
            </h2>
            <Badge variant="secondary">{tPanel("comingSoon")}</Badge>
          </div>
          <p className="max-w-2xl text-muted-foreground">{t("reservas.description")}</p>
        </div>
        {/* Disabled "Nueva reserva" button — will be enabled later */}
        <Button
          disabled
          className="shrink-0 cursor-not-allowed bg-forest text-white opacity-50"
        >
          {tPanel("comingSoon")}
        </Button>
      </div>

      {/* Draft banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50/60 px-4 py-3">
        <Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <p className="text-sm text-amber-800">{t("reservas.draftNote")}</p>
      </div>

      {/* Skeleton table (no real data yet — shows the future shape) */}
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
            {/* Empty state row */}
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
          </TableBody>
        </Table>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground">{t("reservas.columns.status")}:</span>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{t("reservas.status.pending")}</Badge>
          <Badge className="border-transparent bg-forest text-white">
            {t("reservas.status.confirmed")}
          </Badge>
          <Badge variant="destructive">{t("reservas.status.cancelled")}</Badge>
        </div>
      </div>

      {/* Dimmed skeleton rows — visual preview of the future table */}
      <div className="overflow-x-auto rounded-xl border border-border/60 opacity-30">
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
            {SKELETON_ROWS.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="h-4 w-24 rounded-md bg-muted/60" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 rounded-md bg-muted/60" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-10 rounded-md bg-muted/60" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-20 rounded-full bg-muted/60" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
