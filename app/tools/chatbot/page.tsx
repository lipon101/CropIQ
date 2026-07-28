"use client"

import { useState, useEffect, useRef } from "react"
import { Send, MessageCircle, Sprout, Loader2 } from "lucide-react"
import { ToolPageLayout, TOOLS } from "@/components/tools/ToolPageLayout"
import { useAuth } from "@/lib/auth/AuthContext"
import SuggestionCarousel from "@/components/ui/SuggestionCarousel"
import { createClient } from "@/lib/supabase/client"

interface ChatMessage { role: "user" | "assistant"; content: string }

export default function ChatbotPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [shownSuggestions, setShownSuggestions] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  // Fetch fresh suggestions on every mount (page refresh = new questions)
  useEffect(() => {
    fetch("/api/chatbot")
      .then(r => r.json())
      .then(d => {
        if (d.suggestions?.length) {
          setSuggestions(d.suggestions)
          setShownSuggestions(d.suggestions)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async (text: string) => {
    const msg = text.trim()
    if (!msg || loading) return
    setInput("")
    setLoading(true)

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: msg }]
    setMessages(newMessages)

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-10),
          shownSuggestions, // pass currently shown questions so server avoids them
        }),
      })
      const data = await res.json()

      // 💾 Save to Supabase for dashboard analytics
      if (user && data.reply) {
        supabase.from("chat_sessions").insert({
          user_id: user.id,
          question: msg,
          answer: data.reply,
        }).then(() => {})
      }

      if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: data.error }])
        if (data.suggestions?.length) {
          setSuggestions(data.suggestions)
          setShownSuggestions(data.suggestions)
        }
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.reply }])
        if (data.suggestions?.length) {
          setSuggestions(data.suggestions)
          setShownSuggestions(data.suggestions)
        }
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "দুঃখিত, সমস্যা হয়েছে। আবার চেষ্টা করুন।" }])
    } finally {
      setLoading(false)
    }
  }


  return (
    <ToolPageLayout title="কৃষি চ্যাটবট" icon={<MessageCircle className="w-4 h-4 text-white" />} currentIndex={2}>
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden pt-2">

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-2">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-xs">
                <div className="w-16 h-16 bg-gradient-to-br from-leaf-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Sprout className="w-8 h-8 text-leaf-600" />
                </div>
                <h2 className="text-lg font-extrabold text-gray-800 mb-1">কৃষি বন্ধু</h2>
                <p className="text-xs text-gray-500 mb-4">ফসল, রোগ-পোকা, চাষাবাদ নিয়ে প্রশ্ন করুন</p>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed font-medium ${
                m.role === "user"
                  ? "bg-gradient-to-r from-leaf-500 to-emerald-600 text-white rounded-br-md"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-leaf-500 animate-spin" />
                <span className="text-xs text-gray-400">লিখছে...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <SuggestionCarousel
          suggestions={suggestions}
          onSelect={send}
          disabled={loading}
        />

        {/* ── Input ── */}
        <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex gap-2 shrink-0 pt-1">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-leaf-500 outline-none text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-leaf-500 to-emerald-600 hover:from-leaf-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-2.5 rounded-xl shadow-md shadow-leaf-200 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </ToolPageLayout>
  )
}
