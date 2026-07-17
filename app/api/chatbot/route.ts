import { NextRequest, NextResponse } from "next/server"

const CHATBOT_SYSTEM_PROMPT = `তুমি CropIQ কৃষি সহায়ক — বাংলাদেশের কৃষকদের জন্য এআই কৃষি পরামর্শক।

তোমার কাজ:
- ফসলের রোগ সনাক্তকরণ ও চিকিৎসা পরামর্শ
- চাষাবাদ ও ফসল কাটার সময় বিষয়ক পরামর্শ
- সার ও কীটনাশক সংক্রান্ত পরামর্শ
- সেচ ও পানি ব্যবস্থাপনা
- বাজার তথ্য ও ফসল নির্বাচন
- জৈব কৃষি পদ্ধতি

নিয়মাবলী:
1. সবসময় বাংলায় উত্তর দেবে
2. সহজ ভাষায় লিখবে যেন কৃষক সহজে বুঝতে পারে
3. বাংলাদেশের স্থানীয় সমাধান সুপারিশ করবে
4. কৃষকদের উৎসাহিত করবে ও সম্মান দেখাবে
5. কিছু না জানলে সততার সাথে বলবে
6. উত্তর ৩৫০ শব্দের মধ্যে রাখবে
7. জৈব ও রাসায়নিক উভয় পদ্ধতির পরামর্শ দেবে
8. টেবিল ও তালিকা ব্যবহার করে পরিষ্কারভাবে তথ্য উপস্থাপন করবে

গুরুত্বপূর্ণ — প্রতিটি উত্তরের শেষে ৩টি ফলো-আপ প্রশ্ন যোগ করবে এই ফরম্যাটে:

---
**আরও জানতে চান?**
- প্রথম প্রশ্ন?
- দ্বিতীয় প্রশ্ন?
- তৃতীয় প্রশ্ন?`

export async function POST(req: NextRequest) {
  try {
    const { message, language, history } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: "কোন বার্তা প্রদান করা হয়নি" }, { status: 400 })

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const messages = [
      { role: "system", content: CHATBOT_SYSTEM_PROMPT },
      ...(history || []).slice(-10).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message.trim() },
    ]

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "CropIQ",
      },
      body: JSON.stringify({ model: "openrouter/free", messages, max_tokens: 800, temperature: 0.7 }),
    })

    if (!response.ok) {
      console.error("OpenRouter error:", response.status)
      return NextResponse.json({ error: "চ্যাটবট সমস্যা — আবার চেষ্টা করুন" }, { status: 502 })
    }

    const data = await response.json()
    let reply = data.choices?.[0]?.message?.content || "দুঃখিত, এখন উত্তর দিতে পারছি না। আবার চেষ্টা করুন।"

    // Parse suggestions
    let suggestions: string[] = []
    const sugMatch = reply.match(/---\s*\n\*\*(.+?)\*\*\s*\n((?:-\s*.+\n?)+)/)
    if (sugMatch) {
      reply = reply.replace(/---\s*\n\*\*(.+?)\*\*\s*\n((?:-\s*.+\n?)+)\s*$/, "").trim()
      const sugLines = sugMatch[2].match(/-\s*(.+)/g)
      if (sugLines) {
        suggestions = sugLines.map((s: string) => s.replace(/^-\s*/, "").trim()).filter(Boolean).slice(0, 3)
      }
    }

    return NextResponse.json({ reply, suggestions })
  } catch (error: any) {
    console.error("চ্যাটবট ত্রুটি:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
