"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { MessageCircle, Send, Loader2, Copy, Plus, History, X, Check, Trash2, Bot, User, Sparkles } from "lucide-react"

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date }

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
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Intelligent auto-scroll: only scroll if user is near the bottom
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120
    if (isNearBottom && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto" })
    }
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { id: genId(), role: "user", content: text.trim(), timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const response = await fetch("/api/chatbot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text.trim(), language, history }) })
      if (!response.ok) throw new Error("Chatbot error")
      const data = await response.json()
      setMessages((prev) => [...prev, { id: genId(), role: "assistant", content: data.reply, timestamp: new Date() }])
    } catch {
      setMessages((prev) => [...prev, { id: genId(), role: "assistant", content: language === "bn" ? "দুঃখিত, কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Sorry, something went wrong. Please try again.", timestamp: new Date() }])
    } finally { setLoading(false) }
  }

  const copyMessage = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000) }
  const newChat = () => { setMessages([]); setSidebarOpen(false) }
  const userMessages = messages.filter((m) => m.role === "user")

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
      {/* Compact header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-xl" onClick={() => setSidebarOpen(true)}><History className="w-5 h-5 text-gray-500" /></button>
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
          <Bot className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">{t("tools.chatbot.title")}</span>
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>
          </div>
          <p className="text-[11px] text-gray-400">{language === "bn" ? "যেকোনো কৃষি প্রশ্ন করুন" : "Ask any farming question"}</p>
        </div>
        {messages.length > 0 && (
          <button onClick={newChat} className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">{language === "bn" ? "নতুন চ্যাট" : "New Chat"}</button>
        )}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex p-2 hover:bg-gray-100 rounded-xl text-gray-400"><History className="w-4.5 h-4.5" /></button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
        <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} fixed md:relative z-40 md:z-auto w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 transition-transform duration-300 h-full`}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2"><History className="w-4 h-4 text-leaf-600" />{t("tools.chatbot.history")}</h2>
              <button className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg" onClick={() => setSidebarOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <button onClick={newChat} className="btn-primary w-full text-xs py-2.5"><Plus className="w-3.5 h-3.5" />{t("tools.chatbot.new")}</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {userMessages.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10">{language === "bn" ? "কোন চ্যাট নেই" : "No chats yet"}</p>
            ) : (
              <div className="space-y-0.5">{userMessages.slice(-30).reverse().map((m) => <button key={m.id} className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-leaf-50 truncate font-medium" onClick={() => setSidebarOpen(false)}>{m.content.slice(0, 45)}{m.content.length > 45 ? "…" : ""}</button>)}</div>
            )}
          </div>
          {messages.length > 0 && (
            <div className="p-3 border-t border-gray-100">
              <button onClick={newChat} className="w-full text-xs text-red-500 hover:bg-red-50 py-2 rounded-lg flex items-center justify-center gap-1.5 font-medium"><Trash2 className="w-3.5 h-3.5" />{language === "bn" ? "ক্লিয়ার" : "Clear Chat"}</button>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="font-bold text-gray-800 text-lg mb-1">{language === "bn" ? "আসসালামু আলাইকুম! 🌱" : "Hello! 🌱"}</h2>
                  <p className="text-sm text-gray-500 mb-5">{language === "bn" ? "আমি আপনার কৃষি সহায়ক। যেকোনো কৃষি প্রশ্ন করুন — বাংলা বা ইংরেজিতে।" : "I'm your farming assistant. Ask any question — in Bengali or English."}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      language === "bn" ? "ধান গাছে ব্লাস্ট রোগের চিকিৎসা?" : "How to treat rice blast?",
                      language === "bn" ? "আলু চাষের সঠিক সময়?" : "Best time to plant potatoes?",
                      language === "bn" ? "টমেটো পাতা কুঁকড়ে যাচ্ছে কেন?" : "Why are tomato leaves curling?",
                      language === "bn" ? "জৈব সার কিভাবে তৈরি করবো?" : "How to make organic fertilizer?",
                    ].map((s, i) => (
                      <button key={i} onClick={() => sendMessage(s)} className="px-4 py-2 bg-gray-50 hover:bg-leaf-50 border border-gray-200 hover:border-leaf-200 rounded-xl text-xs font-medium text-gray-600 hover:text-leaf-700 transition-all">{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm"><Bot className="w-4 h-4 text-white" /></div>
                  )}
                  <div className={`max-w-[80%] space-y-1 ${msg.role === "user" ? "items-end" : ""}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "bg-leaf-600 text-white rounded-br-md" : "bg-gray-50 border border-gray-100 rounded-bl-md"}`}>{msg.content}</div>
                    {msg.role === "assistant" && (
                      <button onClick={() => copyMessage(msg.content, msg.id)} className="text-[11px] text-gray-400 hover:text-leaf-600 flex items-center gap-1 ml-1 font-medium">
                        {copiedId === msg.id ? <><Check className="w-3 h-3 text-green-500" />{language === "bn" ? "কপি হয়েছে" : "Copied!"}</> : <><Copy className="w-3 h-3" />{t("tools.chatbot.copy")}</>}
                      </button>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm"><User className="w-4 h-4 text-white" /></div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm"><Bot className="w-4 h-4 text-white" /></div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="flex gap-1.5"><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.15s]" /><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.3s]" /></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={language === "bn" ? "আপনার প্রশ্ন লিখুন..." : "Type your question..."} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm" disabled={loading} />
              <button type="submit" disabled={loading || !input.trim()} className="btn-primary p-3 aspect-square rounded-xl"><Send className="w-5 h-5" /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
