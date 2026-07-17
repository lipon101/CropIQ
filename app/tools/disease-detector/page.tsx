"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Microscope, Loader2, AlertCircle, Trash2, ShieldAlert, ImageIcon, FileText } from "lucide-react"
import type { DiagnosisResult } from "@/types"

export default function DiseaseDetectorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<"image" | "text">("image")

  const handleFile = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) { setError("ছবির আকার ১০MB এর বেশি হতে পারবে না"); return }
    setError(""); setResult(null); setImageFile(file)
    const r = new FileReader(); r.onload = e => setImage(e.target?.result as string); r.readAsDataURL(file)
  }, [])
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleFile(f) }, [handleFile])

  const analyze = async () => {
    setError(""); setResult(null); setLoading(true)
    try {
      let r: Response
      if (mode === "image" && imageFile) { const fd = new FormData(); fd.append("file", imageFile); fd.append("language", "bn"); r = await fetch("/api/disease-detect", { method: "POST", body: fd }) }
      else if (mode === "text" && description.trim()) { r = await fetch("/api/disease-detect-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description, language: "bn" }) }) }
      else { setError("দয়া করে ছবি আপলোড করুন বা লক্ষণ লিখুন"); setLoading(false); return }
      if (!r.ok) throw new Error((await r.json()).error || "বিশ্লেষণ ব্যর্থ")
      const d = await r.json(); d.result ? setResult(d.result) : setError("বিশ্লেষণ ব্যর্থ হয়েছে")
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }
  const reset = () => { setImage(null); setImageFile(null); setDescription(""); setResult(null); setError("") }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-transparent">
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-2 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-sm"><Microscope className="w-4 h-4 text-white" /></div>
        <h1 className="font-bold text-gray-900 text-sm">ফসল রোগ সনাক্তকারী</h1>
        <div className="ml-auto flex bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setMode("image")} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 ${mode === "image" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}><ImageIcon className="w-3.5 h-3.5" />ছবি</button>
          <button onClick={() => setMode("text")} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 ${mode === "text" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}><FileText className="w-3.5 h-3.5" />লক্ষণ</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto p-3 space-y-3">
          {mode === "image" ? (
            <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${image ? "border-leaf-400 bg-leaf-50/30" : "border-gray-300 hover:border-leaf-400 bg-white"}`}>
              {image ? (
                <div className="space-y-2">
                  <img src={image} alt="প্রিভিউ" className="max-h-40 mx-auto rounded-xl shadow" />
                  <div className="flex justify-center gap-2">
                    <button onClick={reset} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" />সরান</button>
                    <button onClick={analyze} disabled={loading} className="btn-primary-sm !py-1.5 !px-4 !text-xs">{loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Microscope className="w-3.5 h-3.5" />}{loading ? "বিশ্লেষণ হচ্ছে..." : "বিশ্লেষণ করুন"}</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mx-auto"><Upload className="w-5 h-5 text-red-500" /></div>
                  <p className="text-xs text-gray-400">JPG, PNG বা WebP (সর্বোচ্চ ১০MB)</p>
                  <button onClick={() => fileInputRef.current?.click()} className="btn-primary-sm !py-1.5 !px-4 !text-xs"><Upload className="w-3.5 h-3.5" />ছবি আপলোড করুন</button>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm space-y-2">
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-leaf-500 outline-none text-sm resize-none" placeholder="আপনার ফসলের লক্ষণ বর্ণনা করুন... যেমন: ধান গাছের পাতা হলুদ হয়ে যাচ্ছে এবং পাতায় বাদামী দাগ দেখা যাচ্ছে।" />
              <button onClick={analyze} disabled={loading || !description.trim()} className="btn-primary-sm w-full !text-xs">{loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Microscope className="w-3.5 h-3.5" />}{loading ? "বিশ্লেষণ হচ্ছে..." : "বিশ্লেষণ করুন"}</button>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-xl text-xs flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}</div>}
          {loading && <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm"><Loader2 className="w-6 h-6 text-leaf-600 animate-spin mx-auto mb-2" /><p className="text-sm font-bold text-gray-700">বিশ্লেষণ চলছে...</p></div>}

          {result && !loading && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-500" /><h3 className="font-bold text-gray-900 text-xs">{result.crop_type} — {result.disease_name}</h3></div>
              <div className="p-3 space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">নির্ভুলতা</p><p className="text-sm font-bold text-leaf-600">{Math.round(result.confidence * 100)}%</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">ফসল</p><p className="text-xs font-bold text-gray-800">{result.crop_type || "—"}</p></div>
                  <div className="bg-red-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">কারণ</p><p className="text-xs font-bold text-red-700">{result.cause || "—"}</p></div>
                </div>
                <div className="bg-leaf-50 rounded-xl p-3"><p className="text-[11px] font-bold text-leaf-700 mb-1">💊 চিকিৎসা</p><p className="text-xs text-gray-700 leading-relaxed">{result.remedy_bn}</p></div>
                {result.prevention_bn && <div className="bg-blue-50 rounded-xl p-3"><p className="text-[11px] font-bold text-blue-700 mb-1">🛡️ প্রতিরোধ</p><p className="text-xs text-gray-700 leading-relaxed">{result.prevention_bn}</p></div>}
                {result.is_common_in_bd && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-[11px] font-medium">⚠️ এই রোগ বাংলাদেশে প্রচলিত</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
