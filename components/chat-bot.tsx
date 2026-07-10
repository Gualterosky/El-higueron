"use client"

import { useState, useRef, useEffect, FormEvent } from "react"
import { Send, X, Trees, Loader2, MessageSquare } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "model"
  parts: { text: string }[]
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Auto-scroll when messages update or loading state changes
  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isLoading, isOpen])

  // Close on click outside
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
          history: messages 
        }),
      })

      const data = await response.json()
      if (response.ok && data.text) {
        setMessages(prev => [...prev, { role: "model", parts: [{ text: data.text }] }])
      } else {
        const errMsg = data.error || "Ocurrió un error inesperado al procesar tu solicitud."
        setMessages(prev => [...prev, { 
          role: "model", 
          parts: [{ text: `⚠️ **Error:** ${errMsg}` }] 
        }])
      }
    } catch (error: any) {
      console.error("Chat error:", error)
      setMessages(prev => [...prev, { 
        role: "model", 
        parts: [{ text: "No se pudo conectar con el servidor. Por favor revisa tu conexión." }] 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-100/50 animate-fade-in-up origin-bottom-right transition-all">
          {/* Header */}
          <div className="bg-emerald-700 p-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Trees size={20} className="text-emerald-50" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm tracking-tight">Mr. Gaque</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[9px] font-semibold opacity-90 uppercase tracking-widest">Asesor de Camping</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Cerrar chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
            {messages.length === 0 && (
              <div className="text-center py-10 px-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Trees size={32} />
                </div>
                <h2 className="text-lg font-bold text-stone-800 mb-2">¡Hola! Soy Mr. Gaque</h2>
                <p className="text-stone-500 text-xs max-w-xs mx-auto leading-relaxed">
                  Bienvenido a Camping El Higuerón. ¿En qué rincón de la naturaleza te gustaría perderte hoy?
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-900/5"
                      : "bg-white text-stone-800 shadow-sm border border-stone-100 rounded-tl-none"
                  }`}
                >
                  <div className={`prose prose-xs sm:prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-white' : 'prose-stone text-stone-800'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-stone-100 rounded-tl-none shadow-sm">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-stone-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Conversa con Mr. Gaque..."
                className="w-full bg-stone-50 border-stone-100 border rounded-2xl py-3 pl-4 pr-12 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none placeholder:text-stone-400 text-stone-850"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[9px] text-center text-stone-400 mt-2 font-medium tracking-wide">
              ASESOR NATURAL • CAMPING EL HIGUERÓN
            </p>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 hover:bg-emerald-800 cursor-pointer"
        aria-label="Abrir chat de Mr. Gaque"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  )
}
