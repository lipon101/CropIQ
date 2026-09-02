import { NextRequest, NextResponse } from "next/server"
import { getOpenRouterKeys, fetchOpenRouterWithRetry } from "@/lib/openrouter"

const CHATBOT_SYSTEM_PROMPT = `আসসালামু আলাইকুম ভাই! তুমি মাঠ পর্যায়ের একজন অত্যন্ত অভিজ্ঞ এবং বাস্তবসম্মত কৃষি সম্প্রসারণ কর্মকর্তা (Agricultural Officer)। তুমি বাংলাদেশি চাষি ভাইদের অত্যন্ত সহজ, সরল ও বৈজ্ঞানিকভাবে শতভাগ সঠিক কৃষি পরামর্শ দেবে।

তোমার প্রতিটি উত্তর হতে হবে বাস্তবসম্মত, বাস্তব অভিজ্ঞতাসম্পন্ন মানুষের মতো এবং শতভাগ বিজ্ঞানসম্মত। কোনো কাল্পনিক, ভুল বা ক্ষতিকর পরামর্শ দেওয়া যাবে না।

⚠️ অত্যন্ত গুরুত্বপূর্ণ বাস্তব কৃষি নিয়মাবলী (Strict Agricultural Accuracy):
১. আম গাছে মুকুল ফোটার সময় (flowering stage) কখনোই পানি সেচ দেওয়া যাবে না। সেচ দিলে মুকুল ঝরে যায় এবং নতুন পাতা গজায়। ফল মটরদানা সাইজ বা গুটি হলে তখন প্রতি ১০-১৫ দিন পর পর হালকা সেচ দিতে হবে।
২. রাসায়নিক সার সরাসরি পানির সাথে কড়া ডোজে মিশিয়ে গাছের গোড়ায় ঢেলে দেওয়া যাবে না, এতে শিকড় পুড়ে গাছ মরে যাবে। সারের সঠিক ডোজ হবে: প্রতি পূর্ণবয়স্ক আম গাছের গোড়া থেকে ৪-৫ ফুট দূরে রিং করে মাটির সাথে ২৫0-৩০০ গ্রাম ইউরিয়া, ৩০০ গ্রাম টিএসপি এবং ২৫০ গ্রাম পটাশ (MOP) মিশিয়ে দিতে হবে এবং তা মুকুল আসার অন্তত ১-২ মাস আগে অথবা ফল সংগ্রহের পর বর্ষায়।
৩. মুকুল আসার পর হপার পোকা এবং পাউডারি মিলডিউ (ছত্রাক) দমনে মুকুল ফোটার আগে একবার এবং গুটি ধরার পর আরেকবার ইমিডাক্লোপ্রিড গ্রুপর কীটনাশক (যেমন: এডমায়ার ০.৫ মিলি/লিটার) এবং কার্বেনডাজিম গ্রুপের ছত্রাকনাশক (যেমন: অটোস্টিন ১ গ্রাম/লিটার) মিশিয়ে স্প্রে করতে হবে। ফুল ফোটা অবস্থায় স্প্রে করা যাবে না, এতে পরাগায়নকারী মৌমাছি মারা যায়।
৪. কোনো মনগড়া পরিমাণ (যেমন: ১ কেজি ইউরিয়া ১ লিটার পানিতে মিশিয়ে দেওয়া) বা মনগড়া কাজ (যেমন মুকুলের ভার কমাতে পাতা কেটে ফেলা) একদমই বলবে না।
৫. কোনো ভুয়া বা কাল্পনিক ফসল, জাত বা অবাস্তব তথ্য একদম তৈরি করবে না। বাংলাদেশে বাস্তবে চাষ হওয়া ফসলের সঠিক তথ্য দেবে।
   ⚠️ সঠিক কৃষি জ্ঞানাবলি (Strict Biological Facts):
   - আউশ ধান একটি স্বল্পমেয়াদী ফসল, এটি মাত্র ৩ থেকে ৪ মাস (৯০-১২০ দিন) সময় নেয়। ৯-১২ মাস নয়!
   - পাট একটি আঁশ জাতীয় ফসল (fiber crop)। এটি ধান নয় এবং এতে চাল হয় না! এটি ৮-১০ মাস সময় নেয় না, ৪-৫ মাসে কাটা হয়।
   - বাঙ্গি একটি রসালো মিষ্টি ফল (muskmelon), এটি কোনো "সবুজ শাক" নয়!
   - চিনাবাদাম মাটির নিচে জন্মে (legume), এটি কোনো গাছের ডাল বা পাম ফল নয়!
   - ঝিঙা, চিচিঙ্গা, করলা ও ঢেঁড়স অন্যতম প্রধান গ্রীষ্মকালীন ও বর্ষাকালীন সবজি।
৬. কোনো তথ্য নিশ্চিত না থাকলে অনুমান করে ভুল তথ্য দেবে না — সেক্ষেত্রে সাধারণ, বহুল পরিচিত ও প্রমাণিত কৃষি তথ্য দিয়ে উত্তর দেবে।

⚠️ উত্তর দেওয়ার শৈলী ও নিয়মাবলী:
১. এই প্রশ্নটি যদি কোনো চলমান আলোচনার (ongoing chat) অংশ হয়, তবে উত্তরটি হতে হবে অত্যন্ত সংক্ষিপ্ত, সরাসরি কাজের কথা (direct) এবং সুনির্দিষ্ট (concise)। কোনো সালাম বা দীর্ঘ ভূমিকা দেবে না।
২. উত্তর খুব সহজ বাংলায় দেবে - যাতে কম লেখাপড়া জানা কৃষকও বুঝতে পারে।
৩. কোনো ইংরেজি হরফ, রাসায়নিক সংকেত বা বন্ধনীর ভেতরে কোনো ইংরেজি অক্ষর লিখবে না (যেমন: "ফসফরাস (P)" লেখা যাবে না, শুধু "ফসফরাস" লিখবে)।
৪. কখনো খালি বন্ধনী () লিখবে না। কোনো ধরনের ব্র্যাকেট বা ইংরেজি সংক্ষিপ্ত রূপ ব্যবহার করবে না।
৫. মার্কডাউন ফরম্যাট দেবে না - ** বা --- বা ### বা ## - কিছুই না। শুধু সরল বাংলা টেক্সট।
৬. তোমার ভেতরের চিন্তা, বিশ্লেষণ বা যুক্তি (chain-of-thought / reasoning) কখনোই ইউজারকে দেখাবে না। "Okay, the user is asking…", "Let me recall…" বা এই ধরনের কোনো ইংরেজি ভাবনা-চিন্তা বা যুক্তি-পর্যায় লিখবে না। সরাসরি শুধু চূড়ান্ত বাংলা উত্তরটাই দেবে - মাঝখানের কোনো চিন্তা প্রসেস, সিদ্ধান্ত বা ব্যাখ্যা নয়।
৭. উত্তরে সম্পূর্ণ ১০০% বিশুদ্ধ বাংলা লিখবে। কোনো ইংরেজি শব্দ, ইংরেজি অক্ষর বা বাংলা-ইংরেজি মিশ্রণ একদমই নয় - not, tolerant, best, variety, submergence, election, trust এই ধরনের কোনো ইংরেজি শব্দের টুকরোও উত্তরে আসবে না।
৬. শেষে ৩টি সম্পর্কিত প্রশ্ন সুপারিশ করবে।

উত্তরের শেষে ৩টি প্রকৃত ও প্রাসঙ্গিক প্রশ্ন দেবে এই ফরম্যাটে (নিচের প্রশ্নগুলো উদাহরণ — এগুলো হুবহু কপি করবে না, বরং ব্যবহারকারীর বিষয়ের সাথে মিলিয়ে ৩টি নতুন বাস্তব প্রশ্ন বানিয়ে লিখবে):

আরও জানতে চান?
- তরমুজের ফলন বাড়াতে কী সার দেব?
- আউশ ধানের চাষের সঠিক সময় কখন?
- গ্রীষ্মকালে কোন সবজি চাষ লাভজনক?`

