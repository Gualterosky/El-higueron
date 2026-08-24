import { setRequestLocale } from "next-intl/server"
import { AdminPostsPanel } from "@/components/admin/admin-posts-panel"
import { getAllPosts } from "@/lib/muro/post-queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminPostsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = await getAllPosts()

  return <AdminPostsPanel initialPosts={posts} />
}
