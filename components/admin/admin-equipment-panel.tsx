"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Loader2, Package, Pencil, Plus, RotateCcw, Trash2, Wrench, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { uploadEquipmentImageAction } from "@/lib/equipos/actions"
import {
  createEquipmentItemAction,
  updateEquipmentItemAction,
  deleteEquipmentItemAction,
  setEquipmentItemMaintenanceAction,
  createEquipmentItemRentalAction,
  markEquipmentItemRentalReturnedAction,
  cancelEquipmentItemRentalAction,
  type EquipmentItemInput,
} from "@/lib/equipos/item-actions"
import type { EquipmentItemRow, EquipmentItemRentalRow } from "@/lib/equipos/item-queries"
import {
  EQUIPMENT_ITEM_CATEGORIES,
  isEquipmentItemCategory,
  isEquipmentItemStatus,
} from "@/lib/equipos/types"

type Props = {
  initialItems: EquipmentItemRow[]
  initialRentals: EquipmentItemRentalRow[]
}

export function AdminEquipmentPanel({ initialItems, initialRentals }: Props) {
  const t = useTranslations("Panel.equipment")

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <Tabs defaultValue="rentals">
        <TabsList>
          <TabsTrigger value="inventory">{t("tabs.inventory")}</TabsTrigger>
          <TabsTrigger value="rentals">{t("tabs.rentals")}</TabsTrigger>
          <TabsTrigger value="history">{t("tabs.history")}</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-6">
          <InventoryTab items={initialItems} />
        </TabsContent>

        <TabsContent value="rentals" className="mt-6">
          <RentalsTab items={initialItems} rentals={initialRentals} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistoryTab rentals={initialRentals} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function categoryLabelKey(category: string): string {
  return isEquipmentItemCategory(category) ? category : "otros"
}

/** Combina "Categoría + Nombre" para mostrar el nombre visible de un objeto
 *  (ej. "Gatos Sportiva Nago"). Si el nombre está vacío, deja solo la categoría. */
function combinedName(categoryLabel: string, name: string): string {
  const trimmed = name.trim()
  return trimmed ? `${categoryLabel} ${trimmed}` : categoryLabel
}

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("Panel.equipment")
  const key = isEquipmentItemStatus(status) ? status : "disponible"
  const className =
    key === "disponible"
      ? "border-transparent bg-forest text-white"
      : key === "rentado"
        ? "border-transparent bg-orange text-white"
        : "border-transparent bg-muted text-muted-foreground"

  return <Badge className={className}>{t(`status.${key}`)}</Badge>
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—"
  const [year, month, day] = date.split("-")
  if (!year || !month || !day) return date
  return `${day}/${month}/${year}`
}

const PRICE_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

function ItemThumb({ item }: { item: EquipmentItemRow }) {
  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige/40">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
      ) : (
        <Package className="h-10 w-10 text-forest/50" />
      )}
    </div>
  )
}

// ── Inventory tab ──────────────────────────────────────────────────────────────

