"use client"

import { useState, useRef, useCallback } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Upload, Camera, Microscope, Loader2, Save, AlertCircle, Trash2, Search, ShieldAlert, ShieldCheck, ImageIcon, FileText } from "lucide-react"
import type { DiagnosisResult } from "@/types"

export default function DiseaseDetectorPage() {
  const { t, language } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const [mode, setMode] = useState<"image" | "text">("image")

  const handleFile = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) { setError(language === "bn" ? "ছবি ১০MB এর বেশি নয়" : "Image must be under 10MB"); return }
    setError(""); setResult(null); setSaved(false); setImageFile(file)
    const r = new FileReader(); r.onload = e => setImage(e.target?.result as string); r.readAsDataURL(file)
  }, [language])
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleFile(f) }, [handleFile])

  const analyze = async () => {
    setError(""); setResult(null); setLoading(true)
    try {
      let r: Response
      if (mode === "image" && imageFile) { const fd = new FormData(); fd.append("file", imageFile); fd.append("language", language); r = await fetch("/api/disease-detect", { method: "POST", body: fd }) }
      else if (mode === "text" && description.trim()) { r = await fetch("/api/disease-detect-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description, language }) }) }
      else { setError(language === "bn" ? "ছবি বা লক্ষণ দিন" : "Upload or describe"); setLoading(false); return }
      if (!r.ok) throw new Error((await r.json()).error || "Failed")
      const d = await r.json(); d.result ? setResult(d.result) : setError(language === "bn" ? "বিশ্লেষণ ব্যর্থ" : "Analysis failed")
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const save = async () => { if (!result) return; try { await fetch("/api/disease-save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) }); setSaved(true) } catch { setError(language === "bn" ? "সংরক্ষণ ব্যর্থ" : "Save failed") } }
  const reset = () => { setImage(null); setImageFile(null); setDescription(""); setResult(null); setError(""); setSaved(false) }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-sm"><Microscope className="w-4.5 h-4.5 text-white" /></div>
        <div className="flex-1"><h1 className="font-bold text-gray-900 text-sm">{language === "bn" ? "ফসল রোগ সনাক্তকারী" : "Crop Disease Detector"}</h1><p className="text-[11px] text-gray-400">{language === "bn" ? "ছবি আপলোড বা লক্ষণ লিখুন" : "Upload photo or describe symptoms"}</p></div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button onClick={() => setMode("image")} className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${mode==="image"?"bg-white shadow text-gray-900":"text-gray-500"}`}><ImageIcon className="w-3.5 h-3.5" />{language==="bn"?"ছবি":"Photo"}</button>
          <button onClick={() => setMode("text")} className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${mode==="text"?"bg-white shadow text-gray-900":"text-gray-500"}`}><FileText className="w-3.5 h-3.5" />{language==="bn"?"লক্ষণ":"Text"}</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-3">
          {mode === "image" ? (
            <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all ${image?"border-leaf-400 bg-leaf-50/30":"border-gray-300 hover:border-leaf-400 bg-white"}`}>
              {image ? (
                <div className="space-y-3">
                  <img src={image} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow-md" />
                  <div className="flex justify-center gap-2">
                    <button onClick={reset} className="btn-secondary text-sm py-2"><Trash2 className="w-4 h-4 mr-1"/>{language==="bn"?"সরান":"Remove"}</button>
                    <button onClick={analyze} disabled={loading} className="btn-primary text-sm py-2">{loading?<Loader2 className="w-4 h-4 mr-1 animate-spin"/>:<Microscope className="w-4 h-4 mr-1"/>{loading?t("tools.disease.analyzing"):t("tools.disease.analyze")}}</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto"><Upload className="w-7 h-7 text-red-500"/></div>
                  <p className="font-semibold text-gray-700">{t("tools.disease.upload")}</p>
                  <p className="text-xs text-gray-400">{language==="bn"?"JPG, PNG বা WebP (সর্বোচ্চ ১০MB)":"JPG, PNG or WebP (max 10MB)"}</p>
                  <div className="flex justify-center gap-2">
                    <button onClick={()=>fileInputRef.current?.click()} className="btn-primary text-sm py-2"><Upload className="w-4 h-4 mr-1"/>{language==="bn"?"ছবি নির্বাচন":"Choose"}</button>
                    <button onClick={()=>fileInputRef.current?.click()} className="btn-secondary text-sm py-2"><Camera className="w-4 h-4 mr-1"/>{t("tools.disease.camera")}</button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])}/>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
              <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} className="input-field resize-none text-sm" placeholder={language==="bn"?"লক্ষণ বর্ণনা করুন...\nযেমন: ধান পাতায় বাদামী দাগ পড়ছে":"Describe symptoms...\ne.g., Rice leaves have brown spots."}/>
              <button onClick={analyze} disabled={loading||!description.trim()} className="btn-primary w-full text-sm">{loading?<Loader2 className="w-4 h-4 mr-1 animate-spin"/>:<Microscope className="w-4 h-4 mr-1"/>{loading?t("tools.disease.analyzing"):t("tools.disease.analyze")}}</button>
            </div>
          )}

          {error&&<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0"/>{error}</div>}
          {loading&&<div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm"><Loader2 className="w-8 h-8 text-leaf-600 animate-spin mx-auto mb-3"/><p className="font-semibold text-gray-700">{t("tools.disease.analyzing")}</p><p className="text-xs text-gray-400 mt-1">{language==="bn"?"এআই বিশ্লেষণ করছে...":"AI analyzing..."}</p></div>}

          {result&&!loading&&(
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className={`px-4 py-3 flex items-center justify-between ${result.confidence>0.8?"bg-red-50 border-b border-red-100":"bg-leaf-50 border-b border-leaf-100"}`}>
                <div className="flex items-center gap-2">{result.is_common_in_bd?<ShieldAlert className="w-5 h-5 text-red-500"/>:<ShieldCheck className="w-5 h-5 text-leaf-500"/>}<div><h3 className="font-bold text-gray-900 text-sm">{result.crop_type} — {result.disease_name}</h3></div></div>
                <button onClick={save} disabled={saved} className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 ${saved?"bg-leaf-500 text-white":"bg-white border border-gray-200 text-gray-600 hover:bg-leaf-50"}`}><Save className="w-3.5 h-3.5"/>{saved?t("tools.disease.saved"):t("tools.disease.save")}</button>
              </div>
              <div className="p-4 space-y-3">
                <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">{t("tools.disease.confidence")}</span><span className="font-bold text-leaf-700">{Math.round(result.confidence*100)}%</span></div><div className="h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${result.confidence>0.8?"bg-leaf-500":result.confidence>0.5?"bg-amber-500":"bg-red-500"}`} style={{width:`${result.confidence*100}%`}}/></div></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-2.5"><p className="text-[10px] text-gray-400">{t("tools.disease.crop")}</p><p className="text-xs font-bold text-gray-800">{result.crop_type||"—"}</p></div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-2.5"><p className="text-[10px] text-gray-400">{t("tools.disease.disease")}</p><p className="text-xs font-bold text-red-700">{result.disease_name||"—"}</p></div>
                  <div className="bg-gray-50 rounded-xl p-2.5"><p className="text-[10px] text-gray-400">{t("tools.disease.cause")}</p><p className="text-xs font-bold text-gray-800">{result.cause||"—"}</p></div>
                </div>
                <div className="bg-leaf-50 rounded-xl p-3"><p className="text-xs font-bold text-leaf-700 mb-1">💊 {t("tools.disease.remedy")}</p><p className="text-xs text-gray-700 whitespace-pre-line">{result.remedy_bn}</p></div>
                {result.prevention_bn&&<div className="bg-blue-50 rounded-xl p-3"><p className="text-xs font-bold text-blue-700 mb-1">🛡️ {t("tools.disease.prevention")}</p><p className="text-xs text-gray-700 whitespace-pre-line">{result.prevention_bn}</p></div>}
                {result.is_common_in_bd&&<div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-center gap-2 font-medium"><ShieldAlert className="w-4 h-4"/>{language==="bn"?"বাংলাদেশে প্রচলিত রোগ":"Common in Bangladesh"}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
