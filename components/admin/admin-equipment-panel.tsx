"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Loader2, Package, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  AlertDialogAction,
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
import {
  createEquipmentAction,
  createRentalAction,
  createVariantAction,
  deleteEquipmentAction,
  deleteVariantAction,
  markRentalReturnedAction,
  cancelRentalAction,
  updateEquipmentAction,
  updateVariantAction,
  uploadEquipmentImageAction,
  type EquipmentInput,
  type RentalInput,
  type VariantInput,
} from "@/lib/equipos/actions"
import type { EquipmentCatalogItem, EquipmentRentalRow } from "@/lib/equipos/queries"
import { EQUIPMENT_CATEGORIES, isEquipmentRentalStatus } from "@/lib/equipos/types"

type Props = {
  initialEquipment: EquipmentCatalogItem[]
  initialRentals: EquipmentRentalRow[]
}

export function AdminEquipmentPanel({ initialEquipment, initialRentals }: Props) {
  const t = useTranslations("Panel.equipment")

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList>
          <TabsTrigger value="inventory">{t("tabs.inventory")}</TabsTrigger>
          <TabsTrigger value="rentals">{t("tabs.rentals")}</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-6">
          <InventoryTab initialEquipment={initialEquipment} />
        </TabsContent>

        <TabsContent value="rentals" className="mt-6">
          <RentalsTab equipment={initialEquipment} initialRentals={initialRentals} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── Inventory tab ──────────────────────────────────────────────────────────────

function InventoryTab({ initialEquipment }: { initialEquipment: EquipmentCatalogItem[] }) {
  const t = useTranslations("Panel.equipment")
  const router = useRouter()
  const [items, setItems] = useState(initialEquipment)
  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<EquipmentCatalogItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<EquipmentCatalogItem | null>(null)

  function refreshAndClose() {
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-forest text-white hover:bg-forest/90"
        >
          <Plus className="h-4 w-4" />
          {t("createEquipment")}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("noEquipment")}
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <EquipmentCard
              key={item.id}
              item={item}
              onEdit={() => setEditItem(item)}
              onDelete={() => setDeleteItem(item)}
              onChanged={refreshAndClose}
            />
          ))}
        </div>
      )}

      <EquipmentFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => {
          setCreateOpen(false)
          router.refresh()
        }}
      />

      {editItem && (
        <EquipmentFormDialog
          equipment={editItem}
          open={!!editItem}
          onOpenChange={(open) => { if (!open) setEditItem(null) }}
          onSaved={() => {
            setEditItem(null)
            router.refresh()
          }}
        />
      )}

      {deleteItem && (
        <DeleteEquipmentDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => { if (!open) setDeleteItem(null) }}
          onDeleted={() => {
            setItems((prev) => prev.filter((i) => i.id !== deleteItem.id))
            setDeleteItem(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

function EquipmentCard({
  item,
  onEdit,
  onDelete,
  onChanged,
}: {
  item: EquipmentCatalogItem
  onEdit: () => void
  onDelete: () => void
  onChanged: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [variantDialogOpen, setVariantDialogOpen] = useState(false)
  const [editVariant, setEditVariant] = useState<EquipmentCatalogItem["variants"][number] | null>(null)

  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige/40">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <Package className="h-6 w-6 text-forest/50" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{item.name}</p>
              {!item.active && <Badge variant="outline">{t("inactive")}</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{t(`categories.${item.category}`)}</p>
            {item.description && (
              <p className="mt-1 max-w-md text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={onEdit} aria-label={t("editEquipment")}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={t("deleteEquipment")}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {item.variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => setEditVariant(variant)}
            className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs hover:border-forest/40"
          >
            <span className="font-medium">{variant.label}</span>
            <span className="text-muted-foreground">
              {t("stockCount", { available: variant.availableQuantity, total: variant.totalQuantity })}
            </span>
          </button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setVariantDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("addVariant")}
        </Button>
      </div>

      <VariantFormDialog
        equipmentId={item.id}
        open={variantDialogOpen}
        onOpenChange={setVariantDialogOpen}
        onSaved={() => {
          setVariantDialogOpen(false)
          onChanged()
        }}
      />

      {editVariant && (
        <VariantFormDialog
          equipmentId={item.id}
          variant={editVariant}
          open={!!editVariant}
          onOpenChange={(open) => { if (!open) setEditVariant(null) }}
          onSaved={() => {
            setEditVariant(null)
            onChanged()
          }}
        />
      )}
    </div>
  )
}

function EquipmentFormDialog({
  equipment,
  open,
  onOpenChange,
  onSaved,
}: {
  equipment?: EquipmentCatalogItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [category, setCategory] = useState<EquipmentInput["category"]>(
    (equipment?.category as EquipmentInput["category"]) ?? "otro",
  )
  const [active, setActive] = useState(equipment?.active ?? true)
  const [imageUrl, setImageUrl] = useState(equipment?.imageUrl ?? "")
  const [isUploading, setIsUploading] = useState(false)

  async function handleImageUpload(file: File) {
    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set("file", file)
      const result = await uploadEquipmentImageAction(formData)
      if (!result.ok) {
        setError(t(`uploadErrors.${result.error}`))
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
    const description = String(form.get("description") ?? "").trim()
    const priceRaw = String(form.get("pricePerDay") ?? "").trim()
    const pricePerDay = priceRaw ? Number(priceRaw) : null

    if (!name) return

    const input: EquipmentInput = {
      name,
      category,
      description,
      pricePerDay,
      imageUrl: imageUrl || null,
      active,
    }

    startTransition(async () => {
      const result = equipment
        ? await updateEquipmentAction(equipment.id, input)
        : await createEquipmentAction(input)

      if (!result.ok) {
        setError(t(`errors.${result.error}`))
        return
      }
      toast.success(equipment ? t("updateSuccess") : t("createSuccess"))
      onSaved()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{equipment ? t("editEquipment") : t("createEquipment")}</DialogTitle>
          <DialogDescription>{t("formDescription")}</DialogDescription>
        </DialogHeader>

        <form id="equipment-form" onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eq-name">{t("form.name")}</Label>
            <Input id="eq-name" name="name" defaultValue={equipment?.name} required className="h-10" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eq-category">{t("form.category")}</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as EquipmentInput["category"])}>
              <SelectTrigger id="eq-category" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eq-description">{t("form.description")}</Label>
            <Textarea id="eq-description" name="description" defaultValue={equipment?.description} rows={3} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eq-price">{t("form.pricePerDay")}</Label>
            <Input
              id="eq-price"
              name="pricePerDay"
              type="number"
              min={0}
              step={1000}
              defaultValue={equipment?.pricePerDay ?? undefined}
              placeholder={t("form.pricePlaceholder")}
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eq-image">{t("form.image")}</Label>
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
                id="eq-image"
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

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <Label htmlFor="eq-active" className="cursor-pointer text-sm font-normal">
              {t("form.active")}
            </Label>
            <Switch id="eq-active" checked={active} onCheckedChange={setActive} />
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
            form="equipment-form"
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

function DeleteEquipmentDialog({
  item,
  open,
  onOpenChange,
  onDeleted,
}: {
  item: EquipmentCatalogItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteEquipmentAction(item.id)
      if (!result.ok) {
        setError(t(`errors.${result.error}`))
        return
      }
      onDeleted()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteEquipment")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteEquipmentConfirm", { name: item.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => { e.preventDefault(); handleDelete() }}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function VariantFormDialog({
  equipmentId,
  variant,
  open,
  onOpenChange,
  onSaved,
}: {
  equipmentId: string
  variant?: EquipmentCatalogItem["variants"][number]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [active, setActive] = useState(variant?.active ?? true)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const label = String(form.get("label") ?? "").trim()
    const totalQuantity = Number(form.get("totalQuantity") ?? 0)

    if (!label) return

    const input: VariantInput = { label, totalQuantity, active }

    startTransition(async () => {
      const result = variant
        ? await updateVariantAction(variant.id, input)
        : await createVariantAction(equipmentId, input)

      if (!result.ok) {
        setError(t(`errors.${result.error}`))
        return
      }
      onSaved()
    })
  }

  function handleDeleteVariant() {
    if (!variant) return
    setError(null)
    startTransition(async () => {
      const result = await deleteVariantAction(variant.id)
      if (!result.ok) {
        setError(t(`errors.${result.error}`))
        return
      }
      onSaved()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{variant ? t("editVariant") : t("addVariant")}</DialogTitle>
        </DialogHeader>

        <form id="variant-form" onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="v-label">{t("form.variantLabel")}</Label>
            <Input id="v-label" name="label" defaultValue={variant?.label} required className="h-10" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="v-qty">{t("form.totalQuantity")}</Label>
            <Input
              id="v-qty"
              name="totalQuantity"
              type="number"
              min={0}
              defaultValue={variant?.totalQuantity ?? 0}
              required
              className="h-10"
            />
            {variant && variant.activeQuantity > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("form.currentlyInUse", { count: variant.activeQuantity })}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <Label htmlFor="v-active" className="cursor-pointer text-sm font-normal">
              {t("form.active")}
            </Label>
            <Switch id="v-active" checked={active} onCheckedChange={setActive} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          {variant ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleDeleteVariant}
              disabled={isPending}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete")}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              {t("cancel")}
            </Button>
            <Button type="submit" form="variant-form" disabled={isPending} className="bg-forest text-white hover:bg-forest/90">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("save")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Rentals tab ────────────────────────────────────────────────────────────────

function RentalsTab({
  equipment,
  initialRentals,
}: {
  equipment: EquipmentCatalogItem[]
  initialRentals: EquipmentRentalRow[]
}) {
  const t = useTranslations("Panel.equipment")
  const router = useRouter()
  const [rentals, setRentals] = useState(initialRentals)
  const [createOpen, setCreateOpen] = useState(false)

  const activeRentals = rentals.filter((r) => r.status === "activa")
  const historyRentals = rentals.filter((r) => r.status !== "activa")

  function updateRentalLocal(id: string, patch: Partial<EquipmentRentalRow>) {
    setRentals((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

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
          <RentalsTable
            rentals={activeRentals}
            showActions
            onReturned={(id) => {
              updateRentalLocal(id, { status: "devuelta", returnedAt: new Date() })
              router.refresh()
            }}
            onCancelled={(id) => {
              updateRentalLocal(id, { status: "cancelada" })
              router.refresh()
            }}
          />
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-forest">{t("history")}</h3>
        {historyRentals.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
            {t("noHistory")}
          </p>
        ) : (
          <RentalsTable rentals={historyRentals} showActions={false} />
        )}
      </div>

      <RegisterRentalDialog
        equipment={equipment}
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

function formatDate(date: string | null | undefined) {
  if (!date) return "—"
  const [year, month, day] = date.split("-")
  if (!year || !month || !day) return date
  return `${day}/${month}/${year}`
}

function RentalsTable({
  rentals,
  showActions,
  onReturned,
  onCancelled,
}: {
  rentals: EquipmentRentalRow[]
  showActions: boolean
  onReturned?: (id: string) => void
  onCancelled?: (id: string) => void
}) {
  const t = useTranslations("Panel.equipment")

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.date")}</TableHead>
            <TableHead>{t("columns.renter")}</TableHead>
            <TableHead>{t("columns.equipment")}</TableHead>
            <TableHead>{t("columns.variant")}</TableHead>
            <TableHead>{t("columns.quantity")}</TableHead>
            <TableHead>{t("columns.expectedReturn")}</TableHead>
            <TableHead>{t("columns.status")}</TableHead>
            {showActions && <TableHead className="text-right">{t("columns.actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.map((rental) => {
            const status = isEquipmentRentalStatus(rental.status) ? rental.status : "activa"
            return (
              <TableRow key={rental.id}>
                <TableCell className="text-muted-foreground">{formatDate(rental.rentedAt)}</TableCell>
                <TableCell className="font-medium">
                  {rental.renterName}
                  {rental.renterContact && (
                    <span className="block text-xs text-muted-foreground">{rental.renterContact}</span>
                  )}
                </TableCell>
                <TableCell>{rental.equipmentName}</TableCell>
                <TableCell>{rental.variantLabel}</TableCell>
                <TableCell>{rental.quantity}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(rental.expectedReturnAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant={status === "cancelada" ? "destructive" : "secondary"}
                    className={status === "devuelta" ? "border-transparent bg-forest text-white" : undefined}
                  >
                    {t(`status.${status}`)}
                  </Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <RentalRowActions
                      rentalId={rental.id}
                      onReturned={() => onReturned?.(rental.id)}
                      onCancelled={() => onCancelled?.(rental.id)}
                    />
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function RentalRowActions({
  rentalId,
  onReturned,
  onCancelled,
}: {
  rentalId: string
  onReturned: () => void
  onCancelled: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [isPending, startTransition] = useTransition()

  function handleReturn() {
    startTransition(async () => {
      const result = await markRentalReturnedAction(rentalId)
      if (result.ok) {
        toast.success(t("returnSuccess"))
        onReturned()
      } else {
        toast.error(t(`errors.${result.error}`))
      }
    })
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelRentalAction(rentalId)
      if (result.ok) {
        onCancelled()
      } else {
        toast.error(t(`errors.${result.error}`))
      }
    })
  }

  return (
    <div className="flex justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleReturn}
        disabled={isPending}
        aria-label={t("markReturned")}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleCancel}
        disabled={isPending}
        aria-label={t("cancelRental")}
        className="text-destructive"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

function RegisterRentalDialog({
  equipment,
  open,
  onOpenChange,
  onCreated,
}: {
  equipment: EquipmentCatalogItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const t = useTranslations("Panel.equipment")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [equipmentId, setEquipmentId] = useState<string>(equipment[0]?.id ?? "")

  const selectedEquipment = equipment.find((e) => e.id === equipmentId)
  const [variantId, setVariantId] = useState<string>(selectedEquipment?.variants[0]?.id ?? "")

  function handleEquipmentChange(id: string) {
    setEquipmentId(id)
    const next = equipment.find((e) => e.id === id)
    setVariantId(next?.variants[0]?.id ?? "")
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const renterName = String(form.get("renterName") ?? "").trim()
    const renterContact = String(form.get("renterContact") ?? "").trim()
    const quantity = Number(form.get("quantity") ?? 1)
    const rentedAt = String(form.get("rentedAt") ?? "")
    const expectedReturnAt = String(form.get("expectedReturnAt") ?? "").trim()
    const notes = String(form.get("notes") ?? "").trim()

    if (!renterName || !equipmentId || !variantId || !rentedAt) return

    const input: RentalInput = {
      equipmentId,
      variantId,
      renterName,
      renterContact: renterContact || null,
      quantity,
      rentedAt,
      expectedReturnAt: expectedReturnAt || null,
      notes: notes || null,
    }

    startTransition(async () => {
      const result = await createRentalAction(input)
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("registerRental")}</DialogTitle>
          <DialogDescription>{t("registerRentalDescription")}</DialogDescription>
        </DialogHeader>

        <form id="rental-form" onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="r-equipment">{t("form.equipment")}</Label>
              <Select value={equipmentId} onValueChange={handleEquipmentChange}>
                <SelectTrigger id="r-equipment" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="r-variant">{t("form.variant")}</Label>
              <Select value={variantId} onValueChange={setVariantId}>
                <SelectTrigger id="r-variant" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedEquipment?.variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.label} ({t("stockCount", { available: variant.availableQuantity, total: variant.totalQuantity })})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="r-renterName">{t("form.renterName")}</Label>
            <Input id="r-renterName" name="renterName" required className="h-10" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="r-renterContact">{t("form.renterContact")}</Label>
            <Input id="r-renterContact" name="renterContact" className="h-10" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="r-quantity">{t("form.quantity")}</Label>
              <Input id="r-quantity" name="quantity" type="number" min={1} defaultValue={1} required className="h-10" />
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="r-expectedReturnAt">{t("form.expectedReturnAt")}</Label>
              <Input id="r-expectedReturnAt" name="expectedReturnAt" type="date" className="h-10" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="r-notes">{t("form.notes")}</Label>
            <Textarea id="r-notes" name="notes" rows={2} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button type="submit" form="rental-form" disabled={isPending} className="bg-forest text-white hover:bg-forest/90">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
