import { NextResponse } from "next/server"
import OpenAI from "openai"
import fs from "fs"
import path from "path"

// Helper function to read instructions from the markdown file
function getSystemInstructions(): string {
  const filePath = path.join(process.cwd(), "public", "Memoria_Camping_El_Higueron.md")
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8")
    }
  } catch (error) {
    console.error("Error reading memory file:", error)
  }

  // Fallback instructions if file is missing
  return `
Eres "Mr. Gaque", el sabio y cálido asesor virtual de "Camping El Higuerón" en Choachí, Cundinamarca.
Responde siempre en español y de manera amable.
Si no tienes información específica o no está en la base de conocimientos, responde textualmente:
"Lo siento, no tengo esa información registrada en este momento. Por favor, comunícate directamente a nuestras líneas de atención autorizadas para brindarte soporte detallado."
e invita al usuario a contactar por WhatsApp: +57 3172973537.
`
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === "") {
      return NextResponse.json(
        { 
          error: "API Key de OpenAI no configurada. Por favor, configúrala en el archivo .env.local como OPENAI_API_KEY." 
        },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = getSystemInstructions()

    // Format chat history for OpenAI chat completions
    const formattedHistory = (history || []).map((msg: any) => {
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
      messages: messages as any,
    })

    const text = completion.choices[0]?.message?.content || ""

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error("Chat API Error:", error)
    
    let errorMessage = "El servicio de chat no está disponible en este momento."
    if (error.status === 429) {
      errorMessage = "Has agotado tu cuota de OpenAI o límite de velocidad. Revisa tu facturación o créditos."
    } else if (error.status === 401) {
      errorMessage = "La API Key de OpenAI no es válida o ha expirado."
    }

    return NextResponse.json(
      { error: `${errorMessage} (Detalles: ${error.message || error})` },
      { status: error.status || 500 }
    )
  }
}
