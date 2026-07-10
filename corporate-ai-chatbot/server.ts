import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Helper function to get system instructions from the markdown file
function getSystemInstructions(): string {
  const filePath = path.join(process.cwd(), "Memoria Camping_El_Higueron.md");
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  } catch (error) {
    console.error("Error reading memory file:", error);
  }
  
  // Fallback instructions if file is missing
  return `
Eres "Mr. Gaque", el sabio y cálido asesor virtual de "Camping El Higuerón".
Responde siempre en español y de manera amable.
Si no tienes información específica, invita al usuario a contactar por WhatsApp: +57 3172973537.
`;
}

app.use(express.json());

// API routes
  app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
      return res.status(500).json({ 
        error: "API Key de OpenAI no configurada en los Secrets de AI Studio." 
      });
    }

    // Convert history to OpenAI format
    const messages = [
      { role: "system", content: getSystemInstructions() },
      ...history.map((msg: any) => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.parts[0].text,
      })),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any,
    });

    const text = completion.choices[0].message.content;

    res.json({ text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    let errorMessage = "El servicio de OpenAI no está disponible en este momento.";
    
    if (error.status === 429) {
      errorMessage = "Has agotado tu cuota de OpenAI o el límite de velocidad. Revisa tu facturación o créditos.";
    } else if (error.status === 401) {
      errorMessage = "La API Key de OpenAI no es válida o ha expirado.";
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Vite middleware for development
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
