import { setRequestLocale } from "next-intl/server"
import { AdminCommunityPanel } from "@/components/admin/admin-community-panel"
import { getAllCommunityPosts } from "@/lib/comunidad/post-queries"
import { getAllReplies } from "@/lib/replies/reply-queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminComunidadPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [posts, replies] = await Promise.all([getAllCommunityPosts(), getAllReplies()])

  return <AdminCommunityPanel initialPosts={posts} initialReplies={replies} />
}
