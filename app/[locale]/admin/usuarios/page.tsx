import { setRequestLocale } from "next-intl/server"
import { AdminUsersPanel } from "@/components/admin/admin-users-panel"
import { listUsersAction } from "@/lib/auth/user-actions"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminUsersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const result = await listUsersAction()
  const users = result.ok ? result.data : []

  return <AdminUsersPanel initialUsers={users} />
}
