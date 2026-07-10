import ChatBot from "./components/ChatBot";

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Demo page content */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-8 ring-1 ring-emerald-200/50">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Camping El Higuerón
        </div>
        <h1 className="text-5xl font-bold text-stone-900 mb-6 tracking-tight">
          Conecta con la{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
            naturaleza
          </span>
        </h1>
        <p className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed mb-12">
          Descubre la experiencia de camping más auténtica. Nuestro asesor
          virtual está aquí para ayudarte a planificar tu próxima aventura.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-stone-400">
          <span>Haz clic en el botón para conversar</span>
          <svg
            className="w-5 h-5 text-emerald-500 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatBot />
    </div>
  );
}
