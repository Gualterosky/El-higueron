import { unstable_noStore as noStore } from "next/cache"
import { getApprovedCommunityPosts } from "@/lib/comunidad/post-queries"
import { getApprovedRepliesByPosts } from "@/lib/replies/reply-queries"
import {
  getCommunityDisplayStatus,
  isContactVisible,
  isCommunityActivity,
  isExperienceLevel,
} from "@/lib/comunidad/shared"
import { PostRepliesSection } from "@/components/posts/post-reply-section"
import { CommunityFeed, type CommunityFeedPost } from "@/components/comunidad/community-feed"

export async function CommunityFeedSection() {
  noStore()
  const posts = await getApprovedCommunityPosts()

  const replies = await getApprovedRepliesByPosts("comunidad", posts.map((p) => p.id))
  const repliesByPost = Object.groupBy(replies, (r) => r.postId)

  const feedPosts: CommunityFeedPost[] = posts.map((post) => {
    const displayStatus = getCommunityDisplayStatus(post)
    const contactVisible = isContactVisible(displayStatus)

    return {
      id: post.id,
      activity: isCommunityActivity(post.activity) ? post.activity : "otro",
      eventDate: post.eventDate,
      displayStatus,
      locationText: post.locationText,
      level: post.level && isExperienceLevel(post.level) ? post.level : null,
      gradeDetail: post.gradeDetail,
      logisticsTags: post.logisticsTags ?? [],
      maxParticipants: post.maxParticipants,
      notes: post.notes,
      authorName: post.authorName,
      // Blanked out server-side (not just hidden with CSS) once the plan is
      // cancelled or its date has passed — see system_architecture.md.
      contactInfo: contactVisible ? post.contactInfo : null,
      replies: (
        <PostRepliesSection
          postId={post.id}
          postType="comunidad"
          initialReplies={repliesByPost[post.id] ?? []}
        />
      ),
    }
  })

  return <CommunityFeed posts={feedPosts} />
}