function InventoryTab({ items }: { items: EquipmentItemRow[] }) {
  const t = useTranslations("Panel.equipment")
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<EquipmentItemRow | null>(null)
  const [deleteItem, setDeleteItem] = useState<EquipmentItemRow | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-forest text-white hover:bg-forest/90"
        >
          <Plus className="h-4 w-4" />
          {t("addItem")}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("noItems")}
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 p-4"
            >
              <div className="flex items-center gap-3">
                <ItemThumb item={item} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">#{item.code}</span>
                    <p className="font-medium text-foreground">{combinedName(t(`categories.${categoryLabelKey(item.category)}`), item.name)}</p>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {item.talla && <span>{t("tallaLabel")}: {item.talla}</span>}
                    {item.price != null && (
                      <span className="font-medium text-forest">
                        {t("pricePerDay", { price: PRICE_FORMATTER.format(item.price) })}
                      </span>
                    )}
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </div>
              <div className="ml-auto flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditItem(item)}
                  aria-label={t("editItem")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteItem(item)}
                  aria-label={t("deleteItem")}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ItemFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => {
          setCreateOpen(false)
          router.refresh()
        }}
      />

      {editItem && (
        <ItemFormDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(open) => {
            if (!open) setEditItem(null)
          }}
          onSaved={() => {
            setEditItem(null)
            router.refresh()
          }}
        />
      )}

      {deleteItem && (
        <DeleteItemDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => {
            if (!open) setDeleteItem(null)
          }}
          onDeleted={() => {
            setDeleteItem(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

function ItemFormDialog({
  item,
  open,
  onOpenChange,
  onSaved,
}: {
  item?: EquipmentItemRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [category, setCategory] = useState<EquipmentItemInput["category"]>(
    (item?.category as EquipmentItemInput["category"]) ?? "otros",
  )
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "")
  const [isUploading, setIsUploading] = useState(false)

  async function handleImageUpload(file: File) {
    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set("file", file)
      const result = await uploadEquipmentImageAction(formData)
      if (!result.ok) {
        setError(result.message || t(`uploadErrors.${result.error}`))
        return
      }
      setImageUrl(result.url)
    } finally {
      setIsUploading(false)
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const seqRaw = String(form.get("seq") ?? "").trim()
    const seq = seqRaw === "" ? null : Number(seqRaw)
    const talla = String(form.get("talla") ?? "").trim()
    const priceRaw = String(form.get("price") ?? "").trim()
    const price = priceRaw === "" ? null : Number(priceRaw)

    if (!name) return

    const input: EquipmentItemInput = {
      name,
      category,
      seq: seq != null && Number.isFinite(seq) && seq > 0 ? seq : null,
      talla: talla || null,
      price: price != null && Number.isFinite(price) ? price : null,
      imageUrl: imageUrl || null,
    }

    startTransition(async () => {
      const result = item
        ? await updateEquipmentItemAction(item.id, input)
        : await createEquipmentItemAction(input)

      if (!result.ok) {
        setError(t(`errors.${result.error}`))
        return
      }
      toast.success(item ? t("updateSuccess") : t("createSuccess"))
      onSaved()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? t("editItem") : t("addItem")}</DialogTitle>
          <DialogDescription>{t("formDescription")}</DialogDescription>
        </DialogHeader>

        <form id="item-form" onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="it-seq">{t("form.code")}</Label>
            <Input
              id="it-seq"
              name="seq"
              type="number"
              min={1}
              step={1}
              defaultValue={item?.seq ?? ""}
              placeholder={item ? undefined : t("form.codePlaceholder")}
              className="h-10 font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="it-name">{t("form.name")}</Label>
            <Input id="it-name" name="name" defaultValue={item?.name} required className="h-10" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="it-category">{t("form.category")}</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as EquipmentItemInput["category"])}
            >
              <SelectTrigger id="it-category" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_ITEM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(category === "gatos" || category === "botas") && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="it-talla">{t("form.talla")}</Label>
              <Input id="it-talla" name="talla" defaultValue={item?.talla ?? ""} className="h-10" />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="it-price">{t("form.price")}</Label>
            <Input
              id="it-price"
              name="price"
              type="number"
              min={0}
              step={1}
              defaultValue={item?.price ?? ""}
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="it-image">{t("form.image")}</Label>
            <p className="text-xs text-muted-foreground">{t("form.imageHint")}</p>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-beige/40">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-6 w-6 text-forest/40" />
                )}
              </div>
              <Input
                id="it-image"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleImageUpload(file)
                }}
                className="h-10"
              />
              {isUploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            form="item-form"
            disabled={isPending || isUploading}
            className="bg-forest text-white hover:bg-forest/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteItemDialog({
  item,
  open,
  onOpenChange,
  onDeleted,
}: {
  item: EquipmentItemRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [step, setStep] = useState(1)
  const [confirmCode, setConfirmCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function reset() {
    setStep(1)
    setConfirmCode("")
  }

  function handleDelete() {
    if (confirmCode !== item.code) return
    setError(null)
    startTransition(async () => {
      const result = await deleteEquipmentItemAction(item.id)
      if (!result.ok) {
        setError(t(`errors.${result.error}`))
        return
      }
      toast.success(t("deleteSuccess"))
      onDeleted()
    })
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        if (!isPending) {
          onOpenChange(o)
          if (!o) reset()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteItem")}</AlertDialogTitle>
          <AlertDialogDescription>
            {step === 1
              ? t("deleteItemConfirmStep1", {
                  name: combinedName(t(`categories.${categoryLabelKey(item.category)}`), item.name),
                  code: item.code,
                })
              : t("deleteItemConfirmStep2", { code: item.code })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {step === 2 && (
          <Input
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
            placeholder={item.code}
            className="h-10 font-mono"
          />
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("cancel")}</AlertDialogCancel>
          {step === 1 ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setStep(2)}
              className="text-white"
            >
              {t("continue")}
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              disabled={isPending || confirmCode !== item.code}
              onClick={handleDelete}
              className="text-white"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("deleteDefinitively")}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ── Rentals tab ────────────────────────────────────────────────────────────────

function RentalsTab({
  items,
  rentals,
}: {
  items: EquipmentItemRow[]
  rentals: EquipmentItemRentalRow[]
}) {
  const t = useTranslations("Panel.equipment")
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)

  const activeRentals = rentals.filter((r) => r.returnedAt === null)

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-forest text-white hover:bg-forest/90"
        >
          <Plus className="h-4 w-4" />
          {t("registerRental")}
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-forest">{t("activeRentals")}</h3>
        {activeRentals.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
            {t("noActiveRentals")}
          </p>
        ) : (
          <ActiveRentalsTable
            rentals={activeRentals}
            onChanged={router.refresh}
          />
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-forest">{t("inventoryStatus")}</h3>
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
            {t("noItems")}
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 p-4"
              >
                <div className="flex items-center gap-3">
                  <ItemThumb item={item} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">#{item.code}</span>
                      <p className="font-medium text-foreground">{combinedName(t(`categories.${categoryLabelKey(item.category)}`), item.name)}</p>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {item.talla && <span>{t("tallaLabel")}: {item.talla}</span>}
                      {item.price != null && (
                        <span className="font-medium text-forest">
                          {t("pricePerDay", { price: PRICE_FORMATTER.format(item.price) })}
                        </span>
                      )}
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
                <div className="ml-auto flex gap-1">
                  {item.status === "disponible" && (
                    <MaintenanceButton item={item} maintenance onChanged={router.refresh} />
                  )}
                  {item.status === "mantenimiento" && (
                    <MaintenanceButton item={item} maintenance={false} onChanged={router.refresh} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RegisterRentalDialog
        items={items}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          setCreateOpen(false)
          router.refresh()
        }}
      />
    </div>
  )
}

function MaintenanceButton({
  item,
  maintenance,
  onChanged,
}: {
  item: EquipmentItemRow
  maintenance: boolean
  onChanged: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      const result = await setEquipmentItemMaintenanceAction(item.id, maintenance)
      if (result.ok) {
        toast.success(maintenance ? t("maintenanceSuccess") : t("availableSuccess"))
        onChanged()
      } else {
        toast.error(t(`errors.${result.error}`))
      }
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      className="gap-1"
    >
      <Wrench className="h-3.5 w-3.5" />
      {maintenance ? t("markMaintenance") : t("markAvailable")}
    </Button>
  )
}

function ActiveRentalsTable({
  rentals,
  onChanged,
}: {
  rentals: EquipmentItemRentalRow[]
  onChanged: () => void
}) {
  const t = useTranslations("Panel.equipment")

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.equipment")}</TableHead>
            <TableHead>{t("columns.date")}</TableHead>
            <TableHead>{t("columns.status")}</TableHead>
            <TableHead className="text-right">{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.map((rental) => (
            <TableRow key={rental.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-beige/40">
                    {rental.itemImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rental.itemImageUrl}
                        alt={rental.itemName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-7 w-7 text-forest/50" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{combinedName(t(`categories.${categoryLabelKey(rental.itemCategory)}`), rental.itemName)}</p>
                    <p className="text-xs text-muted-foreground">#{rental.itemCode}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(rental.rentedAt)}</TableCell>
              <TableCell>
                <Badge className="border-transparent bg-orange text-white">{t("status.rentado")}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <RentalRowActions rentalId={rental.id} onChanged={onChanged} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function RentalRowActions({
  rentalId,
  onChanged,
}: {
  rentalId: string
  onChanged: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [isPending, startTransition] = useTransition()

  function handleReturn() {
    startTransition(async () => {
      const result = await markEquipmentItemRentalReturnedAction(rentalId)
      if (result.ok) {
        toast.success(t("returnSuccess"))
        onChanged()
      } else {
        toast.error(t(`errors.${result.error}`))
      }
    })
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelEquipmentItemRentalAction(rentalId)
      if (result.ok) {
        toast.success(t("cancelRentalSuccess"))
        onChanged()
      } else {
        toast.error(t(`errors.${result.error}`))
      }
    })
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleReturn}
        disabled={isPending}
        className="gap-1 border-forest/30 text-forest hover:bg-forest/10"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {t("markReturned")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCancel}
        disabled={isPending}
        className="gap-1 text-destructive hover:bg-destructive/10"
      >
        <X className="h-3.5 w-3.5" />
        {t("cancelRental")}
      </Button>
    </div>
  )
}

function RegisterRentalDialog({
  items,
  open,
  onOpenChange,
  onCreated,
}: {
  items: EquipmentItemRow[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const available = items.filter((item) => item.status === "disponible")
  const [itemId, setItemId] = useState<string>(available[0]?.id ?? "")
  // Fall back to the first available item if the stored selection becomes stale.
  const effectiveItemId = available.some((item) => item.id === itemId)
    ? itemId
    : (available[0]?.id ?? "")
  const selectedItem = available.find((item) => item.id === effectiveItemId)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const rentedAt = String(form.get("rentedAt") ?? "").trim()

    if (!effectiveItemId || !rentedAt) return

    startTransition(async () => {
      const result = await createEquipmentItemRentalAction({ itemId: effectiveItemId, rentedAt })
      if (!result.ok) {
        setError(t(`errors.${result.error}`))
        return
      }
      toast.success(t("registerSuccess"))
      onCreated()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("registerRental")}</DialogTitle>
          <DialogDescription>{t("registerRentalDescription")}</DialogDescription>
        </DialogHeader>

        <form id="rental-form" onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="r-item">{t("form.equipment")}</Label>
            <Select value={effectiveItemId} onValueChange={setItemId}>
              <SelectTrigger
                id="r-item"
                className="py-1.5"
                style={{ height: "auto", minHeight: "3rem" }}
              >
                {selectedItem && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-beige/40">
                    {selectedItem.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedItem.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-forest/50" />
                    )}
                  </span>
                )}
                <SelectValue placeholder={t("selectItem")}>
                  {selectedItem
                    ? `${combinedName(t(`categories.${categoryLabelKey(selectedItem.category)}`), selectedItem.name)}${selectedItem.talla ? ` · ${t("tallaLabel")}: ${selectedItem.talla}` : ""}`
                    : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {available.length === 0 ? (
                  <SelectItem value="none" disabled>
                    {t("noAvailableItems")}
                  </SelectItem>
                ) : (
                  available.map((item) => (
                    <SelectItem key={item.id} value={item.id} className="py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige/40">
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-7 w-7 text-forest/50" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{combinedName(t(`categories.${categoryLabelKey(item.category)}`), item.name)}</p>
                          {item.talla ? (
                            <p className="text-xs text-muted-foreground">
                              {t("tallaLabel")}: {item.talla}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="r-rentedAt">{t("form.rentedAt")}</Label>
            <Input
              id="r-rentedAt"
              name="rentedAt"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="h-10"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            form="rental-form"
            disabled={isPending || available.length === 0 || !effectiveItemId}
            className="bg-forest text-white hover:bg-forest/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── History tab ────────────────────────────────────────────────────────────────

function HistoryTab({ rentals }: { rentals: EquipmentItemRentalRow[] }) {
  const t = useTranslations("Panel.equipment")

  const grouped = new Map<string, EquipmentItemRentalRow[]>()
  for (const rental of rentals) {
    const list = grouped.get(rental.rentedAt) ?? []
    list.push(rental)
    grouped.set(rental.rentedAt, list)
  }
  const days = Array.from(grouped.entries()).sort((a, b) => b[0].localeCompare(a[0]))

  if (days.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
        {t("noHistory")}
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {days.map(([day, dayRentals]) => (
        <div key={day} className="space-y-3">
          <h3 className="text-lg font-medium text-forest">{formatDate(day)}</h3>
          <div className="space-y-3">
            {dayRentals.map((rental) => (
              <div
                key={rental.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige/40">
                    {rental.itemImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rental.itemImageUrl}
                        alt={rental.itemName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-10 w-10 text-forest/50" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">#{rental.itemCode}</span>
                      <p className="font-medium text-foreground">{combinedName(t(`categories.${categoryLabelKey(rental.itemCategory)}`), rental.itemName)}</p>
                    </div>
                    {rental.itemTalla ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {t("tallaLabel")}: {rental.itemTalla}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}