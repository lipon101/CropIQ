import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const language = (formData.get("language") as string) || "bn"

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    // Call OpenRouter with vision
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    const prompt = `You are an expert agricultural scientist and plant pathologist with deep knowledge of Bangladesh farming practices. Analyze this crop photo carefully and identify the crop type and any diseases.

Return ONLY a valid JSON object (no markdown, no extra text) in this exact format:
{
  "crop_type": "name of crop in English",
  "disease_name": "disease name or 'Healthy'",
  "confidence": 0.95,
  "cause": "cause of disease (fungus/bacteria/virus/pest/nutrient deficiency)",
  "remedy_bn": "চিকিৎসা ও ঔষধের নাম বাংলায় বিস্তারিত লিখুন",
  "remedy_en": "Detailed treatment in English with medicine names",
  "prevention_bn": "প্রতিরোধের উপায় বাংলায় লিখুন",
  "prevention_en": "Prevention tips in English",
  "is_common_in_bd": true
}

Be accurate and specific to Bangladesh crops. Local disease names in Bengali are important.`

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
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${file.type || "image/jpeg"};base64,${base64}` },
              },
              { type: "text", text: "Identify this crop and any disease. Reply ONLY with JSON." },
            ],
          },
        ],
        max_tokens: 600,
        temperature: 0.2,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error("OpenRouter error:", response.status, errText)
      return NextResponse.json({ error: "AI analysis failed. Try with a clearer photo." }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""

    // Extract JSON from response
    let result: any
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[0])
      } catch {
        result = {
          crop_type: "Unknown",
          disease_name: "Analysis Incomplete",
          confidence: 0,
          cause: "",
          remedy_bn: content,
          remedy_en: content,
          prevention_bn: "",
          prevention_en: "",
          is_common_in_bd: false,
        }
      }
    } else {
      result = {
        crop_type: "Unknown",
        disease_name: "Could not determine",
        confidence: 0,
        cause: "N/A",
        remedy_bn: content,
        remedy_en: content,
        prevention_bn: "",
        prevention_en: "",
        is_common_in_bd: false,
      }
    }

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error("Disease detect error:", error)
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 })
  }
}
