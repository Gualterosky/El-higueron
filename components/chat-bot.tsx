"use client"

import { useState, useRef, useEffect, FormEvent } from "react"
import {
  Send,
  X,
  Shrub,
  Sparkles,
  Loader2,
  Tent,
  Mountain,
  MapPin,
  CalendarCheck,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "model"
  parts: { text: string }[]
}

const AUTO_OPEN_HASH = "gaque"
const SESSION_STORAGE_KEY = "chat_session_id"

const SUGGESTION_ICONS = [Tent, CalendarCheck, Mountain, MapPin]

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (existing) return existing
    const id = crypto.randomUUID()
    sessionStorage.setItem(SESSION_STORAGE_KEY, id)
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export function ChatBot() {
  const t = useTranslations("Chat")
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const sessionIdRef = useRef<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = (t.raw("suggestions") as string[]).map((text, i) => ({
    icon: SUGGESTION_ICONS[i] ?? Tent,
    text,
  }))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId()
  }, [])

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase()
      if (hash === AUTO_OPEN_HASH) {
        setIsOpen(true)
      }
    }

    checkHash()
    window.addEventListener("hashchange", checkHash)
    return () => window.removeEventListener("hashchange", checkHash)
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isLoading, isOpen])

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 350)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")

    const newMessages: Message[] = [...messages, { role: "user", parts: [{ text: userMessage }] }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          locale,
          sessionId: sessionIdRef.current,
        }),
      })

      const data = await response.json()
      if (response.ok && data.text) {
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: data.text }] }])
      } else {
        const errMsg = data.error || t("errors.unexpected")
        setMessages((prev) => [
          {
            role: "model",
            parts: [{ text: `${t("errors.prefix")} ${errMsg}` }],
          },
        ])
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: t("errors.connection") }] },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestion = (text: string) => {
    setInput(text)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="chat-window-height absolute bottom-0 right-0 z-20 w-[calc(100vw-3rem)] sm:w-[390px] h-[600px] bg-white rounded-[1.75rem] shadow-2xl shadow-emerald-950/25 flex flex-col overflow-hidden border border-emerald-900/5 animate-pop-in origin-bottom-right">
          <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#1f4a30] via-emerald-700 to-emerald-600 px-5 py-4 flex items-center justify-between text-white">
            <div className="pointer-events-none absolute -top-10 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-white/5 blur-xl" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm ring-1 ring-white/25">
                  <Shrub size={22} className="text-emerald-50" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[15px] tracking-tight leading-none">{t("name")}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                  <span className="text-[10px] font-semibold text-emerald-100/90 uppercase tracking-widest">
                    {t("status")}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="relative z-10 p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer"
              aria-label={t("aria.close")}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-emerald-50/50 via-stone-50/40 to-white">
            {messages.length === 0 && (
              <div className="text-center py-6 px-2 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 rounded-[1.6rem] flex items-center justify-center mx-auto mb-5 shadow-inner ring-1 ring-emerald-200/60 animate-gentle-float">
                  <Shrub size={30} />
                </div>
                <h2 className="text-lg font-bold text-stone-800 mb-2">{t("welcome.title")}</h2>
                <p className="text-stone-500 text-xs max-w-[260px] mx-auto leading-relaxed mb-6">
                  {t("welcome.body")}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(s.text)}
                      className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-stone-100 text-left text-[11px] font-medium text-stone-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/60 transition-all shadow-sm cursor-pointer"
                    >
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                        <s.icon size={14} />
                      </span>
                      <span className="leading-snug">{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "model" && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
                    <Shrub size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-br-md shadow-md shadow-emerald-900/10"
                      : "bg-white text-stone-800 shadow-sm border border-stone-100 rounded-bl-md"
                  }`}
                >
                  <div className={`chat-markdown ${msg.role === "user" ? "chat-markdown-user" : "chat-markdown-bot"}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...rest }) => (
                          <div className="chat-table-wrap">
                            <table {...rest} />
                          </div>
                        ),
                      }}
                    >
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
                  <Shrub size={14} className="text-white" />
                </div>
                <div className="bg-white px-4 py-3.5 rounded-2xl rounded-bl-md border border-stone-100 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="shrink-0 p-3.5 bg-white border-t border-stone-100">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="w-full bg-stone-50 border-stone-100 border rounded-2xl py-3 pl-4 pr-12 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none placeholder:text-stone-400 text-stone-800"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 p-2 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <p className="text-[9px] text-center text-stone-400 mt-2.5 font-semibold tracking-widest uppercase">
              {t("footer")}
            </p>
          </form>
        </div>
      )}

      <span className="group relative z-10 flex h-16 w-16 items-center justify-center">
        <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-2 scale-95 whitespace-nowrap rounded-full bg-stone-900/90 px-3.5 py-2 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
          {isOpen ? t("tooltip.close") : t("tooltip.open")}
          <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-stone-900/90" />
        </span>

        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse-ring" />
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 cursor-pointer ${
            isOpen
              ? "bg-stone-800 text-white shadow-stone-900/30"
              : "bg-gradient-to-br from-[#2d5a3d] via-emerald-600 to-emerald-500 text-white shadow-emerald-900/30 ring-1 ring-white/20"
          }`}
          aria-label={isOpen ? t("aria.close") : t("aria.open")}
        >
          {isOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <span className="relative flex items-center justify-center">
              <Shrub className="h-9 w-9" strokeWidth={2} />
              <Sparkles className="absolute -top-3 -right-3 h-4 w-4 text-amber-200 drop-shadow" />
            </span>
          )}
        </button>
      </span>
    </div>
  )
}
