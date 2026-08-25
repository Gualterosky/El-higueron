import { setRequestLocale } from "next-intl/server"
import { AdminChatPanel } from "@/components/admin/admin-chat-panel"
import { getAllChatSessions } from "@/lib/chat/chat-queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminChatbotPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const sessions = await getAllChatSessions()

  return <AdminChatPanel initialSessions={sessions} />
}
