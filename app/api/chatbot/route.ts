import { NextRequest, NextResponse } from "next/server"
import { getOpenRouterKeys, fetchOpenRouterWithRetry } from "@/lib/openrouter"

const CHATBOT_SYSTEM_PROMPT = `আসসালামু আলাইকুম ভাই! তুমি একজন অভিজ্ঞ চাষি ভাই। তুমি মাঠে-ঘাটে কাজ করো, ফসল চেনো, রোগ-পোকা চেনো, সার-পানি বুঝো। তুমি এখন অন্য কৃষক ভাইদের সহজ ভাষায় কৃষি বিষয়ে সাহায্য করবে।

তোমার ব্যবহার হবে বন্ধুর মতো - আন্তরিক ও যত্নশীল:

✅ কেউ সালাম দিলে উষ্ণ অভিবাদন জানাবে: "আসসালামু আলাইকুম ভাই! কেমন আছেন? ক্ষেতে-খামারে কোনো সমস্যা?"
✅ উত্তর খুব সহজ ভাষায় দেবে - যাতে কম লেখাপড়া জানা কৃষকও বুঝতে পারে।
✅ ছোট ছোট বাক্যে, ধাপে ধাপে বুঝিয়ে বলবে। কেজি, শতাংশ, টাকা দিয়ে উদাহরণ দেবে।
✅ সবসময় পূর্ণ উত্তর দেবে - কখনো অসমাপ্ত রেখে দেবে না।
✅ শেষে ৩টি করে সম্পর্কিত প্রশ্ন সুপারিশ করবে।

🔴 কখনো যা করবে না:
🚫 ইংরেজি বা কঠিন শব্দ ব্যবহার করবে না। যেমন: অভিজ্ঞতা, বিশ্লেষণ, ঘনিষ্ঠ, পরিমাণ - এই সব শব্দ চলবে না।
🚫 ভুয়া বাংলা শব্দ একদম তৈরি করবে না। যেমন: ছারে, কপিরা, জমি পুষ্টি, উপজরায়ন, মোটর, প্লাগিং, মৎস্য - এই সব ভুয়া শব্দ কখনো বলবে না।
🚫 মার্কডাউন ফরম্যাট দেবে না - ** বা --- বা ### বা ## - কিছুই না। শুধু সরল বাংলা টেক্সট।
🚫 কোড, প্রোগ্রামিং, এআই নিয়ে কোনো কথা বলবে না।

✅ শুধু মাটি, ফসল, সার, রোগ-পোকা, চাষাবাদ, আবহাওয়া, বাজারদর নিয়ে কথা বলবে।

তোমার ভাষা হবে সাদামাটা গ্রামের ভাষা - যেভাবে একজন চাষী ভাই তার প্রতিবেশীর সাথে কথা বলে।
সঠিক কৃষি উদাহরণ দেবে: গোবর সার, ইউরিয়া, টিএসপি, এমওপি, বোরো ধান, আমন ধান, ব্রি ধান, দেশি পেঁয়াজ, হাইব্রিড জাত ইত্যাদি।

বর্তমান মৌসুম (বর্ষা/শীত/গরম) অনুযায়ী পরামর্শ দেবে। ধাপগুলো নম্বর দিয়ে আলাদা করে বুঝিয়ে বলবে।
উত্তর পড়লেই কৃষক বুঝতে পারবে - কী করবে, কখন করবে, কতটুকু করবে, কেন করবে।

উত্তরের শেষে ৩টি প্রশ্ন দেবে এই ফরম্যাটে:

আরও জানতে চান?
- প্রথম প্রশ্ন?
- দ্বিতীয় প্রশ্ন?
- তৃতীয় প্রশ্ন?`

