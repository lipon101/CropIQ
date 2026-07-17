"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Send, Loader2, Copy, Plus, History, X, Check, Trash2, Bot, User, ChevronRight } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date }
let msgCounter = 0
function genId() { return `msg-${++msgCounter}-${Date.now()}` }

export default function ChatbotPage() {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string|null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = chatContainerRef.current; if (!c) return
    if (c.scrollHeight - c.scrollTop - c.clientHeight < 150 && chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "auto" })
  }, [messages, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const um: Message = { id: genId(), role: "user", content: text.trim(), timestamp: new Date() }
    setMessages(p => [...p, um]); setInput(""); setSuggestions([]); setLoading(true)
    try {
      const h = messages.map(m => ({ role: m.role, content: m.content }))
      const r = await fetch("/api/chatbot", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ message:text.trim(), language, history:h }) })
      if (!r.ok) throw new Error("err")
      const d = await r.json()
      setMessages(p => [...p, { id:genId(), role:"assistant", content:d.reply, timestamp:new Date() }])
      if (d.suggestions?.length) setSuggestions(d.suggestions)
    } catch { setMessages(p => [...p, { id:genId(), role:"assistant", content:language==="bn"?"দুঃখিত, কিছু সমস্যা হয়েছে।":"Sorry, something went wrong.", timestamp:new Date() }]) }
    finally { setLoading(false) }
  }

  const copyMsg = (t: string, id: string) => { navigator.clipboard.writeText(t); setCopiedId(id); setTimeout(()=>setCopiedId(null),2000) }
  const newChat = () => { setMessages([]); setSuggestions([]); setSidebarOpen(false) }
  const userMsgs = messages.filter(m => m.role === "user")
  const starters = language==="bn" ? ["ধান গাছে ব্লাস্ট রোগের চিকিৎসা?","আলু চাষের সঠিক সময়?","টমেটো পাতা কুঁকড়ে যায় কেন?","জৈব সার তৈরির পদ্ধতি?"] : ["How to treat rice blast?","Best time to plant potatoes?","Why tomato leaves curling?","How to make organic fertilizer?"]

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-xl" onClick={()=>setSidebarOpen(true)}><History className="w-5 h-5 text-gray-500"/></button>
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-sm"><Bot className="w-4.5 h-4.5 text-white"/></div>
        <div className="flex-1"><span className="font-bold text-gray-900 text-sm">{t("tools.chatbot.title")}</span><p className="text-[11px] text-gray-400">{language==="bn"?"কৃষি প্রশ্ন করুন":"Ask farming questions"}</p></div>
        {messages.length>0&&<button onClick={newChat} className="text-xs font-medium text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50">{language==="bn"?"নতুন":"New"}</button>}
        <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="hidden md:flex p-2 hover:bg-gray-100 rounded-xl text-gray-400"><History className="w-4.5 h-4.5"/></button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen&&<div className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm" onClick={()=>setSidebarOpen(false)}/>}
        <div className={`${sidebarOpen?"translate-x-0":"-translate-x-full md:translate-x-0"} fixed md:relative z-40 md:z-auto w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 transition-transform duration-300 h-full`}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3"><h2 className="font-bold text-gray-800 text-sm flex items-center gap-2"><History className="w-4 h-4 text-leaf-600"/>{t("tools.chatbot.history")}</h2><button className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg" onClick={()=>setSidebarOpen(false)}><X className="w-4 h-4"/></button></div>
            <button onClick={newChat} className="btn-primary-sm w-full"><Plus className="w-3.5 h-3.5"/>{t("tools.chatbot.new")}</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">{userMsgs.length===0?<p className="text-xs text-gray-400 text-center py-10">{language==="bn"?"কোন চ্যাট নেই":"No chats"}</p>:userMsgs.slice(-30).reverse().map(m=><button key={m.id} className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-leaf-50 truncate font-medium" onClick={()=>setSidebarOpen(false)}>{m.content.slice(0,45)}{m.content.length>45?"…":""}</button>)}</div>
          {messages.length>0&&<div className="p-3 border-t border-gray-100"><button onClick={newChat} className="w-full text-xs text-red-500 hover:bg-red-50 py-2 rounded-lg flex items-center justify-center gap-1.5 font-medium"><Trash2 className="w-3.5 h-3.5"/>{language==="bn"?"ক্লিয়ার":"Clear"}</button></div>}
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            {messages.length===0?(
              <div className="flex items-center justify-center h-full"><div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4"><Bot className="w-8 h-8 text-blue-600"/></div>
                <h2 className="font-bold text-gray-800 text-lg mb-1">{language==="bn"?"আসসালামু আলাইকুম! 🌱":"Hello! 🌱"}</h2>
                <p className="text-sm text-gray-500 mb-5">{language==="bn"?"আমি আপনার কৃষি সহায়ক। যেকোনো প্রশ্ন করুন।":"I'm your farming assistant. Ask anything."}</p>
                <div className="flex flex-wrap gap-2 justify-center">{starters.map((s,i)=><button key={i} onClick={()=>send(s)} className="px-4 py-2 bg-gray-50 hover:bg-leaf-50 border border-gray-200 hover:border-leaf-200 rounded-xl text-xs font-medium text-gray-600 hover:text-leaf-700 transition-all">{s}</button>)}</div>
              </div></div>
            ):messages.map(m=>(
              <div key={m.id} className={`flex gap-2.5 ${m.role==="user"?"justify-end":""}`}>
                {m.role==="assistant"&&<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-1"><Bot className="w-4 h-4 text-white"/></div>}
                <div className={`max-w-[82%]`}>
                  {m.role==="user"?<div className="px-4 py-3 bg-leaf-600 text-white rounded-2xl rounded-br-md text-sm leading-relaxed whitespace-pre-line">{m.content}</div>
                  :<div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                      table:({children})=><div className="overflow-x-auto my-2"><table className="min-w-full text-xs border-collapse">{children}</table></div>,
                      thead:({children})=><thead>{children}</thead>, tbody:({children})=><tbody>{children}</tbody>,
                      tr:({children})=><tr className="border-b border-gray-200">{children}</tr>,
                      th:({children})=><th className="px-3 py-2 text-left font-bold text-gray-700 bg-gray-100">{children}</th>,
                      td:({children})=><td className="px-3 py-2 text-gray-600">{children}</td>,
                      p:({children})=><p className="mb-2 last:mb-0">{children}</p>,
                      strong:({children})=><strong className="font-bold text-gray-900">{children}</strong>,
                      ul:({children})=><ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                      ol:({children})=><ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                      li:({children})=><li className="text-gray-700">{children}</li>,
                    }}>{m.content}</ReactMarkdown>
                    <button onClick={()=>copyMsg(m.content,m.id)} className="text-[11px] text-gray-400 hover:text-leaf-600 flex items-center gap-1 mt-2 font-medium">{copiedId===m.id?<><Check className="w-3 h-3 text-green-500"/>{language==="bn"?"কপি হয়েছে":"Copied!"}</>:<><Copy className="w-3 h-3"/>{t("tools.chatbot.copy")}</>}</button>
                  </div>}
                </div>
                {m.role==="user"&&<div className="w-8 h-8 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-1"><User className="w-4 h-4 text-white"/></div>}
              </div>
            ))}
            {loading&&<div className="flex gap-2.5"><div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm"><Bot className="w-4 h-4 text-white"/></div><div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md px-5 py-4"><div className="flex gap-1.5"><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"/><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.15s]"/><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.3s]"/></div></div></div>}
            <div ref={chatEndRef}/>
          </div>

          {suggestions.length>0&&!loading&&(
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 shrink-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{language==="bn"?"আরও জানতে চান?":"Want to learn more?"}</p>
              <div className="flex flex-wrap gap-2">{suggestions.map((s,i)=><button key={i} onClick={()=>send(s)} className="px-3.5 py-2 bg-white border border-gray-200 hover:border-leaf-300 hover:bg-leaf-50 rounded-xl text-xs font-medium text-gray-600 hover:text-leaf-700 transition-all flex items-center gap-1.5">{s}<ChevronRight className="w-3 h-3 text-gray-300"/></button>)}</div>
            </div>
          )}

          <div className="p-3 border-t border-gray-100 bg-white shrink-0">
            <form onSubmit={e=>{e.preventDefault();send(input)}} className="flex gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} placeholder={language==="bn"?"প্রশ্ন লিখুন...":"Type your question..."} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm" disabled={loading}/>
              <button type="submit" disabled={loading||!input.trim()} className="btn-primary-sm p-3 aspect-square !px-3 !rounded-xl"><Send className="w-5 h-5"/></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
