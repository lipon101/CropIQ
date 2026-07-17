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
      <div className="space-y-2 flex-1 min-h-0 pt-2">
        {/* Mode Switch — icon only */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white rounded-2xl border-2 border-gray-100 p-1.5 shadow-md">
            <button onClick={() => { setMode("image"); reset() }} className={`p-3 rounded-xl transition-all duration-200 ${mode === "image" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
              <ImageIcon className="w-5 h-5" />
            </button>
            <button onClick={() => { setMode("text"); reset() }} className={`p-3 rounded-xl transition-all duration-200 ${mode === "text" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload Zone — centered */}
        {!result && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            {mode === "image" ? (
              <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${image ? "border-emerald-400 bg-emerald-50/30" : "border-gray-200 hover:border-gray-400 bg-white"}`}>
                {image ? (
                  <div className="p-4 flex items-center gap-4">
                    <img src={image} alt="" className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200" />
                    <div className="flex items-center gap-2">
                      <button onClick={reset} className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} className="w-full p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-gray-600 transition-colors">
                    <Upload className="w-8 h-8" />
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-4 rounded-2xl bg-transparent outline-none text-sm resize-none" placeholder="লক্ষণ বর্ণনা করুন..." />
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2.5"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-10 text-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">বিশ্লেষণ চলছে...</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-2 flex-1 min-h-0 pt-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><ShieldAlert className="w-5 h-5 text-red-500" /></div>
                <div>
                  <h3 className="font-extrabold text-gray-900">{result.disease_name}</h3>
                  <p className="text-xs text-gray-500">{result.crop_type || "ফসল"}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-xs font-extrabold text-emerald-600 shadow-sm">
                    <Scan className="w-3 h-3" />{Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-lg p-2 text-center"><p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wide mb-1">নির্ভুলতা</p><p className="text-lg font-extrabold text-emerald-700">{Math.round(result.confidence * 100)}%</p></div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">ফসল</p><p className="text-sm font-extrabold text-gray-800">{result.crop_type || "—"}</p></div>
                  <div className="bg-red-50 rounded-lg p-2 text-center"><p className="text-[11px] font-bold text-red-400 uppercase tracking-wide mb-1">কারণ</p><p className="text-xs font-extrabold text-red-600">{result.cause || "—"}</p></div>
                </div>
                <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
                  <p className="text-xs font-extrabold text-emerald-700 uppercase tracking-wide mb-2">💊 চিকিৎসা</p>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">{result.remedy_bn}</p>
                </div>
                {result.prevention_bn && (
                  <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs font-extrabold text-blue-700 uppercase tracking-wide mb-2">🛡️ প্রতিরোধ</p>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">{result.prevention_bn}</p>
                  </div>
                )}
                {result.is_common_in_bd && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-xs font-bold text-amber-800">এই রোগ বাংলাদেশে প্রচলিত</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all">
                <RefreshCw className="w-4 h-4" />নতুন স্ক্যান
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        {hasContent && !loading && !result && (
          <div className="flex justify-center">
            <button onClick={analyze} className="btn-primary py-3 px-6 rounded-xl shadow-lg shadow-emerald-300/20 text-sm">
              <Scan className="w-5 h-5" />রোগ সনাক্তকরণ শুরু করুন
            </button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}