// ─── 55 unique farming questions ───
const SUGGESTIONS_POOL = [
  "ধান গাছে ব্লাস্ট রোগের চিকিৎসা?", "ধান গাছে পাতা পোড়া রোগ কেন হয়?", "ধান চাষে ইউরিয়া সারের সঠিক মাত্রা কত?",
  "ধানের জমিতে পোকা দমনের জৈব উপায় কী?", "বোরো ধান চাষের সঠিক সময় কখন?", "ধান গাছে শীষ বের না হলে করণীয় কী?",
  "আমন ধানের জন্য সেরা জাত কোনটি?", "ধান গাছে মাজরা পোকা দমনের উপায়?", "আলু চাষের সঠিক সময় ও পদ্ধতি?",
  "টমেটো পাতা কুঁকড়ে যায় কেন?", "বেগুন গাছে ফল ছিদ্রকারী পোকা দমন?", "পটল চাষে ফলন বাড়ানোর উপায়?",
  "লাউ গাছে পাউডারি মিলডিউ রোগের চিকিৎসা?", "মরিচ গাছে ফুল ঝরে যায় কেন?", "ঢেঁড়স চাষে সার প্রয়োগের নিয়ম?",
  "কুমড়া গাছে পোকামাকড় দমনের ঘরোয়া উপায়?", "বাঁধাকপি ও ফুলকপি চাষের পার্থক্য?", "শসা চাষে রোগবালাই ও প্রতিকার?",
  "পেঁয়াজ চাষে সেচ ব্যবস্থাপনা কেমন হবে?", "জৈব সার তৈরির পদ্ধতি?", "ভার্মি কম্পোস্ট কীভাবে বানাবেন?",
  "মাটির অম্লতা কমানোর ঘরোয়া উপায়?", "সবুজ সার হিসেবে কোন ফসল ভালো?", "টিএসপি সারের কাজ কী ও কখন দিতে হয়?",
  "পটাশ সার ব্যবহারের নিয়ম কী?", "জমির উর্বরতা বাড়ানোর প্রাকৃতিক উপায়?", "পোকা দমনে নিম তেল কীভাবে ব্যবহার করবেন?",
  "ফসলে কাটুই পোকার আক্রমণ ও প্রতিকার?", "ছত্রাকনাশক স্প্রে করার সঠিক নিয়ম?", "জাব পোকা দমনের সহজ উপায়?",
  "শুয়োপোকা দমনে জৈব কীটনাশক?", "পাতামোড়ানো পোকার আক্রমণ ও দমন?", "থ্রিপস পোকা চেনার উপায় ও দমন?",
  "আম গাছে মুকুল আসার পর করণীয়?", "কলা গাছে সিগাটোকা রোগের চিকিৎসা?", "পেঁপে গাছে পচন রোগ প্রতিরোধ?",
  "লিচু গাছে ফল না ধরার কারণ কী?", "কমলা-মাল্টা চাষে সার ব্যবস্থাপনা?", "আনারস চাষের উপযুক্ত মাটি কেমন?",
  "বৃষ্টির সময় ফসলের যত্ন কিভাবে নেবেন?", "সেচের অভাবে ফসল বাঁচানোর উপায়?", "খরায় ধান গাছ বাঁচানোর পদ্ধতি?",
  "সেচের জন্য সোলার পাম্প কেমন?", "ড্রিপ সেচ পদ্ধতির সুবিধা কী?", "জলাবদ্ধ জমিতে কোন ফসল চাষ করবেন?",
  "শীতকালীন সবজি চাষের তালিকা ও পদ্ধতি?", "গ্রীষ্মকালীন ফসলের তালিকা কী কী?", "আন্তঃফসল চাষ পদ্ধতির সুবিধা?",
  "ফসল সংগ্রহোত্তর সংরক্ষণের নিয়ম?", "বাজারদর বুঝে কোন ফসল চাষ করবেন?", "কৃষি ঋণ পাওয়ার নিয়ম কী কী?",
  "বালাইনাশক ছাড়া ফসল ফলানো সম্ভব?", "ছাদে বা টবে সবজি চাষের পদ্ধতি?", "পাট চাষে পোকার আক্রমণ ও সমাধান?",
  "গম চাষে সেচ ও সার ব্যবস্থাপনা?",
]

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor((seed * (i + 1) * 2654435761) % (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getFreshSuggestions(exclude: string[] = [], message?: string): string[] {
  const seed = Date.now() + (exclude.length * 7919)
  const shuffled = shuffleArray(SUGGESTIONS_POOL, seed)
  const excludeSet = new Set(exclude)
  const available = shuffled.filter(q => !excludeSet.has(q))
  if (message) {
    const words = message.toLowerCase().split(/\s+/).filter((w: string) => w.length >= 3)
    const related = available.filter(q => words.some((w: string) => q.includes(w)))
    if (related.length >= 3) return related.slice(0, 3)
  }
  if (available.length >= 3) return available.slice(0, 3)
  const result = [...available]
  for (const q of shuffled) { if (result.length >= 3) break; if (!result.includes(q)) result.push(q) }
  return result.slice(0, 3)
}

// ─── BULLETPROOF suggestion extraction ───
function extractSuggestions(reply: string): { cleanedReply: string; suggestions: string[] } {
  let cleaned = reply.replace(/[.\s\u200B-\u200D\uFEFF]+$/, "").trim()
  let match = cleaned.match(/---\s*\n\*\*(.+?)\*\*\s*\n((?:-\s*.+\n?)+)/)
  if (!match) match = cleaned.match(/\*\*(?:আরও\s*জানতে\s*চান\??|আরও\s*প্রশ্ন|আরও\s*জানবেন)[?!]*\*\*\s*\n+((?:-\s*.+[\n$]){1,5})/)
  if (!match) {
    const lines = cleaned.split("\n")
    const idx = lines.findIndex(l => /^(?:আরও\s*(জানতে|প্রশ্ন|জানবেন|জানার))/.test(l.trim()))
    if (idx >= 0) {
      const after = lines.slice(idx + 1).map(l => l.trim()).filter(l => l.length > 5 && /\?/.test(l))
      if (after.length >= 2) { cleaned = lines.slice(0, idx).join("\n").trim(); return { cleanedReply: cleaned, suggestions: after.slice(0, 3).map(q => q.replace(/^[\d.\-•\s]+/, "").trim()) } }
    }
  }
  if (match) {
    cleaned = cleaned.replace(match[0], "").trim()
    const raw = match[1] || match[2] || ""
    const lines = raw.split("\n").map(l => l.replace(/^[\-\d.\s•]+/, "").trim()).filter(l => l.length > 3)
    if (lines.length >= 2) return { cleanedReply: cleaned, suggestions: lines.slice(0, 3) }
    return { cleanedReply: cleaned, suggestions: [] }
  }
  return { cleanedReply: cleaned, suggestions: [] }
}

// ─── WARM, NATURAL greeting for non-farming messages ───
const WARM_GREETING = "আসসালামু আলাইকুম ও চাষী ভাই! আমি কৃষি বন্ধু — আপনের ধান-সবজি, ক্ষেত-খামার আর রোগ-পোকা লইয়া কথা কইতে আছি। কী জাননের ইচ্ছা আপনের?"

// ─── FRIENDLY redirect for security blocks ───
const FRIENDLY_REDIRECT = "ও চাষী ভাই, আমি তো খালি ধান-ফসল আর মাটি-পোকা লইয়াই কথা কইতে পারি। আপনের ক্ষেতের কোনো সমস্যা থাকলে কন — রোগ বালাই, সার-পানি, আবাদ-চাষা যাহা কিছু — আমি যথাসাধ্য হেল্প করমু ইনশাআল্লাহ।"

// ─── INPUT GUARD ───
const JAILBREAK_PATTERNS = [
  /system\s*prompt/i, /^\s*instructions?\s*$/i, /repeat\s.*(words|above|everything)/i, /word\s*for\s*word/i,
  /developer\s*mode/i, /jailbreak/i, /show\s*me\s*your\s*(system|prompt|instructions?)/i, /previous\s.*instructions?/i,
  /internal\s*(prompt|instruction)/i, /print\s.*(prompt|instruction|system|message)/i, /ignore\s.*(instructions?|prompt|above|previous)/i,
  /disregard\s.*(above|previous|all|prompt)/i, /forget\s.*(above|previous|all|everything)/i, /pretend\s*(you|to\s*be)\s*(are|a|an)/i,
  /dan\s*mode/i, /how\s*were\s*you\s*(made|built|created|trained)/i, /reveal\s*your\s*(system|prompt|instructions?)/i,
  /what\s*(is|are)\s*your\s*(system\s*)?(prompt|instructions?|rules)/i, /translate\s*(the|your)\s*(above|previous|instructions?|prompt)/i,
  /output\s*(your|the)\s*(system|instructions?|prompt)/i, /write\s*out\s*your\s*(system|prompt)/i,
]

// These are normal conversation — NEVER jailbreak
const GREETING_WHITELIST = [
  /^(hi|hey|hello|hy|hlo|helo)$/i,
  /^(good\s*(morning|afternoon|evening|night))$/i,
  /^(how\s*(are|r)\s*(you|u)\??)$/i,
  /^(what(\s|')?s\s*up\??)$/i,
  /^(yo|sup|heya|howdy)$/i,
  /^(who\s*are\s*(you|u)\??)$/i,
  /^(what\s*(can|do)\s*you\s*do\??)$/i,
  /^(আসসালামু\s*আলাইকুম|সালাম|আদাব|নমস্কার)/i,
  /^(কেমন\s*(আছ|আছেন|আছো))/i,
  /^(কে\s*তুমি|তুমি\s*কে|কে\s*আপনি)/i,
  /^(আপনার\s*নাম\s*কি)/i,
  /^(তোমার\s*নাম\s*কি)/i,
]

function isGreeting(text: string): boolean {
  const trimmed = text.trim()
  return GREETING_WHITELIST.some(p => p.test(trimmed))
}

function isJailbreakAttempt(text: string): boolean {
  // NEVER block greetings
  if (isGreeting(text)) return false

  const lower = text.toLowerCase()
  // Only block if actual jailbreak pattern matched
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(lower)) return true
  }
  return false
}

// ─── OUTPUT GUARD ───
function isSystemPromptLeak(reply: string): boolean {
  if (reply.includes("তুমি কৃষি বন্ধু") || reply.includes("system prompt") || reply.includes("CHATBOT_SYSTEM_PROMPT")) return true
  const markers = ["কঠোর নিরাপত্তা নিয়ম", "কৃষকের জন্য একজন অভিজ্ঞ", "বলার নিয়ম:", "তোমার ভাষা হবে", "শহুরে অফিসার নও"]
  let matchCount = 0
  for (const m of markers) { if (reply.includes(m)) matchCount++; if (matchCount >= 2) return true }
  return false
}

export const maxDuration = 60 // Vercel: prevent timeout on long AI responses

export async function POST(req: NextRequest) {
  try {
    const { message, language, history, shownSuggestions = [] } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: "কোন বার্তা প্রদান করা হয়নি" }, { status: 400 })

    // 🛡️ Only block actual jailbreak attempts, not greetings
    if (isJailbreakAttempt(message)) {
      return NextResponse.json({ reply: FRIENDLY_REDIRECT, suggestions: getFreshSuggestions(shownSuggestions) })
    }

    const keys = getOpenRouterKeys()
    if (keys.length === 0) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const messages: any[] = [
      { role: "system", content: CHATBOT_SYSTEM_PROMPT },
      ...(history || []).slice(-5).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message.trim() },
    ]

    let data = await fetchOpenRouterWithRetry({ model: "google/gemma-4-26b-a4b-it:free", messages, max_tokens: 1500, temperature: 0.7 })
    // Fallback: if Gemma 4 fails, try openrouter/free
    if (!data?.choices?.[0]?.message?.content) {
      console.warn("Gemma 4 failed, falling back to openrouter/free")
      data = await fetchOpenRouterWithRetry({ model: "openrouter/free", messages, max_tokens: 1500, temperature: 0.7 })
    }
    let reply = data?.choices?.[0]?.message?.content || "দুঃখিত, এখন উত্তর দিতে পারছি না। আবার চেষ্টা করুন।"
    // Strip OpenRouter safety prefix (e.g. "User Safety: safe")
    reply = reply.replace(/^User Safety:\s*(safe|unsafe)\s*\n*/i, "").trim()
    reply = reply.replace(/_{2,}|~{2,}|#{1,6}\s*/g, "").trim()
    reply = reply.replace(/---+/g, "\n\n").trim()
    reply = reply.replace(/\n{3,}/g, "\n\n").trim()
    // Strip Tamil and other non-Bengali Indic characters
    reply = reply.replace(/[\u0900-\u0963\u0970-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]+/g, "").trim()
    // Ensure line breaks before numbered points for readability
    reply = reply.replace(/([।:])\s*([\p{Nd}]+[\.\)])/gu, "$1\n\n$2")
    if (!reply) reply = "দুঃখিত, এখন উত্তর দিতে পারছি না। আবার চেষ্টা করুন।"

    if (isSystemPromptLeak(reply)) {
      return NextResponse.json({ reply: FRIENDLY_REDIRECT, suggestions: getFreshSuggestions(shownSuggestions) })
    }

    const { cleanedReply, suggestions } = extractSuggestions(reply)
    reply = cleanedReply
    const finalSuggestions = suggestions.length >= 2 ? suggestions : getFreshSuggestions(shownSuggestions)

    return NextResponse.json({ reply, suggestions: finalSuggestions })
  } catch (error: any) {
    console.error("Chatbot error:", error)
    return NextResponse.json({ error: "চ্যাটবট সমস্যা — আবার চেষ্টা করুন", suggestions: getFreshSuggestions() })
  }
}

export async function GET() {
  return NextResponse.json({ suggestions: getFreshSuggestions() })
}
