"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, ChevronUp, MessageSquare, Shrub } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getChatMessagesAction } from "@/lib/chat/chat-actions"
import type { ChatMessage, ChatSession } from "@/lib/db/schema"

type SessionWithCount = ChatSession & { messageCount: number }

function SessionRow({ session }: { session: SessionWithCount }) {
  const t = useTranslations("Panel.chatbot")
  const [expanded, setExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    if (!expanded && messages === null) {
      setLoading(true)
      const msgs = await getChatMessagesAction(session.id)
      setMessages(msgs)
      setLoading(false)
    }
    setExpanded((v) => !v)
  }

  const shortId = session.id.slice(0, 8).toUpperCase()
  const localeName = t(`locales.${session.locale as "es" | "en"}`)

  return (
    <div className="rounded-xl border border-border/60 bg-beige/20 overflow-hidden">
      {/* Session header row */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest text-white">
          <MessageSquare className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-sm font-semibold text-forest">
            {t("sessionLabel")} <span className="font-mono text-xs">{shortId}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {t("dateLabel")}:{" "}
            {new Date(session.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {session.createdAt.getTime() !== session.updatedAt.getTime() && (
              <>
                {" · "}
                {t("lastActivityLabel")}:{" "}
                {new Date(session.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="text-xs">
            {localeName}
          </Badge>
          <Badge variant="outline" className="text-xs font-semibold">
            {session.messageCount} {t("messagesLabel")}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={loading}
            className="gap-1 text-xs"
            aria-label={expanded ? t("collapse") : t("expand")}
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent" />
            ) : expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{expanded ? t("collapse") : t("expand")}</span>
          </Button>
        </div>
      </div>

      {/* Expanded conversation */}
      {expanded && messages !== null && (
        <div className="border-t border-border/40 bg-white/60 px-4 py-4 sm:px-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={msg.id} className="space-y-2">
              {/* User question */}
              <div className="flex items-start gap-2 justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-forest px-3.5 py-2.5 text-white text-sm shadow-sm">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                    {t("userQuestion")} · #{i + 1}
                  </p>
                  <p className="leading-relaxed">{msg.userMessage}</p>
                </div>
              </div>
              {/* Bot response */}
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 mt-1 shadow-sm">
                  <Shrub className="h-3.5 w-3.5 text-white" />
                </span>
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-stone-100 bg-white px-3.5 py-2.5 text-sm shadow-sm">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("botAnswer")}
                  </p>
                  <p className="leading-relaxed whitespace-pre-wrap text-stone-800">
                    {msg.botResponse}
                  </p>
                  <p className="mt-1.5 text-[10px] text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminChatPanel({ initialSessions }: { initialSessions: SessionWithCount[] }) {
  const t = useTranslations("Panel.chatbot")

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-forest">{t("title")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      {initialSessions.length === 0 ? (
        <p
          className={cn(
            "rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground"
          )}
        >
          {t("noResults")}
        </p>
      ) : (
        <div className="space-y-3">
          {initialSessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}
