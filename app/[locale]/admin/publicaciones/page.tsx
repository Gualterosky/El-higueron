import { setRequestLocale } from "next-intl/server"
import { AdminPostsPanel } from "@/components/admin/admin-posts-panel"
import { getAllPosts } from "@/lib/muro/post-queries"
import { getAllCampingPosts } from "@/lib/camping/post-queries"
import { getAllBoulderPosts } from "@/lib/boulder/post-queries"
import { getAllEquipmentPosts } from "@/lib/equipos/post-queries"
import { getAllReplies } from "@/lib/replies/reply-queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminPostsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [posts, campingPosts, boulderPosts, equipmentPosts, replies] = await Promise.all([
    getAllPosts(),
    getAllCampingPosts(),
    getAllBoulderPosts(),
    getAllEquipmentPosts(),
    getAllReplies(),
  ])

  return (
    <AdminPostsPanel
      initialPosts={posts}
      initialCampingPosts={campingPosts}
      initialBoulderPosts={boulderPosts}
      initialEquipmentPosts={equipmentPosts}
      initialReplies={replies}
    />
  )
}
