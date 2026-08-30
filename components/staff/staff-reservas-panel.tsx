"use client"

import { useTranslations } from "next-intl"
import { CalendarDays, Construction } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/** Placeholder rows that give a sense of what the table will look like. */
const SKELETON_ROWS = [
  { id: "1", guest: "—", dates: "—", type: "—", people: "—", status: "—" },
  { id: "2", guest: "—", dates: "—", type: "—", people: "—", status: "—" },
  { id: "3", guest: "—", dates: "—", type: "—", people: "—", status: "—" },
]

export function StaffReservasPanel() {
  const t = useTranslations("Panel")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold text-forest">
              {t("staff.reservas.title")}
            </h2>
            <Badge variant="secondary">{t("comingSoon")}</Badge>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            {t("staff.reservas.description")}
          </p>
        </div>
      </div>

      {/* Draft banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50/60 px-4 py-3">
        <Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <p className="text-sm text-amber-800">{t("draftBanner")}</p>
      </div>

      {/* Skeleton table */}
      <div className="overflow-x-auto rounded-xl border border-border/60 opacity-40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("reservations.columns.guest")}</TableHead>
              <TableHead>{t("reservations.columns.dates")}</TableHead>
              <TableHead>{t("reservations.columns.type")}</TableHead>
              <TableHead>{t("reservations.columns.people")}</TableHead>
              <TableHead>{t("reservations.columns.status")}</TableHead>
              <TableHead className="text-right">{t("reservations.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SKELETON_ROWS.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground/40" />
                    <span className="text-muted-foreground/40">{row.guest}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground/40">{row.dates}</TableCell>
                <TableCell className="text-muted-foreground/40">{row.type}</TableCell>
                <TableCell className="text-muted-foreground/40">{row.people}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="opacity-40">—</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-muted-foreground/40">—</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
