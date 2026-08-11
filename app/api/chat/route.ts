import { NextResponse } from "next/server"
import OpenAI from "openai"
import fs from "fs"
import path from "path"
import esMessages from "@/messages/es.json"
import enMessages from "@/messages/en.json"

const chatErrors = {
  es: esMessages.Chat.api,
  en: enMessages.Chat.api,
} as const

function getSystemInstructions(locale: string): string {
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

export async function POST(req: Request) {
  try {
    const { message, history, locale: bodyLocale } = await req.json()
    const locale = bodyLocale === "en" ? "en" : "es"
    const errors = chatErrors[locale]

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === "") {
      return NextResponse.json({ error: errors.missingKey }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = getSystemInstructions(locale)

    const formattedHistory = (history || []).map((msg: { role?: string; parts?: { text?: string }[]; content?: string }) => {
      const text = msg.parts?.[0]?.text || msg.content || ""
      return {
        role: msg.role === "model" || msg.role === "assistant" ? "assistant" : "user",
        content: text,
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

    return NextResponse.json({ text })
  } catch (error: unknown) {
    console.error("Chat API Error:", error)
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status) || 500
        : 500
    const details =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: string }).message)
        : String(error)

    const localeHint = "es"
    const errors = chatErrors[localeHint]
    let errorMessage = errors.unavailable
    if (status === 429) errorMessage = errors.quota
    else if (status === 401) errorMessage = errors.invalidKey

    return NextResponse.json(
      { error: `${errorMessage} (Detalles: ${details})` },
      { status }
    )
  }
}