// ─── 55 unique farming questions ───
const SUGGESTIONS_POOL = [
  "ধান গাছে ব্লাস্ট রোগের চিকিৎসা?", "ধান গাছে পাতা পোড়া রোগ কেন হয়?", "ধান চাষে ইউরিয়া সারের সঠিক মাত্রা কত?",
  "ধানের জমিতে পোকা দমনের জৈব উপায় কী?", "বোরো ধান চাষের সঠিক সময় কখন?", "ধান গাছে শীষ বের না হলে করণীয় কী?",
  "আমন ধানের জন্য সেরা জাত কোনটি?", "ধান গাছে মাজরা পোকা দমনের উপায়?", "আলু চাষের সঠিক সময় ও পদ্ধতি?",
  "টমেটো পাতা কুঁকড়ে যায় কেন?", "বেগুন গাছে ফল ছিদ্রকারী পোকা দমন?", "পটল চাষে ফলন বাড়ানোর উপায়?",
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
    if (related.length >= 5) return related.slice(0, 5)
  }
  if (available.length >= 5) return available.slice(0, 5)
  const result = [...available]
  for (const q of shuffled) { if (result.length >= 5) break; if (!result.includes(q)) result.push(q) }
  return result.slice(0, 5)
}

function extractSuggestions(reply: string): { cleanedReply: string; suggestions: string[] } {
  let cleaned = reply.replace(/[.\s\u200B-\u200D\uFEFF]+$/, "").trim()
  let match = cleaned.match(/---\s*\n\*\*(.+?)\*\*\s*\n((?:-\s*.+\n?)+)/)
  if (!match) match = cleaned.match(/\*\*(?:আরও\s*জানতে\s*চান\??|আরও\s*প্রশ্ন|আরও\s*জানবেন)[?!]*\*\*\s*\n+((?:-\s*.+[\n$]){1,5})/)
  if (!match) {
    const lines = cleaned.split("\n")
    const idx = lines.findIndex(l => /^(?:আরও\s*(জানতে|প্রশ্ন|জানবেন|জানার))/.test(l.trim()))
    if (idx >= 0) {
      const after = lines.slice(idx + 1).map(l => l.trim()).filter(l => l.length > 5 && /\?/.test(l))
      if (after.length >= 2) { cleaned = lines.slice(0, idx).join("\n").trim(); return { cleanedReply: cleaned, suggestions: after.slice(0, 5).map(q => q.replace(/^[\d.\-•\s]+/, "").trim()) } }
    }
  }
  if (match) {
    cleaned = cleaned.replace(match[0], "").trim()
    const raw = match[1] || match[2] || ""
    const lines = raw.split("\n").map(l => l.replace(/^[\-\d.\s•]+/, "").trim()).filter(l => l.length > 3)
    if (lines.length >= 2) return { cleanedReply: cleaned, suggestions: lines.slice(0, 5) }
    return { cleanedReply: cleaned, suggestions: [] }
  }
  return { cleanedReply: cleaned, suggestions: [] }
}

