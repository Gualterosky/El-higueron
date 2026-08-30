"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { KeyRound, Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  createUserAction,
  updateUserAction,
  deleteUserAction,
  resetUserPasswordAction,
  type UserRow,
  type CreateUserInput,
} from "@/lib/auth/user-actions"
import type { Role } from "@/lib/auth/roles"

type Props = {
  initialUsers: UserRow[]
}

export function AdminUsersPanel({ initialUsers }: Props) {
  const t = useTranslations("Panel.users")
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)

  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null)
  const [resetUser, setResetUser] = useState<UserRow | null>(null)

  function handleCreated(newUser: UserRow) {
    setUsers((prev) => [...prev, newUser])
    setCreateOpen(false)
    router.refresh()
  }

  function handleUpdated(updated: UserRow) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    setEditUser(null)
    router.refresh()
  }

  function handleDeleted(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    setDeleteUser(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
          <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
        </div>
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="shrink-0 gap-2 bg-forest text-white hover:bg-forest/90"
        >
          <Plus className="h-4 w-4" />
          {t("create")}
        </Button>
      </div>

      {users.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        <TooltipProvider delayDuration={300}>
          <div className="overflow-x-auto rounded-xl border border-border/60">
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
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(`roles.${u.role}`)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={u.banned ? "destructive" : "default"}
                        className={u.banned ? undefined : "border-transparent bg-forest text-white"}
                      >
                        {u.banned ? t("status.banned") : t("status.active")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {/* Reset password */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setResetUser(u)}
                              disabled={u.role === "administrador"}
                              aria-label={t("resetButton")}
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("resetButton")}</TooltipContent>
                        </Tooltip>

                        {/* Edit */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditUser(u)}
                              disabled={u.role === "administrador"}
                              aria-label={t("edit")}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("edit")}</TooltipContent>
                        </Tooltip>

                        {/* Delete */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteUser(u)}
                              disabled={u.role === "administrador"}
                              aria-label={t("delete")}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("delete")}</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      )}

      {/* Create dialog */}
      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />

      {/* Edit dialog */}
      {editUser && (
        <EditUserDialog
          user={editUser}
          open={!!editUser}
          onOpenChange={(open) => { if (!open) setEditUser(null) }}
          onUpdated={handleUpdated}
        />
      )}

      {/* Reset password confirmation */}
      {resetUser && (
        <ResetPasswordDialog
          user={resetUser}
          open={!!resetUser}
          onOpenChange={(open) => { if (!open) setResetUser(null) }}
          onReset={() => setResetUser(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteUser && (
        <DeleteUserDialog
          user={deleteUser}
          open={!!deleteUser}
          onOpenChange={(open) => { if (!open) setDeleteUser(null) }}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
}

// ── Create dialog ─────────────────────────────────────────────────────────────

function CreateUserDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (user: UserRow) => void
}) {
  const t = useTranslations("Panel.users")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState<Role>("visitante")
  const [mustChangePassword, setMustChangePassword] = useState(true)

  function handleOpenChange(open: boolean) {
    if (!isPending) {
      setError(null)
      setRole("visitante")
      setMustChangePassword(true)
      onOpenChange(open)
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")

    if (!name || !email || !password) return

    const input: CreateUserInput = { name, email, password, role, mustChangePassword }

    startTransition(async () => {
      const result = await createUserAction(input)
      if (!result.ok) {
        const errKey = (result as { ok: false; error: string }).error
        setError(t(`createDialog.errors.${errKey}` as Parameters<typeof t>[0]) ?? t("createDialog.errors.create_failed"))
        return
      }
      onCreated({
        id: crypto.randomUUID(),
        name,
        email,
        role,
        banned: false,
        createdAt: new Date(),
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("createDialog.title")}</DialogTitle>
          <DialogDescription>{t("createDialog.description")}</DialogDescription>
        </DialogHeader>

        <form id="create-user-form" onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-name">{t("createDialog.name")}</Label>
            <Input
              id="cu-name"
              name="name"
              type="text"
              autoComplete="off"
              required
              className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-email">{t("createDialog.email")}</Label>
            <Input
              id="cu-email"
              name="email"
              type="email"
              autoComplete="off"
              required
              className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-password">{t("createDialog.password")}</Label>
            <Input
              id="cu-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={7}
              className="h-10 border-border bg-beige/50 focus-visible:ring-forest"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-role">{t("createDialog.role")}</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger id="cu-role" className="h-10 border-border bg-beige/50 focus:ring-forest">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visitante">{t("roles.visitante")}</SelectItem>
                <SelectItem value="staff">{t("roles.staff")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <Label htmlFor="cu-mcp" className="cursor-pointer text-sm font-normal">
              {t("createDialog.mustChangePassword")}
            </Label>
            <Switch
              id="cu-mcp"
              checked={mustChangePassword}
              onCheckedChange={setMustChangePassword}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            {t("createDialog.cancel")}
          </Button>
          <Button
            type="submit"
            form="create-user-form"
            disabled={isPending}
            className="bg-forest text-white hover:bg-forest/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("createDialog.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Edit dialog ───────────────────────────────────────────────────────────────

function EditUserDialog({
  user: targetUser,
  open,
  onOpenChange,
  onUpdated,
}: {
  user: UserRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: (user: UserRow) => void
}) {
  const t = useTranslations("Panel.users")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState<Role>(targetUser.role)
  const [banned, setBanned] = useState(targetUser.banned)

  function handleOpenChange(open: boolean) {
    if (!isPending) {
      setError(null)
      onOpenChange(open)
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await updateUserAction({ id: targetUser.id, role, banned })
      if (!result.ok) {
        const errKey = (result as { ok: false; error: string }).error
        setError(t(`editDialog.errors.${errKey}` as Parameters<typeof t>[0]) ?? t("editDialog.errors.update_failed"))
        return
      }
      onUpdated({ ...targetUser, role, banned })
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("editDialog.title")}</DialogTitle>
          <DialogDescription>{t("editDialog.description")}</DialogDescription>
        </DialogHeader>

        <form id="edit-user-form" onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
            <p className="font-medium text-foreground">{targetUser.name}</p>
            <p className="text-muted-foreground">{targetUser.email}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eu-role">{t("editDialog.role")}</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger id="eu-role" className="h-10 border-border bg-beige/50 focus:ring-forest">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visitante">{t("roles.visitante")}</SelectItem>
                <SelectItem value="staff">{t("roles.staff")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
              <Label htmlFor="eu-banned" className="cursor-pointer text-sm font-normal">
                {t("editDialog.banned")}
              </Label>
              <Switch
                id="eu-banned"
                checked={banned}
                onCheckedChange={setBanned}
              />
            </div>
            <p className="px-1 text-xs text-muted-foreground">{t("editDialog.bannedDescription")}</p>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            {t("editDialog.cancel")}
          </Button>
          <Button
            type="submit"
            form="edit-user-form"
            disabled={isPending}
            className="bg-forest text-white hover:bg-forest/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("editDialog.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Reset password dialog ─────────────────────────────────────────────────────

function ResetPasswordDialog({
  user: targetUser,
  open,
  onOpenChange,
  onReset,
}: {
  user: UserRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onReset: () => void
}) {
  const t = useTranslations("Panel.users")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleReset() {
    setError(null)
    startTransition(async () => {
      const result = await resetUserPasswordAction(targetUser.id)
      if (!result.ok) {
        const errKey = (result as { ok: false; error: string }).error
        setError(t(`resetDialog.errors.${errKey}` as Parameters<typeof t>[0]) ?? t("resetDialog.errors.reset_failed"))
        return
      }
      toast.success(t("resetDialog.successToast"))
      onReset()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => { if (!isPending) { setError(null); onOpenChange(open) } }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("resetDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("resetDialog.description", { name: targetUser.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("resetDialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleReset()
            }}
            disabled={isPending}
            className="bg-forest text-white hover:bg-forest/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("resetDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ── Delete confirmation dialog ────────────────────────────────────────────────

function DeleteUserDialog({
  user: targetUser,
  open,
  onOpenChange,
  onDeleted,
}: {
  user: UserRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: (id: string) => void
}) {
  const t = useTranslations("Panel.users")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteUserAction(targetUser.id)
      if (!result.ok) {
        const errKey = (result as { ok: false; error: string }).error
        setError(t(`deleteDialog.errors.${errKey}` as Parameters<typeof t>[0]) ?? t("deleteDialog.errors.delete_failed"))
        return
      }
      onDeleted(targetUser.id)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => { if (!isPending) { setError(null); onOpenChange(open) } }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDialog.description", { name: targetUser.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("deleteDialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("deleteDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
