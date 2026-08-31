import { NextResponse } from "next/server"
import OpenAI from "openai"
import fs from "fs"
import path from "path"
import esMessages from "@/messages/es.json"
import enMessages from "@/messages/en.json"
import { db } from "@/lib/db"
import { chatMessage, chatSession } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const chatErrors = {
  es: esMessages.Chat.api,
  en: enMessages.Chat.api,
} as const

const MAX_MESSAGE_LENGTH = 2000
const MAX_HISTORY_MESSAGES = 20

// Knowledge base files rarely change at runtime; read them once per server
// instance instead of hitting the filesystem on every chat request.
const knowledgeCache = new Map<string, string>()

function loadKnowledge(locale: string): string {
  const cached = knowledgeCache.get(locale)
  if (cached !== undefined) return cached

  const isEn = locale === "en"
  const preferredPath = path.join(
    process.cwd(),
    "public",
    isEn ? "Memoria_Camping_El_Higueron.en.md" : "Memoria_Camping_El_Higueron.md"
  )
  const fallbackPath = path.join(process.cwd(), "public", "Memoria_Camping_El_Higueron.md")

  let knowledge = ""
  try {
    const filePath = fs.existsSync(preferredPath) ? preferredPath : fallbackPath
    if (fs.existsSync(filePath)) {
      knowledge = fs.readFileSync(filePath, "utf-8")
    }
  } catch (error) {
    console.error("Error reading memory file:", error)
  }

  knowledgeCache.set(locale, knowledge)
  return knowledge
}

function getSystemInstructions(locale: string): string {
  const isEn = locale === "en"
  const knowledge = loadKnowledge(locale)

  const languageRule = isEn
    ? `Always respond in English, warmly and clearly. If the knowledge base is in Spanish, translate facts into natural English. Keep proper nouns (El Higuerón, Bendito Sea, Choachí) unchanged.`
    : `Responde siempre en español y de manera amable.`

  if (!knowledge) {
    return `
Eres "Mr. Gaque", el sabio y cálido asesor virtual de "Camping El Higuerón" en Choachí, Cundinamarca.
${languageRule}
Si no tienes información específica o no está en la base de conocimientos, responde:
"Lo siento, no tengo esa información registrada en este momento. Por favor, comunícate directamente a nuestras líneas de atención autorizadas para brindarte soporte detallado."
e invita al usuario a contactar por WhatsApp: +57 3172973537.
`
  }

  return `${languageRule}\n\n${knowledge}`
}

// Reuse a single OpenAI client across requests instead of constructing one each time.
let openaiClient: OpenAI | null = null

function getOpenAiClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === "") {
    return null
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openaiClient
}

/** Persist the session (upsert) and save the message pair — errors are swallowed so they never break the chat. */
async function logChatMessage(opts: {
  sessionId: string
  locale: string
  userAgent: string | null
  userMessage: string
  botResponse: string
}) {
  try {
    const { sessionId, locale, userAgent, userMessage, botResponse } = opts

    const existing = await db
      .select({ id: chatSession.id })
      .from(chatSession)
      .where(eq(chatSession.id, sessionId))
      .limit(1)

    const now = new Date()

    if (existing.length === 0) {
      await db.insert(chatSession).values({
        id: sessionId,
        locale,
        userAgent,
        createdAt: now,
        updatedAt: now,
      })
    } else {
      await db
        .update(chatSession)
        .set({ updatedAt: now, locale })
        .where(eq(chatSession.id, sessionId))
    }

    await db.insert(chatMessage).values({
      id: crypto.randomUUID(),
      sessionId,
      userMessage,
      botResponse,
      createdAt: now,
    })
  } catch (err) {
    console.error("Chat logging error:", err)
  }
}

export async function POST(req: Request) {
  let locale: "es" | "en" = "es"

  try {
    const body = await req.json()
    const { message, history, locale: bodyLocale, sessionId } = body
    locale = bodyLocale === "en" ? "en" : "es"
    const errors = chatErrors[locale]

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: errors.missingKey }, { status: 400 })
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: errors.missingKey }, { status: 413 })
    }

    const openai = getOpenAiClient()
    if (!openai) {
      return NextResponse.json({ error: errors.missingKey }, { status: 500 })
    }

    const systemPrompt = getSystemInstructions(locale)

    const formattedHistory = (Array.isArray(history) ? history : [])
      .slice(-MAX_HISTORY_MESSAGES)
      .map((msg: { role?: string; parts?: { text?: string }[]; content?: string }) => {
        const text = msg.parts?.[0]?.text || msg.content || ""
        return {
          role: msg.role === "model" || msg.role === "assistant" ? "assistant" : "user",
          content: String(text).slice(0, MAX_MESSAGE_LENGTH),
        }
      })

    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    })

    const text = completion.choices[0]?.message?.content || ""

    // Persist conversation asynchronously — never fail the response over this
    if (sessionId && typeof sessionId === "string" && sessionId.length > 0) {
      const userAgent = req.headers.get("user-agent")
      void logChatMessage({ sessionId, locale, userAgent, userMessage: message, botResponse: text })
    }

    return NextResponse.json({ text })
  } catch (error: unknown) {
    console.error("Chat API Error:", error)
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status) || 500
        : 500

    const errors = chatErrors[locale]
    let errorMessage = errors.unavailable
    if (status === 429) errorMessage = errors.quota
    else if (status === 401) errorMessage = errors.invalidKey

    // Do not leak internal error details (API messages, stack info) to the client.
    return NextResponse.json({ error: errorMessage }, { status })
  }
}
