import { setRequestLocale } from "next-intl/server"
import { requireRole } from "@/lib/auth/session"
import { AdminContactsPanel } from "@/components/admin/admin-contacts-panel"
import { getContactsForAdmin } from "@/lib/contacts/queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminContactsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await requireRole(locale, ["administrador"])
  const contacts = await getContactsForAdmin()

  return <AdminContactsPanel contacts={contacts} />
}
