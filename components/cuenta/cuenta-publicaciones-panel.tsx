"use client"

import { useTranslations } from "next-intl"
import { Newspaper } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MyPublication } from "@/lib/cuenta/queries"

type Props = {
  publications: MyPublication[]
}

function statusVariant(status: string) {
  if (status === "approved") return "default"
  if (status === "hidden") return "destructive"
  return "secondary"
}

function publicationLabel(p: MyPublication, t: (key: string) => string) {
  if (p.kind === "reply") {
    return `${t("publicaciones.kinds.reply")} · ${p.targetType}`
  }
  return t(`publicaciones.kinds.${p.kind}`)
}

export function CuentaPublicacionesPanel({ publications }: Props) {
  const t = useTranslations("Cuenta")

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("publicaciones.title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("publicaciones.description")}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("publicaciones.columns.date")}</TableHead>
              <TableHead>{t("publicaciones.columns.type")}</TableHead>
              <TableHead>{t("publicaciones.columns.content")}</TableHead>
              <TableHead>{t("publicaciones.columns.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                      <Newspaper className="h-7 w-7" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{t("publicaciones.emptyTitle")}</p>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        {t("publicaciones.emptyDescription")}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              publications.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap">
                    {p.kind === "reply" ? p.createdAt.toLocaleDateString() : p.date}
                  </TableCell>
                  <TableCell>{publicationLabel(p, t)}</TableCell>
                  <TableCell>
                    <p className="max-w-xs truncate text-sm">{p.content}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(p.status)}>{t(`publicaciones.status.${p.status}` as any)}</Badge>
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
