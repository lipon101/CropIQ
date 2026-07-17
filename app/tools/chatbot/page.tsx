"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Copy, Check, Bot, User, ChevronRight } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date }
let msgCounter = 0
function genId() { return `msg-${++msgCounter}-${Date.now()}` }

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const um: Message = { id: genId(), role: "user", content: text.trim(), timestamp: new Date() }
    setMessages(p => [...p, um]); setInput(""); setSuggestions([]); setLoading(true)
    try {
      const h = messages.map(m => ({ role: m.role, content: m.content }))
      const r = await fetch("/api/chatbot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text.trim(), language: "bn", history: h }) })
      if (!r.ok) throw new Error("err")
      const d = await r.json()
      setMessages(p => [...p, { id: genId(), role: "assistant", content: d.reply, timestamp: new Date() }])
      if (d.suggestions?.length) setSuggestions(d.suggestions)
    } catch { setMessages(p => [...p, { id: genId(), role: "assistant", content: "দুঃখিত, কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।", timestamp: new Date() }]) }
    finally { setLoading(false) }
  }

  const copyMsg = (t: string, id: string) => { navigator.clipboard.writeText(t); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000) }
  const newChat = () => { setMessages([]); setSuggestions([]) }
  const starters = ["ধান গাছে ব্লাস্ট রোগের চিকিৎসা?", "আলু চাষের সঠিক সময়?", "টমেটো পাতা কুঁকড়ে যায় কেন?", "জৈব সার তৈরির পদ্ধতি?"]

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-transparent">
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-2 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm"><Bot className="w-4 h-4 text-white" /></div>
        <h1 className="font-bold text-gray-900 text-sm">এআই কৃষি চ্যাটবট</h1>
        {messages.length > 0 && <button onClick={newChat} className="ml-auto text-xs font-medium text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50">নতুন</button>}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full"><div className="text-center max-w-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3"><Bot className="w-6 h-6 text-blue-600" /></div>
              <h2 className="text-base font-bold text-gray-800 mb-1">আসসালামু আলাইকুম! 🌱</h2>
              <p className="text-sm text-gray-500 mb-4">যেকোনো কৃষি প্রশ্ন করুন — বাংলায়</p>
              <div className="flex flex-wrap gap-2 justify-center">{starters.map((s, i) => <button key={i} onClick={() => send(s)} className="px-3.5 py-2 bg-gray-50 hover:bg-leaf-50 border border-gray-200 hover:border-leaf-200 rounded-xl text-xs font-medium text-gray-600 hover:text-leaf-700 transition-all">{s}</button>)}</div>
            </div></div>
          ) : messages.map(m => (
            <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-1"><Bot className="w-3.5 h-3.5 text-white" /></div>}
              <div className="max-w-[85%]">
                {m.role === "user" ? <div className="px-3.5 py-2.5 bg-leaf-600 text-white rounded-2xl rounded-br-md text-sm leading-relaxed whitespace-pre-line">{m.content}</div>
                  : <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm leading-relaxed markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                      table: ({ children }) => <div className="overflow-x-auto my-1.5"><table className="min-w-full text-xs border-collapse">{children}</table></div>,
                      thead: ({ children }) => <thead>{children}</thead>, tbody: ({ children }) => <tbody>{children}</tbody>,
                      tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
                      th: ({ children }) => <th className="px-2.5 py-1.5 text-left font-bold text-gray-700 bg-gray-100 text-[11px]">{children}</th>,
                      td: ({ children }) => <td className="px-2.5 py-1.5 text-gray-600 text-[11px]">{children}</td>,
                      p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
                    }}>{m.content}</ReactMarkdown>
                    <button onClick={() => copyMsg(m.content, m.id)} className="text-[10px] text-gray-400 hover:text-leaf-600 flex items-center gap-1 mt-1.5 font-medium">{copiedId === m.id ? <><Check className="w-3 h-3 text-green-500" />কপি হয়েছে</> : <><Copy className="w-3 h-3" />কপি</>}</button>
                  </div>}
              </div>
              {m.role === "user" && <div className="w-7 h-7 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-1"><User className="w-3.5 h-3.5 text-white" /></div>}
            </div>
          ))}
          {loading && <div className="flex gap-2"><div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shrink-0 shadow-sm"><Bot className="w-3.5 h-3.5 text-white" /></div><div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3"><div className="flex gap-1"><div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.15s]" /><div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.3s]" /></div></div></div>}
          <div ref={chatEndRef} />
        </div>

        {suggestions.length > 0 && !loading && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <div className="flex flex-wrap gap-1.5">{suggestions.map((s, i) => <button key={i} onClick={() => send(s)} className="px-3 py-1.5 bg-white border border-gray-200 hover:border-leaf-300 hover:bg-leaf-50 rounded-lg text-[11px] font-medium text-gray-600 hover:text-leaf-700 transition-all flex items-center gap-1">{s}<ChevronRight className="w-3 h-3 text-gray-300" /></button>)}</div>
          </div>
        )}

        <div className="p-2.5 border-t border-gray-100 bg-white shrink-0">
          <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="আপনার প্রশ্ন লিখুন..." className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-leaf-500 outline-none text-sm" disabled={loading} />
            <button type="submit" disabled={loading || !input.trim()} className="bg-gradient-to-r from-leaf-500 to-emerald-600 hover:from-leaf-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-2.5 rounded-xl shadow-md shadow-leaf-200 active:scale-95 transition-all"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      </div>
    </div>
  )
}
