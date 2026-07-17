import { NextRequest, NextResponse } from "next/server"

const CHATBOT_SYSTEM_PROMPT = `You are CropIQ কৃষি সহায়ক, an AI farming assistant for Bangladeshi farmers.

Rules:
1. Always respond in the SAME language the user writes in
2. Be practical — suggest locally available solutions in Bangladesh
3. Be encouraging and respectful. Use simple language farmers understand.
4. Keep responses clear, well-structured but under 350 words.
5. Use **bold** for key terms, simple tables when comparing options, bullet points for lists.
6. Never use markdown h1/h2/h3 headers (##, ###) — just use bold text for section titles.
7. Suggest both organic (জৈব) and chemical (রাসায়নিক) options when relevant.

IMPORTANT — At the END of every response, append exactly 3 relevant follow-up questions the farmer might want to ask next. Format them EXACTLY like this:

---
**আরও জানতে চান?**
- First follow-up question?
- Second follow-up question?
- Third follow-up question?

The questions must be in the same language as the response and directly related to the topic.`

export async function POST(req: NextRequest) {
  try {
    const { message, language, history } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: "No message provided" }, { status: 400 })

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: "AI service not configured" }, { status: 500 })

    const langInstruction = language === "bn"
      ? "User prefers Bengali. Reply entirely in Bengali (বাংলা). The follow-up questions must also be in Bengali."
      : "User prefers English. Reply in English."

    const messages = [
      { role: "system", content: `${CHATBOT_SYSTEM_PROMPT}\n\n${langInstruction}` },
      ...(history || []).slice(-10).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message.trim() },
    ]

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "CropIQ Chatbot",
      },
      body: JSON.stringify({ model: "openrouter/free", messages, max_tokens: 800, temperature: 0.7 }),
    })

    if (!response.ok) {
      console.error("OpenRouter error:", response.status)
      return NextResponse.json({ error: "Chatbot error" }, { status: 502 })
    }

    const data = await response.json()
    let reply = data.choices?.[0]?.message?.content || (
      language === "bn" ? "দুঃখিত, আমি এখন উত্তর দিতে পারছি না।" : "Sorry, I couldn't process that."
    )

    // Parse out suggestions from the reply
    let suggestions: string[] = []
    const sugMatch = reply.match(/---\s*\n\*\*(.+?)\*\*\s*\n((?:-\s*.+\n?)+)/)
    if (sugMatch) {
      // Remove suggestions section from main reply
      reply = reply.replace(/---\s*\n\*\*(.+?)\*\*\s*\n((?:-\s*.+\n?)+)\s*$/, "").trim()
      // Extract individual suggestions
      const sugLines = sugMatch[2].match(/-\s*(.+)/g)
      if (sugLines) {
        suggestions = sugLines.map((s: string) => s.replace(/^-\s*/, "").trim()).filter(Boolean).slice(0, 3)
      }
    }

    return NextResponse.json({ reply, suggestions })
  } catch (error: any) {
    console.error("Chatbot error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
