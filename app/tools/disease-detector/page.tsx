"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Microscope, Loader2, AlertCircle, Trash2, ShieldAlert, ImageIcon, FileText, Scan, RefreshCw } from "lucide-react"
import { ToolPageLayout, TOOLS } from "@/components/tools/ToolPageLayout"
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

  const hasContent = mode === "image" ? !!image : !!description.trim()

  return (
    <ToolPageLayout title="ফসল রোগ সনাক্তকারী" icon={<Microscope className="w-4 h-4 text-white" />} currentIndex={1}>
      <div className="space-y-6">
        {/* ── Mode Toggle ── */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm">
            <button onClick={() => { setMode("image"); reset() }} className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${mode === "image" ? "bg-gray-900 text-white shadow-lg" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
              <ImageIcon className="w-4 h-4" />ছবি আপলোড
            </button>
            <button onClick={() => { setMode("text"); reset() }} className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${mode === "text" ? "bg-gray-900 text-white shadow-lg" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
              <FileText className="w-4 h-4" />লক্ষণ লিখুন
            </button>
          </div>
        </div>

        {/* ── Upload / Input Zone ── */}
        {!result && !loading && (
          <>
            {mode === "image" ? (
              <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${image ? "border-emerald-400 bg-emerald-50/40" : "border-gray-300 hover:border-emerald-400 bg-white"}`}>
                {image ? (
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-4">
                      <img src={image} alt="প্রিভিউ" className="w-32 h-32 object-cover rounded-xl shadow-md border border-gray-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 mb-1">ছবি আপলোড হয়েছে</p>
                        <p className="text-xs text-gray-500">বিশ্লেষণ শুরু করতে নিচের বাটনে ক্লিক করুন</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button onClick={reset} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />নতুন স্ক্যান
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 md:p-10 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">ছবি আপলোড করুন</h3>
                    <p className="text-sm text-gray-500 mb-2">ফসলের ছবি তুলুন বা আপনার ডিভাইস থেকে সিলেক্ট করুন</p>
                    <p className="text-xs text-gray-400 mb-5">JPG, PNG বা WebP (সর্বোচ্চ ১০MB)</p>
                    <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-700 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm">
                      <Upload className="w-4 h-4" />ছবি সিলেক্ট করুন
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    <p className="text-xs text-gray-400 mt-4">অথবা ছবি ড্র্যাগ করে এনে দিন</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center"><FileText className="w-4 h-4 text-amber-500" /></div>
                  <div><h3 className="text-sm font-bold text-gray-800">লক্ষণ বর্ণনা করুন</h3><p className="text-xs text-gray-500">ফসলের সমস্যা বিস্তারিত লিখুন</p></div>
                </div>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none text-sm resize-none transition-all" placeholder="যেমন: ধান গাছের পাতা হলুদ হয়ে যাচ্ছে, পাতায় বাদামী দাগ দেখা যাচ্ছে, গাছের বৃদ্ধি থমকে গেছে..." />
              </div>
            )}
          </>
        )}

        {/* ── Error ── */}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2.5"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

        {/* ── Loading ── */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">রোগ সনাক্তকরণ চলছে...</h3>
            <p className="text-sm text-gray-500">এআই আপনার ফসলের ছবি বিশ্লেষণ করছে, অনুগ্রহ করে অপেক্ষা করুন</p>
          </div>
        )}

        {/* ── Results ── */}
        {result && !loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Result Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><ShieldAlert className="w-5 h-5 text-red-500" /></div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm">{result.disease_name}</h3>
                  <p className="text-xs text-gray-500">{result.crop_type || "ফসল"}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-xs font-extrabold text-emerald-600 shadow-sm">
                    <Scan className="w-3 h-3" />{Math.round(result.confidence * 100)}% নির্ভুল
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Stat pills */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wide mb-1">নির্ভুলতা</p>
                    <p className="text-lg font-extrabold text-emerald-700">{Math.round(result.confidence * 100)}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">ফসল</p>
                    <p className="text-sm font-extrabold text-gray-800">{result.crop_type || "—"}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <p className="text-[11px] font-bold text-red-400 uppercase tracking-wide mb-1">কারণ</p>
                    <p className="text-xs font-extrabold text-red-600">{result.cause || "—"}</p>
                  </div>
                </div>

                {/* Treatment */}
                <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-xs font-extrabold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">💊 চিকিৎসা</p>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">{result.remedy_bn}</p>
                </div>

                {/* Prevention */}
                {result.prevention_bn && (
                  <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100">
                    <p className="text-xs font-extrabold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">🛡️ প্রতিরোধ</p>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">{result.prevention_bn}</p>
                  </div>
                )}

                {/* Common in BD warning */}
                {result.is_common_in_bd && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-xs font-bold text-amber-800">এই রোগ বাংলাদেশে প্রচলিত — সতর্ক থাকুন</p>
                  </div>
                )}
              </div>
            </div>

            {/* New Scan button */}
            <div className="flex justify-center gap-3">
              <button onClick={reset} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm">
                <RefreshCw className="w-4 h-4" />নতুন স্ক্যান
              </button>
            </div>
          </div>
        )}

        {/* ── Primary CTA — only show when content ready but no result/loading ── */}
        {hasContent && !loading && !result && (
          <div className="flex justify-center">
            <button onClick={analyze} className="btn-primary text-base py-4 px-10 rounded-2xl shadow-xl shadow-emerald-300/30 text-base">
              <Scan className="w-5 h-5" />রোগ সনাক্তকরণ শুরু করুন
            </button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}