const FRIENDLY_REDIRECT = "ও চাষী ভাই, আমি তো খালি ধান-ফসল আর মাটি-পোকা লইয়াই কথা কইতে পারি। আপনের ক্ষেতের কোনো সমস্যা থাকলে কন — রোগ বালাই, সার-পানি, আবাদ-চাষা যাহা কিছু — আমি যথাসাধ্য হেল্প করমু ইনশাআল্লাহ।"

const JAILBREAK_PATTERNS = [
  /system\s*prompt/i, /^\s*instructions?\s*$/i, /repeat\s.*(words|above|everything)/i, /word\s*for\s*word/i,
  /developer\s*mode/i, /jailbreak/i, /show\s*me\s*your\s*(system|prompt|instructions?)/i, /previous\s.*instructions?/i,
  /internal\s*(prompt|instruction)/i, /print\s.*(prompt|instruction|system|message)/i, /ignore\s.*(instructions?|prompt|above|previous)/i,
  /disregard\s.*(above|previous|all|prompt)/i, /forget\s.*(above|previous|all|everything)/i, /pretend\s*(you|to\s*be)\s*(are|a|an)/i,
  /dan\s*mode/i, /how\s*were\s*you\s*(made|built|created|trained)/i, /reveal\s*your\s*(system|prompt|instructions?)/i,
  /what\s*(is|are)\s*your\s*(system\s*)?(prompt|instructions?|rules)/i, /translate\s*(the|your)\s*(above|previous|instructions?|prompt)/i,
  /output\s*(your|the)\s*(system|instructions?|prompt)/i, /write\s*out\s*your\s*(system|prompt)/i,
]

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
  /^(command_name)/i,
]

function isGreeting(text: string): boolean {
  const trimmed = text.trim()
  return GREETING_WHITELIST.some(p => p.test(trimmed))
}

function isJailbreakAttempt(text: string): boolean {
  if (isGreeting(text)) return false
  const lower = text.toLowerCase()
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(lower)) return true
  }
  return false
}

