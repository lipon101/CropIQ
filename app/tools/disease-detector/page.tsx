"use client"

import { useState, useRef, useCallback } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import {
  Upload, Camera, Microscope, Leaf, ShieldAlert, ShieldCheck,
  Loader2, Save, AlertCircle, ChevronDown, ChevronUp, Trash2, Sparkles, Info, Search
} from "lucide-react"
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
    if (file.size > 10 * 1024 * 1024) {
      setError(language === "bn" ? "ছবির আকার ১০MB এর বেশি হতে পারবে না" : "Image must be under 10MB")
      return
    }
    setError("")
    setResult(null)
    setSaved(false)
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [language])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) handleFile(file)
  }, [handleFile])

  const handleAnalyze = async () => {
    setError("")
    setResult(null)
    setLoading(true)
    try {
      let response: Response
      if (mode === "image" && imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)
        formData.append("language", language)
        response = await fetch("/api/disease-detect", { method: "POST", body: formData })
      } else if (mode === "text" && description.trim()) {
        response = await fetch("/api/disease-detect-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description, language }),
        })
      } else {
        setError(language === "bn" ? "দয়া করে ছবি আপলোড বা লক্ষণ লিখুন" : "Please upload an image or describe symptoms")
        setLoading(false)
        return
      }
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Analysis failed")
      }
      const data = await response.json()
      if (data.result) setResult(data.result)
      else setError(language === "bn" ? "বিশ্লেষণ ব্যর্থ হয়েছে" : "Analysis failed. Try with a clearer photo.")
    } catch (err: any) {
      setError(err.message || (language === "bn" ? "কিছু সমস্যা হয়েছে" : "Something went wrong"))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!result) return
    try {
      await fetch("/api/disease-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop_type: result.crop_type, disease_name: result.disease_name,
          confidence: result.confidence, cause: result.cause,
          remedy_bn: result.remedy_bn, remedy_en: result.remedy_en,
          prevention_bn: result.prevention_bn, prevention_en: result.prevention_en,
          is_common_in_bd: result.is_common_in_bd,
        }),
      })
      setSaved(true)
    } catch {
      setError(language === "bn" ? "সংরক্ষণ ব্যর্থ হয়েছে" : "Failed to save")
    }
  }

  const reset = () => {
    setImage(null); setImageFile(null); setDescription("")
    setResult(null); setError(""); setSaved(false)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50/50 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.04)_0%,transparent_50%)]" />
        <div className="container-cropiq relative py-12 md:py-16">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "bn" ? "এআই-চালিত টুল" : "AI-Powered Tool"} — <span className="text-amber-800">BETA</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {language === "bn" ? <><span className="text-red-600">এআই</span> ফসল রোগ সনাক্তকারী</> : <><span className="text-red-600">AI</span> Crop Disease Detector</>}
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed">{language === "bn" ? "আপনার ফসলের ছবি আপলোড করুন অথবা লক্ষণ বর্ণনা করুন। আমাদের এআই সাথে সাথে রোগ সনাক্ত করবে এবং চিকিৎসার পরামর্শ দেবে — বাংলায়।" : "Upload a photo of your crop or describe symptoms. Our AI will identify the disease and suggest treatments — in Bengali."}</p>
                <p className="text-gray-500 text-sm">{language === "bn" ? "আপনার ফসলের সমস্যা বাংলায় বর্ণনা করুন — উত্তর পাবেন তৎক্ষণাৎ।" : "Describe your plant's symptoms in Bangla — get instant answers."}</p>
              </div>
            </div>
            <div className="hidden lg:flex lg:col-span-2 justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-red-200/60 to-amber-200/40 rounded-full animate-pulse-gentle" />
                <div className="absolute inset-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Microscope className="w-20 h-20 text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container-cropiq">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">{language === "bn" ? "কীভাবে কাজ করে" : "How It Works"}</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { num: "1", title: language === "bn" ? "ছবি আপলোড করুন" : "Upload photo", desc: language === "bn" ? "আক্রান্ত ফসলের ছবি তুলুন বা আপলোড করুন।" : "Take or upload a photo of the affected crop." },
              { num: "2", title: language === "bn" ? "এআই বিশ্লেষণ" : "AI analyzes", desc: language === "bn" ? "এআই স্বয়ংক্রিয়ভাবে রোগ সনাক্ত করবে।" : "AI automatically identifies the disease." },
              { num: "3", title: language === "bn" ? "পরামর্শ পান" : "Get treatment", desc: language === "bn" ? "রোগের কারণ, চিকিৎসা ও প্রতিরোধের পরামর্শ পান বাংলায়।" : "Get cause, treatment & prevention advice in Bengali." },
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-leaf-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">{step.num}</div>
                <div><h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4><p className="text-xs text-gray-500 mt-0.5">{step.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool Area */}
      <section className="py-10 bg-gray-50/50">
        <div className="container-cropiq max-w-2xl">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button onClick={() => setMode("image")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === "image" ? "bg-leaf-600 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}>
                <Upload className="w-4 h-4 inline mr-1.5" />{language === "bn" ? "ছবি আপলোড" : "Upload Image"}
              </button>
              <button onClick={() => setMode("text")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === "text" ? "bg-leaf-600 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}>
                <Search className="w-4 h-4 inline mr-1.5" />{language === "bn" ? "লক্ষণ লিখুন" : "Describe Symptoms"}
              </button>
            </div>
          </div>

          {mode === "image" ? (
            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${image ? "border-leaf-300 bg-leaf-50/30" : "border-gray-300 hover:border-leaf-400 bg-white"}`}>
              {image ? (
                <div className="space-y-4">
                  <img src={image} alt="Crop preview" className="max-h-64 mx-auto rounded-xl shadow-md" />
                  <div className="flex justify-center gap-3">
                    <button onClick={reset} className="btn-secondary text-sm py-2"><Trash2 className="w-4 h-4 inline mr-1" />{language === "bn" ? "সরান" : "Remove"}</button>
                    <button onClick={handleAnalyze} disabled={loading} className="btn-primary text-sm py-2 shadow-lg shadow-leaf-200">{loading ? <Loader2 className="w-4 h-4 inline mr-1 animate-spin" /> : <Microscope className="w-4 h-4 inline mr-1" />}{loading ? t("tools.disease.analyzing") : t("tools.disease.analyze")}</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto"><Upload className="w-8 h-8 text-red-600" /></div>
                  <div><p className="font-medium text-gray-700">{t("tools.disease.upload")}</p><p className="text-sm text-gray-400 mt-1">{language === "bn" ? "JPG, PNG বা WebP (সর্বোচ্চ ১০MB)" : "JPG, PNG or WebP (max 10MB)"}</p></div>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-sm py-2 shadow-lg shadow-leaf-200"><Upload className="w-4 h-4 inline mr-1" />{language === "bn" ? "ছবি নির্বাচন করুন" : "Choose Image"}</button>
                    <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-sm py-2"><Camera className="w-4 h-4 inline mr-1" />{t("tools.disease.camera")}</button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none resize-none text-sm" placeholder={language === "bn" ? "আপনার ফসলের লক্ষণ বর্ণনা করুন...\n\nযেমন: ধান গাছের পাতা হলুদ হয়ে যাচ্ছে এবং পাতায় বাদামী দাগ দেখা যাচ্ছে। গাছের বৃদ্ধি থমকে গেছে।" : "Describe your crop's symptoms...\n\ne.g., Rice plant leaves are turning yellow with brown spots. Plant growth is stunted."} />
              <button onClick={handleAnalyze} disabled={loading || !description.trim()} className="btn-primary w-full mt-4 text-sm shadow-lg shadow-leaf-200">{loading ? <Loader2 className="w-4 h-4 inline mr-1 animate-spin" /> : <Microscope className="w-4 h-4 inline mr-1" />}{loading ? t("tools.disease.analyzing") : t("tools.disease.analyze")}</button>
            </div>
          )}

          {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}</div>}

          {loading && (
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-8 text-center animate-pulse-gentle shadow-sm">
              <Loader2 className="w-8 h-8 text-leaf-600 animate-spin mx-auto mb-3" /><p className="text-gray-600 font-medium">{t("tools.disease.analyzing")}</p><p className="text-sm text-gray-400 mt-1">{language === "bn" ? "আপনার ফসলের ছবি বিশ্লেষণ করা হচ্ছে..." : "Analyzing your crop image..."}</p>
            </div>
          )}

          {result && !loading && (
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-slide-up space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">{result.is_common_in_bd ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-leaf-500" />}{t("tools.disease.result")}</h3>
                <button onClick={handleSave} disabled={saved} className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${saved ? "bg-leaf-100 text-leaf-700" : "bg-gray-100 hover:bg-leaf-100 text-gray-600 hover:text-leaf-700"}`}><Save className="w-3.5 h-3.5" />{saved ? t("tools.disease.saved") : t("tools.disease.save")}</button>
              </div>
              <div><div className="flex justify-between text-sm mb-1"><span className="text-gray-500">{t("tools.disease.confidence")}</span><span className="font-bold text-leaf-700">{Math.round(result.confidence * 100)}%</span></div><div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${result.confidence > 0.8 ? "bg-leaf-500" : result.confidence > 0.5 ? "bg-earth-500" : "bg-red-500"}`} style={{ width: `${result.confidence * 100}%` }} /></div></div>
              <div className="grid sm:grid-cols-2 gap-3"><InfoBox label={t("tools.disease.crop")} value={result.crop_type} /><InfoBox label={t("tools.disease.disease")} value={result.disease_name} highlight /><InfoBox label={t("tools.disease.cause")} value={result.cause} /></div>
              <div className="bg-leaf-50 rounded-xl p-4"><h4 className="font-semibold text-leaf-800 mb-2">🇧🇩 {t("tools.disease.remedy")} (বাংলা)</h4><p className="text-gray-700 text-sm whitespace-pre-line">{result.remedy_bn}</p></div>
              {result.prevention_bn && <div className="bg-blue-50 rounded-xl p-4"><h4 className="font-semibold text-blue-800 mb-2">🛡️ {t("tools.disease.prevention")} (বাংলা)</h4><p className="text-gray-700 text-sm whitespace-pre-line">{result.prevention_bn}</p></div>}
              {result.is_common_in_bd && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2"><ShieldAlert className="w-4 h-4" />{language === "bn" ? "এই রোগ বাংলাদেশে প্রচলিত" : "This disease is common in Bangladesh"}</div>}
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50/50 border-t border-amber-100">
        <div className="container-cropiq"><div className="max-w-3xl mx-auto flex gap-3 text-sm text-amber-800"><Info className="w-5 h-5 shrink-0 mt-0.5" /><div><p className="font-semibold mb-1">{language === "bn" ? "ডিসক্লেইমার" : "Disclaimer"}</p><p className="text-amber-700 leading-relaxed">{language === "bn" ? "এআই পরামর্শ তথ্যমূলক উদ্দেশ্যে। গুরুতর সমস্যায় কৃষি বিশেষজ্ঞের পরামর্শ নিন।" : "AI advice is for informational purposes only. For serious crop problems, consult a local agricultural extension officer."}</p></div></div></div>
      </section>
    </div>
  )
}

function InfoBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return <div className={`rounded-xl p-3 ${highlight ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}><p className="text-xs text-gray-400 mb-1">{label}</p><p className={`text-sm font-semibold ${highlight ? "text-red-700" : "text-gray-800"}`}>{value || "—"}</p></div>
}
