"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { MessageCircle, Send, Loader2, Copy, Plus, History, Sparkles, X, Trash2, Check } from "lucide-react"

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
      setMessages((prev) => [
        ...prev,
        { id: genId(), role: "assistant", content: language === "bn" ? "দুঃখিত, কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Sorry, something went wrong. Please try again.", timestamp: new Date() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const newChat = () => {
    setMessages([])
    setSidebarOpen(false)
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-50 w-72 h-full bg-white border-r border-gray-100 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <History className="w-4 h-4 text-leaf-600" />
              {t("tools.chatbot.history")}
            </h2>
            <button className="md:hidden p-1 hover:bg-gray-100 rounded" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <button onClick={newChat} className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            {t("tools.chatbot.new")}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              {language === "bn" ? "কোন চ্যাট হিস্টোরি নেই" : "No chat history yet"}
            </p>
          ) : (
            <div className="space-y-1">
              {messages
                .filter((m) => m.role === "user")
                .slice(-20)
                .map((m) => (
                  <button
                    key={m.id}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-leaf-50 truncate"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {m.content.slice(0, 50)}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center gap-3">
          <button className="md:hidden p-1 hover:bg-gray-100 rounded" onClick={() => setSidebarOpen(true)}>
            <History className="w-5 h-5 text-gray-500" />
          </button>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">{t("tools.chatbot.title")}</h1>
            <p className="text-xs text-gray-400">{language === "bn" ? "OpenRouter AI দ্বারা চালিত" : "Powered by OpenRouter AI"}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {language === "bn" ? "CropIQ কৃষি সহায়ক" : "CropIQ Farming Assistant"}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {language === "bn"
                  ? "আপনার কৃষি বিষয়ক প্রশ্ন করুন বাংলায়"
                  : "Ask your farming questions in Bengali or English"}
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(sug)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-leaf-300 hover:text-leaf-700 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div className={`max-w-[75%] space-y-1 ${msg.role === "user" ? "items-end" : ""}`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-leaf-600 text-white rounded-br-md"
                      : "bg-white border border-gray-100 shadow-sm rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyMessage(msg.content, msg.id)}
                    className="text-xs text-gray-400 hover:text-leaf-600 flex items-center gap-1 ml-1"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-leaf-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copiedId === msg.id ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 bg-leaf-600 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0s]" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage(input)
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("tools.chatbot.placeholder")}
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary p-3 aspect-square flex items-center justify-center rounded-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