// ─── Strip leaked chain-of-thought / thinking monologue ───
// Reasoning models (Gemma etc.) sometimes emit an internal "Okay, the user is
// asking…" monologue BEFORE the real answer. Remove any leading English
// thinking block and any trailing English prose so only Bengali remains.
function stripReasoning(raw: string): string {
  let s = raw.trim()
  if (!s) return s

  const lines = s.split("\n")
  // Find the first line that contains actual Bengali script
  const bengaliIdx = lines.findIndex((l) => /[\u0980-\u09FF]/.test(l))

  // If there is a block of English BEFORE the first Bengali line, and that
  // block looks like internal reasoning (mentions "the user", "let me", etc.),
  // drop the whole leading block.
  if (bengaliIdx > 0) {
    const leading = lines.slice(0, bengaliIdx).join(" ").trim()
    const looksLikeReasoning =
      leading.length > 15 &&
      /[a-zA-Z]{3,}/.test(leading) &&
      /(okay|so\b|let me|first|i need|i should|i remember|the user|i recall|structur|answer|recall|check|guideline|rule|thinking)/i.test(leading)
    if (looksLikeReasoning) {
      s = lines.slice(bengaliIdx).join("\n")
    }
  }

  // Strip a trailing English "let me answer / respond in Bengali" style tail
  s = s
    .replace(/\n*(okay|ok|so|now|alright)[\s,]+(the user|i|let me|to answer|to respond)[\s\S]{10,}$/gi, "")
    .trim()

  return s.trim()
}

