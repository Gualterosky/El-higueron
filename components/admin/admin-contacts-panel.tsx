"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Trash2 } from "lucide-react"
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
import { deleteContactAction } from "@/lib/contacts/actions"
import { formatPhoneDisplay } from "@/lib/contacts/normalize"
import type { AdminContact } from "@/lib/contacts/queries"

type Props = {
  contacts: AdminContact[]
}

export function AdminContactsPanel({ contacts }: Props) {
  const t = useTranslations("Contacts")
  const [items, setItems] = useState<AdminContact[]>(contacts)
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este contacto? Los envíos vinculados se desvincularán, no se borrarán.")) return
    startTransition(async () => {
      const result = await deleteContactAction(id)
      if (result.ok) {
        setItems((prev) => prev.filter((c) => c.id !== id))
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.name")}</TableHead>
              <TableHead>{t("columns.email")}</TableHead>
              <TableHead>{t("columns.phone")}</TableHead>
              <TableHead>{t("columns.lastSeen")}</TableHead>
              <TableHead className="text-right">{t("columns.submissions")}</TableHead>
              <TableHead>{t("columns.account")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  {t("noResults")}
                </TableCell>
              </TableRow>
            ) : (
              items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name ?? "—"}</TableCell>
                  <TableCell>{c.email ?? "—"}</TableCell>
                  <TableCell>{c.phone ? formatPhoneDisplay(c.phone) : "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {c.lastSeenAt?.toLocaleDateString() ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">{c.submissionCount}</TableCell>
                  <TableCell>
                    {c.userId ? (
                      <Badge variant="default">{t("hasAccount")}</Badge>
                    ) : (
                      <Badge variant="secondary">{t("noAccount")}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      onClick={() => handleDelete(c.id)}
                      title={t("anonymize")}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
