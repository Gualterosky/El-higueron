import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X, Trees, MessageSquare, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../types";

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", parts: [{ text: userMessage }] }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages 
        }),
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: "model", parts: [{ text: data.text }] }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { 
          role: "model", 
          parts: [{ text: `⚠️ ${data.error}` }] 
        }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "model", 
        parts: [{ text: "No se pudo conectar con el servidor. Por favor revisa tu conexión." }] 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-100/50">
      {/* Header */}
      <div className="bg-emerald-700 p-5 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Trees size={22} className="text-emerald-50" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight">Mr. Gaque</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-medium opacity-90 uppercase tracking-widest">Asesor de Camping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
        {messages.length === 0 && (
          <div className="text-center py-20 px-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trees size={40} />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-3">¡Hola! Soy Mr. Gaque</h2>
            <p className="text-stone-500 max-w-xs mx-auto leading-relaxed">
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
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-900/10"
                  : "bg-white text-stone-800 shadow-sm border border-stone-100 rounded-tl-none"
              }`}
            >
              <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-stone'}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.parts[0].text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-stone-100 rounded-tl-none shadow-sm">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-stone-100">
        <div className="relative flex items-center max-w-xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Conversa con Mr. Gaque..."
            className="w-full bg-stone-50 border-stone-100 border rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-900/10 active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-stone-400 mt-4 font-medium tracking-wide">
          ASESOR NATURAL • CAMPING EL HIGUERÓN
        </p>
      </form>
    </div>
  );
}
