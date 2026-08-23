import { setRequestLocale } from "next-intl/server"
import { AdminPostsPanel } from "@/components/admin/admin-posts-panel"
import { getAllPostsAction } from "@/lib/muro/post-actions"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminPostsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = await getAllPostsAction()

  return <AdminPostsPanel initialPosts={posts} />
}
