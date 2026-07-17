import { NextRequest, NextResponse } from "next/server"

const CHATBOT_SYSTEM_PROMPT = `You are CropIQ কৃষি সহায়ক, an AI farming assistant for Bangladeshi farmers. You help with:
- Crop disease identification and treatment
- Planting and harvesting advice based on seasons
- Fertilizer and pesticide recommendations
- Irrigation and water management
- Market information and crop selection
- Organic farming practices

Rules:
1. Always respond in the SAME language the user writes in (Bangla or English)
2. If the user writes in Bangla, reply in Bangla with occasional English technical terms in parentheses
3. Be practical — suggest locally available solutions in Bangladesh
4. Be encouraging and respectful to farmers
5. If you don't know something, say so honestly
6. Keep responses concise (under 400 words unless detailed explanation is needed)
7. For disease questions, ask about specific symptoms before diagnosing
8. Suggest both organic (জৈব) and chemical (রাসায়নিক) options when relevant
9. Format responses with clear sections using bullet points or numbered lists when helpful

You have knowledge about:
- Rice (ধান): blast, bacterial blight, tungro, stem borer, brown planthopper
- Wheat (গম): rust, leaf blight, aphids
- Potato (আলু): late blight, scab, cutworm
- Vegetables (সবজি): various pests and diseases
- Jute (পাট): stem rot, anthracnose
- Fruits (ফল): mango hopper, banana wilt, papaya ringspot virus`

export async function POST(req: NextRequest) {
  try {
    const { message, language, history } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    const langInstruction =
      language === "bn"
        ? "User prefers Bengali. Reply in Bengali (বাংলা)."
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
      body: JSON.stringify({
        model: "openrouter/free",
        messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error("OpenRouter chatbot error:", response.status, errText)
      return NextResponse.json({ error: "Chatbot error" }, { status: 502 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || (
      language === "bn"
        ? "দুঃখিত, আমি এখন উত্তর দিতে পারছি না। আবার চেষ্টা করুন।"
        : "Sorry, I couldn't process that. Please try again."
    )

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("Chatbot error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