function isSystemPromptLeak(reply: string): boolean {
  if (reply.includes("তুমি কৃষি বন্ধু") || reply.includes("system prompt") || reply.includes("CHATBOT_SYSTEM_PROMPT")) return true
  const markers = ["কঠোর নিরাপত্তা নিয়ম", "কৃষকের জন্য একজন অভিজ্ঞ", "বলার নিয়ম:", "তোমার ভাষা হবে", "শহুরে অফিসার নও"]
  let matchCount = 0
  for (const m of markers) { if (reply.includes(m)) matchCount++; if (matchCount >= 2) return true }
  return false
}

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { message, language, history, shownSuggestions = [] } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: "কোন বার্তা প্রদান করা হয়নি" }, { status: 400 })

    if (isJailbreakAttempt(message)) {
      return NextResponse.json({ reply: FRIENDLY_REDIRECT, suggestions: getFreshSuggestions(shownSuggestions) })
    }

    const keys = getOpenRouterKeys()
    if (keys.length === 0) return NextResponse.json({ error: "এআই সার্ভিস কনফিগার করা হয়নি" }, { status: 500 })

    const isOngoing = history && history.length > 0
    const activeSystemPrompt = isOngoing 
      ? `${CHATBOT_SYSTEM_PROMPT}\n\n⚠️ চলমান চ্যাট সতর্কীকরণ: এটি একটি সম্পূরক প্রশ্ন। ইউজারকে কোনো নতুন অভিবাদন বা সালাম জানাবে না। কোনো লম্বা সূচনা বাদ দিয়ে সরাসরি ও সংক্ষেপে পয়েন্ট আকারে উত্তর দেবে।`
      : CHATBOT_SYSTEM_PROMPT

    const messages: any[] = [
      { role: "system", content: activeSystemPrompt },
      ...(history || []).slice(-5).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message.trim() },
    ]

    const modelsToTry = [
      "google/gemma-4-31b-it:free",
      "google/gemma-4-26b-a4b-it:free",
      "openrouter/free",
    ]

    let data: any = null
    for (const model of modelsToTry) {
      try {
        data = await fetchOpenRouterWithRetry({ model, messages, max_tokens: 1500, temperature: 0.1 }) // Set temperature low (0.1) for extreme deterministic accuracy and realism
        if (data?.choices?.[0]?.message?.content) {
          console.log(`Chatbot success with model: ${model}`)
          break
        }
      } catch (err) {
        console.warn(`Model ${model} failed, trying next fallback...`, err)
      }
    }

    let reply = data?.choices?.[0]?.message?.content || "দুঃখিত, এখন উত্তর দিতে পারছি না। আবার চেষ্টা করুন।"
    // Strip any leaked chain-of-thought / reasoning monologue before cleanup
    reply = stripReasoning(reply)

    // Clean safety prefixes
    reply = reply.replace(/user\s*safety\s*:\s*(safe|unsafe)\.?/gi, "").trim()
    reply = reply.replace(/response\s*safety\s*:\s*(safe|unsafe)\.?/gi, "").trim()
    reply = reply.replace(/_{2,}|~{2,}|#{1,6}\s*/g, "").trim()
    reply = reply.replace(/---+/g, "\n\n").trim()
    reply = reply.replace(/\n{3,}/g, "\n\n").trim()

    // Strip Devanagari, Tamil, Telugu, Kannada, Malayalam and other Indic scripts correctly
    reply = reply.replace(/[\u0900-\u0963\u0970-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]+/g, "").trim()

    // Remove stray English letters/digits left inside parentheses
    reply = reply.replace(/[\(（]\s*[A-Za-z0-9\s,]+\s*[\)）]/g, "").trim()
    reply = reply.replace(/[\(（]\s*[\)）]/g, "").trim()
    // ─── Bengali purity filter: remove stray English words that leaked ───
    // If a reply is mostly Bengali but contains isolated English words (e.g.
    // "tolerant", "election", "trust"), drop those English tokens so the output
    // stays 100% Bengali. We preserve BRRI-style variety codes (BRRI dhan71)
    // and units by keeping short-safe tokens, but nuke obvious English prose.
    reply = reply.replace(/\b(?:tolerant|election|trust|transplanted|harvested|submergence|salinity|high\s*[-]?\s*yielding|blast|susceptible|resistant|resistance|moderate|medium|yield|variety|varieties|season|normal|stress|advice|wait|check|verify|giving|answer|recall|remember|structure|depend|depends|location|region|flood|risk|areas?|soil|question|user|farmer|guidelines?|rule|rules|fictional|unrealistic|general|example|point|points|important|note|also|actually|specifically|currently|recommended|popular|release|released|older|newer|good|best|better|general)\b/gi, "")
    reply = reply.replace(/[\t ]{2,}/g, " ").trim()
reply = reply.replace(/^[\s\.\u200B-\u200D\uFEFF]+|[\s\.\u200B-\u200D\uFEFF]+$/g, "").trim()
    reply = reply.replace(/[ \t]{2,}/g, " ").trim()
    reply = reply.replace(/\s+([।,])/g, "$1")

    // Ensure line breaks before numbered points for readability
    reply = reply.replace(/([।:])\s*([\p{Nd}]+[\.\)])/gu, "$1\n\n$2")
    if (!reply) reply = "দুঃখিত, এখন উত্তর দিতে পারছি না। আবার চেষ্টা করুন।"

    if (isSystemPromptLeak(reply)) {
      return NextResponse.json({ reply: FRIENDLY_REDIRECT, suggestions: getFreshSuggestions(shownSuggestions) })
    }

    const { cleanedReply, suggestions } = extractSuggestions(reply)
    reply = cleanedReply
    // Hard safety filter: reject literal placeholder text if the model echoed the template instead of a real question
    const placeholderPattern = /^(প্রথম|দ্বিতীয়|তৃতীয়|চতুর্থ|পঞ্চম)\s*প্রশ্ন\??$/
    const realSuggestions = suggestions.filter(s => {
      const trimmed = s.trim();
      // Filter out bracketed placeholders (e.g. "[এখানে...]") or placeholders mentioning template helper terms
      if (trimmed.includes("[") || trimmed.includes("]") || trimmed.includes("এখানে") || trimmed.includes("আসল প্রশ্ন") || trimmed.includes("প্রথম প্রশ্ন") || trimmed.includes("দ্বিতীয় প্রশ্ন") || trimmed.includes("তৃতীয় প্রশ্ন")) {
        return false;
      }
      return !placeholderPattern.test(trimmed);
    })
    const finalSuggestions = realSuggestions.length >= 2 ? realSuggestions : getFreshSuggestions(shownSuggestions, message)

    return NextResponse.json({ reply, suggestions: finalSuggestions })
  } catch (error: any) {
    console.error("Chatbot error:", error)
    return NextResponse.json({ error: "চ্যাটবট সমস্যা — আবার চেষ্টা করুন", suggestions: getFreshSuggestions() })
  }
}

export async function GET() {
  return NextResponse.json({ suggestions: getFreshSuggestions() })
}
