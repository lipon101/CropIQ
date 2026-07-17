"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { MessageCircle, Send, Loader2, Copy, Plus, History, Sparkles, X, Check, Info } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const SUGGESTIONS_BN = [
  "ধান গাছে ব্লাস্ট রোগের চিকিৎসা কি?",
  "আলু চাষের সঠিক সময় কখন?",
  "টমেটো গাছের পাতা কুঁকড়ে যাচ্ছে কেন?",
  "জৈব সার কিভাবে তৈরি করবো?",
]

const SUGGESTIONS_EN = [
  "How to treat rice blast disease?",
  "When is the best time to plant potatoes?",
  "Why are tomato leaves curling?",
  "How to make organic fertilizer?",
]

let msgCounter = 0
function genId() { return `msg-${++msgCounter}-${Date.now()}` }

export default function ChatbotPage() {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const suggestions = language === "bn" ? SUGGESTIONS_BN : SUGGESTIONS_EN

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { id: genId(), role: "user", content: text.trim(), timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), language, history }),
      })
      if (!response.ok) throw new Error("Chatbot error")
      const data = await response.json()
      const botMsg: Message = { id: genId(), role: "assistant", content: data.reply, timestamp: new Date() }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [...prev, { id: genId(), role: "assistant", content: language === "bn" ? "দুঃখিত, কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Sorry, something went wrong. Please try again.", timestamp: new Date() }])
    } finally { setLoading(false) }
  }

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const newChat = () => { setMessages([]); setSidebarOpen(false) }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.05)_0%,transparent_50%)]" />
        <div className="container-cropiq relative py-10 md:py-14">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />{language === "bn" ? "এআই-চালিত টুল" : "AI-Powered Tool"} — <span className="text-amber-800">BETA</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {language === "bn" ? <><span className="text-blue-600">এআই</span> কৃষি চ্যাটবট</> : <><span className="text-blue-600">AI</span> Farming Chatbot</>}
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed">{language === "bn" ? "কৃষি সংক্রান্ত যেকোনো প্রশ্ন করুন বাংলায় — চাষাবাদ, সার, পোকামাকড়, সেচ ও আরও অনেক কিছু।" : "Ask any farming question in Bengali or English — planting, fertilizer, pest control, irrigation, and more."}</p>
                <p className="text-gray-500 text-sm">{language === "bn" ? "OpenRouter AI দ্বারা চালিত · বাংলা ও ইংরেজি উভয় ভাষায় উত্তর" : "Powered by OpenRouter AI · Answers in both Bengali & English"}</p>
              </div>
            </div>
            <div className="hidden lg:flex lg:col-span-2 justify-center">
              <div className="relative w-44 h-44"><div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 to-indigo-200/40 rounded-full animate-pulse-gentle" /><div className="absolute inset-6 bg-white rounded-full shadow-lg flex items-center justify-center"><MessageCircle size={70} className="text-blue-500" /></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-cropiq">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">{language === "bn" ? "কীভাবে কাজ করে" : "How It Works"}</h3>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { num: "1", title: language === "bn" ? "প্রশ্ন লিখুন" : "Ask a question", desc: language === "bn" ? "আপনার কৃষি বিষয়ক প্রশ্ন বাংলা বা ইংরেজিতে লিখুন।" : "Type your farming question in Bengali or English." },
              { num: "2", title: language === "bn" ? "এআই উত্তর দেবে" : "AI responds", desc: language === "bn" ? "এআই সহজ ভাষায় বিস্তারিত পরামর্শ দেবে।" : "AI provides detailed advice in simple language." },
              { num: "3", title: language === "bn" ? "শিখতে থাকুন" : "Keep learning", desc: language === "bn" ? "অসীমিত প্রশ্ন করুন, শিখুন এবং আপনার ফসলের যত্ন নিন।" : "Ask unlimited questions, learn, and care for your crops." },
            ].map((step, i) => (
              <div key={i} className="flex gap-3"><div className="w-8 h-8 bg-leaf-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">{step.num}</div><div><h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4><p className="text-xs text-gray-500 mt-0.5">{step.desc}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Questions */}
      <section className="py-6 bg-gray-50/50">
        <div className="container-cropiq max-w-3xl">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{language === "bn" ? "উদাহরণ প্রশ্ন" : "Example Questions"}</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, i) => (
              <button key={i} onClick={() => sendMessage(sug)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-leaf-300 hover:text-leaf-700 transition-colors shadow-sm">{sug}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="py-8 bg-gray-50/50">
        <div className="container-cropiq max-w-4xl">
          {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
          <div className="flex rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white" style={{ minHeight: "500px", maxHeight: "70vh" }}>
            {/* Sidebar */}
            <div className={`fixed md:relative z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 shrink-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`} style={{ height: "100%" }}>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2"><History className="w-4 h-4 text-leaf-600" />{t("tools.chatbot.history")}</h2>
                  <button className="md:hidden p-1 hover:bg-gray-100 rounded" onClick={() => setSidebarOpen(false)}><X className="w-4 h-4" /></button>
                </div>
                <button onClick={newChat} className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5"><Plus className="w-3.5 h-3.5" />{t("tools.chatbot.new")}</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {messages.length === 0 ? <p className="text-xs text-gray-400 text-center py-8">{language === "bn" ? "কোন চ্যাট নেই" : "No chats yet"}</p>
                  : <div className="space-y-1">{messages.filter((m) => m.role === "user").slice(-20).map((m) => <button key={m.id} className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-leaf-50 truncate" onClick={() => setSidebarOpen(false)}>{m.content.slice(0, 40)}</button>)}</div>}
              </div>
            </div>

            {/* Main Chat */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <button className="md:hidden p-1 hover:bg-gray-100 rounded" onClick={() => setSidebarOpen(true)}><History className="w-5 h-5 text-gray-500" /></button>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><MessageCircle className="w-4 h-4 text-blue-600" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-900 text-sm">{t("tools.chatbot.title")}</span><span className="w-2 h-2 bg-green-500 rounded-full" title="Online" /></div>
                  <p className="text-xs text-gray-400">{language === "bn" ? "সর্বদা প্রস্তুত" : "Always online"}</p>
                </div>
                <button onClick={newChat} className="text-xs text-gray-400 hover:text-red-500 hidden sm:block">{language === "bn" ? "মুছুন" : "Clear"}</button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8"><div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Sparkles className="w-7 h-7 text-blue-600" /></div><p className="font-semibold text-gray-800 mb-1">{language === "bn" ? "আসসালামু আলাইকুম! 🌱" : "Hello! 🌱"}</p><p className="text-sm text-gray-500">{language === "bn" ? "আমি আপনার কৃষি সহায়ক। কৃষি সংক্রান্ত যেকোনো প্রশ্ন করুন — বাংলা বা ইংরেজিতে।" : "I'm your farming assistant. Ask any agriculture question — in Bengali or English."}</p></div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "assistant" && <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0"><MessageCircle className="w-4 h-4 text-blue-600" /></div>}
                    <div className={`max-w-[75%] space-y-1 ${msg.role === "user" ? "items-end" : ""}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "bg-leaf-600 text-white rounded-br-md" : "bg-gray-50 border border-gray-100 rounded-bl-md"}`}>{msg.content}</div>
                      {msg.role === "assistant" && <button onClick={() => copyMessage(msg.content, msg.id)} className="text-xs text-gray-400 hover:text-leaf-600 flex items-center gap-1 ml-1">{copiedId === msg.id ? <Check className="w-3 h-3 text-leaf-500" /> : <Copy className="w-3 h-3" />}{copiedId === msg.id ? "Copied!" : "Copy"}</button>}
                    </div>
                    {msg.role === "user" && <div className="w-8 h-8 bg-leaf-600 rounded-lg flex items-center justify-center shrink-0"><span className="text-white text-xs font-bold">U</span></div>}
                  </div>
                ))}
                {loading && <div className="flex gap-3"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0"><MessageCircle className="w-4 h-4 text-blue-600" /></div><div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md px-5 py-4"><div className="flex gap-1"><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0s]" /><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.15s]" /><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.3s]" /></div></div></div>}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={language === "bn" ? "আপনার প্রশ্ন লিখুন... (Enter দিয়ে পাঠান)" : "Type your question... (Enter to send)"} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm" disabled={loading} />
                  <button type="submit" disabled={loading || !input.trim()} className="btn-primary p-2.5 aspect-square flex items-center justify-center rounded-xl shadow-md">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50/50 border-t border-amber-100">
        <div className="container-cropiq"><div className="max-w-3xl mx-auto flex gap-3 text-sm text-amber-800"><Info className="w-5 h-5 shrink-0 mt-0.5" /><div><p className="font-semibold mb-1">{language === "bn" ? "ডিসক্লেইমার" : "Disclaimer"}</p><p className="text-amber-700 leading-relaxed">{language === "bn" ? "এআই পরামর্শ তথ্যমূলক উদ্দেশ্যে। গুরুতর সমস্যায় কৃষি বিশেষজ্ঞের পরামর্শ নিন।" : "AI advice is for informational purposes only. For serious crop problems, consult a local agricultural extension officer."}</p></div></div></div>
      </section>
    </div>
  )
}
