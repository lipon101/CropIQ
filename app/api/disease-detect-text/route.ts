import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { description, language } = await req.json()

    if (!description?.trim()) {
      return NextResponse.json({ error: "No symptoms described" }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    const prompt = `You are an expert agricultural scientist and plant pathologist with deep knowledge of Bangladesh farming practices. Your role is to help farmers and growers identify and treat plant diseases.

When a user describes symptoms, you should:
1. Identify the possible disease(s)
2. Explain the cause (fungus, bacteria, virus, pest, etc.)
3. Suggest organic and chemical treatment options
4. Give prevention tips for the future
5. Mention if the disease is common in Bangladesh

Return ONLY a valid JSON object (no markdown, no extra text):
{
  "crop_type": "name of crop",
  "disease_name": "disease name or 'Unclear - need more information'",
  "confidence": 0.85,
  "cause": "cause of disease",
  "remedy_bn": "বাংলায় চিকিৎসা পদ্ধতি",
  "remedy_en": "Treatment in English",
  "prevention_bn": "বাংলায় প্রতিরোধের উপায়",
  "prevention_en": "Prevention tips in English",
  "is_common_in_bd": true
}`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "CropIQ",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: `My crop has these symptoms: ${description}` },
        ],
        max_tokens: 600,
        temperature: 0.4,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "AI analysis failed" }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""

    let result: any
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try { result = JSON.parse(jsonMatch[0]) } catch { result = { disease_name: "Analysis Incomplete", remedy_bn: content, remedy_en: content } }
    } else {
      result = { disease_name: "Analysis Incomplete", remedy_bn: content, remedy_en: content }
    }

    return NextResponse.json({ result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 })
  }
}
