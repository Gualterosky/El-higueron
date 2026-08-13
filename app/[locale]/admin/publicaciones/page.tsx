import { setRequestLocale } from "next-intl/server"
import { AdminPostsPanel } from "@/components/admin/admin-posts-panel"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminPostsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AdminPostsPanel />
}
