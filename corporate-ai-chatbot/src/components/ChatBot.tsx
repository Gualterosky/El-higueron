import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  X,
  Trees,
  MessageSquare,
  Loader2,
  Sparkles,
  MapPin,
  CalendarDays,
  CloudSun,
  Bot,
  User,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../types";

const SUGGESTIONS = [
  { icon: MapPin, text: "¿Qué zonas de camping tienen?" },
  { icon: CalendarDays, text: "¿Cuáles son los precios?" },
  { icon: CloudSun, text: "¿Cómo está el clima hoy?" },
  { icon: Sparkles, text: "Recomiéndame una actividad" },
];

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", parts: [{ text: userMessage }] },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: data.text }] },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            parts: [{ text: `⚠️ ${data.error}` }],
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: "No se pudo conectar con el servidor. Por favor revisa tu conexión.",
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:shadow-emerald-500/50 transition-shadow cursor-pointer"
          >
            <MessageSquare size={26} className="text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 z-50 w-full h-full md:bottom-6 md:right-6 md:w-[420px] md:h-[640px] md:max-h-[calc(100vh-48px)] md:rounded-3xl bg-white shadow-2xl shadow-black/10 flex flex-col overflow-hidden border border-stone-200/60"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-5 flex items-center justify-between text-white shrink-0">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm ring-2 ring-white/20">
                      <Trees size={24} className="text-emerald-100" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-emerald-700 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] tracking-tight">
                      Mr. Gaque
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-emerald-200 tracking-wide">
                        Asesor de Camping
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="relative z-10 p-2 hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-stone-50 to-white">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center py-8 px-4"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-emerald-200/50">
                      <Trees size={36} className="text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-800 mb-2">
                      ¡Hola! Soy Mr. Gaque
                    </h2>
                    <p className="text-stone-500 text-sm leading-relaxed max-w-[280px] mx-auto mb-8">
                      Tu asesor natural en Camping El Higuerón. ¿En qué
                      puedo ayudarte hoy?
                    </p>

                    {/* Quick Suggestions */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.08 }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSuggestion(s.text)}
                          className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-stone-150 text-left text-xs font-medium text-stone-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all shadow-sm cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <s.icon size={16} className="text-emerald-600" />
                          </div>
                          <span className="leading-snug">{s.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "model" && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-2 mt-1 shrink-0 shadow-sm">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 text-[13.5px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl rounded-br-md shadow-lg shadow-emerald-600/15"
                          : "bg-white text-stone-700 shadow-sm border border-stone-100 rounded-2xl rounded-bl-md"
                      }`}
                    >
                      <div
                        className={`prose prose-sm max-w-none ${
                          msg.role === "user"
                            ? "prose-invert prose-headings:text-emerald-100 prose-p:text-emerald-50"
                            : "prose-stone prose-headings:text-stone-800"
                        }`}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.parts[0].text}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-xl bg-stone-200 flex items-center justify-center ml-2 mt-1 shrink-0">
                        <User size={14} className="text-stone-500" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-2 mt-1 shrink-0 shadow-sm">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-white px-5 py-3.5 rounded-2xl rounded-bl-md border border-stone-100 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="p-4 bg-white border-t border-stone-100 shrink-0"
              >
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-3.5 pl-5 pr-14 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all outline-none placeholder:text-stone-400"
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    className="absolute right-2 p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Send size={17} />
                  </motion.button>
                </div>
                <p className="text-[10px] text-center text-stone-400 mt-3 font-medium tracking-widest uppercase">
                  Camping El Higuerón
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
