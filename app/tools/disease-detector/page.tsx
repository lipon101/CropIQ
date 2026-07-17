"use client"

import { useState, useRef, useCallback } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import {
  Upload, Camera, Microscope, Loader2, Save, AlertCircle, Trash2, Sparkles, Info, Search,
  ShieldAlert, ShieldCheck, CheckCircle, ImageIcon, FileText
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
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50/60 via-white to-orange-50/40 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.06)_0%,transparent_60%)]" />
        <div className="container-cropiq relative py-12 md:py-16">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-5 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "bn" ? "এআই-চালিত টুল" : "AI-Powered Tool"} — <span className="opacity-90">BETA</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {language === "bn" ? (
                  <><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600">এআই</span> ফসল রোগ সনাক্তকারী</>
                ) : (
                  <><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600">AI</span> Crop Disease Detector</>
                )}
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {language === "bn"
                    ? "আপনার ফসলের ছবি আপলোড করুন অথবা লক্ষণ বর্ণনা করুন। আমাদের এআই সাথে সাথে রোগ সনাক্ত করবে এবং চিকিৎসার পরামর্শ দেবে — বাংলায়।"
                    : "Upload a photo of your crop or describe symptoms. Our AI will identify the disease and suggest treatments — in Bengali."}
                </p>
                <p className="text-gray-500 text-sm">
                  {language === "bn"
                    ? "২৫+ ফসলের রোগ · ৯৮% নির্ভুলতা · বাংলা ও ইংরেজি"
                    : "25+ crop diseases · 98% accuracy · Bengali & English"}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex lg:col-span-2 justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-red-300/40 to-amber-300/30 rounded-full animate-pulse-gentle" />
                <div className="absolute inset-6 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <Microscope className="w-20 h-20 text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-cropiq">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">{language === "bn" ? "কীভাবে কাজ করে" : "HOW IT WORKS"}</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { num: "1", icon: Upload, title: language === "bn" ? "ছবি আপলোড করুন" : "Upload photo", desc: language === "bn" ? "আক্রান্ত ফসলের ছবি তুলুন বা আপলোড করুন।" : "Take or upload a photo of the affected crop." },
              { num: "2", icon: Sparkles, title: language === "bn" ? "এআই বিশ্লেষণ" : "AI analyzes", desc: language === "bn" ? "এআই স্বয়ংক্রিয়ভাবে রোগ সনাক্ত করবে।" : "AI automatically identifies the disease." },
              { num: "3", icon: CheckCircle, title: language === "bn" ? "পরামর্শ পান" : "Get treatment", desc: language === "bn" ? "রোগের কারণ, চিকিৎসা ও প্রতিরোধের পরামর্শ পান বাংলায়।" : "Get cause, treatment & prevention advice in Bengali." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-leaf-500 to-leaf-700 text-white rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-md">{step.num}</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool Area */}
      <section className="py-10 bg-gray-50/50">
        <div className="container-cropiq max-w-2xl">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200">
              <button onClick={() => setMode("image")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                mode === "image" ? "bg-gradient-to-r from-leaf-500 to-leaf-700 text-white shadow-lg shadow-leaf-200/50" : "text-gray-500 hover:text-gray-700"
              }`}>
                <ImageIcon className="w-4 h-4" />
                {language === "bn" ? "ছবি আপলোড" : "Upload Image"}
              </button>
              <button onClick={() => setMode("text")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                mode === "text" ? "bg-gradient-to-r from-leaf-500 to-leaf-700 text-white shadow-lg shadow-leaf-200/50" : "text-gray-500 hover:text-gray-700"
              }`}>
                <FileText className="w-4 h-4" />
                {language === "bn" ? "লক্ষণ লিখুন" : "Describe Symptoms"}
              </button>
            </div>
          </div>

          {mode === "image" ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${
                image ? "border-leaf-400 bg-leaf-50/40 shadow-sm" : "border-gray-300 hover:border-leaf-400 bg-white hover:shadow-md"
              }`}
            >
              {image ? (
                <div className="space-y-5">
                  <img src={image} alt="Crop preview" className="max-h-72 mx-auto rounded-2xl shadow-lg" />
                  <div className="flex justify-center gap-3">
                    <button onClick={reset} className="btn-secondary text-sm py-2.5 px-5">
                      <Trash2 className="w-4 h-4 inline mr-2" />
                      {language === "bn" ? "সরান" : "Remove"}
                    </button>
                    <button onClick={handleAnalyze} disabled={loading} className="btn-primary text-sm py-2.5 px-6">
                      {loading ? <Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> : <Microscope className="w-4 h-4 inline mr-2" />}
                      {loading ? t("tools.disease.analyzing") : t("tools.disease.analyze")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-3xl flex items-center justify-center mx-auto">
                    <Upload className="w-10 h-10 text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{t("tools.disease.upload")}</p>
                    <p className="text-sm text-gray-400 mt-1.5">
                      {language === "bn" ? "JPG, PNG বা WebP (সর্বোচ্চ ১০MB)" : "JPG, PNG or WebP (max 10MB)"}
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-sm py-3 px-6">
                      <Upload className="w-4 h-4 inline mr-2" />
                      {language === "bn" ? "ছবি নির্বাচন করুন" : "Choose Image"}
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-sm py-3 px-6">
                      <Camera className="w-4 h-4 inline mr-2" />
                      {t("tools.disease.camera")}
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-50 outline-none resize-none text-sm bg-gray-50/50 focus:bg-white transition-all"
                placeholder={language === "bn"
                  ? "আপনার ফসলের লক্ষণ বর্ণনা করুন...\n\nযেমন: ধান গাছের পাতা হলুদ হয়ে যাচ্ছে এবং পাতায় বাদামী দাগ দেখা যাচ্ছে। গাছের বৃদ্ধি থমকে গেছে।"
                  : "Describe your crop's symptoms...\n\ne.g., Rice plant leaves are turning yellow with brown spots. Plant growth is stunted."}
              />
              <button onClick={handleAnalyze} disabled={loading || !description.trim()} className="btn-primary w-full mt-5 text-sm">
                {loading ? <Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> : <Microscope className="w-4 h-4 inline mr-2" />}
                {loading ? t("tools.disease.analyzing") : t("tools.disease.analyze")}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" /> {error}
            </div>
          )}

          {loading && (
            <div className="mt-6 bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-sm animate-pulse-gentle">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-leaf-200 rounded-full animate-ping opacity-25" />
                <Loader2 className="relative w-16 h-16 text-leaf-600 animate-spin" />
              </div>
              <p className="text-gray-700 font-bold text-lg">{t("tools.disease.analyzing")}</p>
              <p className="text-sm text-gray-400 mt-1.5">
                {language === "bn" ? "আপনার ফসলের ছবি বিশ্লেষণ করা হচ্ছে..." : "Analyzing your crop image with AI..."}
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden animate-slide-up">
              {/* Result Header */}
              <div className={`px-6 py-4 flex items-center justify-between ${
                result.confidence > 0.8
                  ? "bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100"
                  : "bg-gradient-to-r from-leaf-50 to-emerald-50 border-b border-leaf-100"
              }`}>
                <div className="flex items-center gap-3">
                  {result.is_common_in_bd
                    ? <ShieldAlert className="w-6 h-6 text-red-500" />
                    : <ShieldCheck className="w-6 h-6 text-leaf-500" />
                  }
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">{t("tools.disease.result")}</h3>
                    <p className="text-xs text-gray-500">
                      {result.crop_type} — {result.disease_name}
                    </p>
                  </div>
                </div>
                <button onClick={handleSave} disabled={saved} className={`text-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
                  saved
                    ? "bg-leaf-500 text-white shadow-sm"
                    : "bg-white hover:bg-leaf-50 text-gray-600 hover:text-leaf-700 border border-gray-200 shadow-sm"
                }`}>
                  <Save className="w-4 h-4" />
                  {saved ? t("tools.disease.saved") : t("tools.disease.save")}
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 font-medium">{t("tools.disease.confidence")}</span>
                    <span className={`font-extrabold ${
                      result.confidence > 0.8 ? "text-leaf-700" : result.confidence > 0.5 ? "text-amber-700" : "text-red-700"
                    }`}>{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        result.confidence > 0.8
                          ? "bg-gradient-to-r from-leaf-500 to-emerald-500"
                          : result.confidence > 0.5
                          ? "bg-gradient-to-r from-amber-500 to-orange-500"
                          : "bg-gradient-to-r from-red-500 to-rose-500"
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <InfoBox label={t("tools.disease.crop")} value={result.crop_type} icon="🌾" />
                  <InfoBox label={t("tools.disease.disease")} value={result.disease_name} highlight icon="🦠" />
                  <InfoBox label={t("tools.disease.cause")} value={result.cause} icon="🔬" />
                </div>

                {/* Remedy */}
                <div className="bg-gradient-to-r from-leaf-50 to-emerald-50 rounded-2xl p-5 border border-leaf-100">
                  <h4 className="font-bold text-leaf-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">💊</span> {t("tools.disease.remedy")} (বাংলা)
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{result.remedy_bn}</p>
                </div>

                {/* Prevention */}
                {result.prevention_bn && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <span className="text-lg">🛡️</span> {t("tools.disease.prevention")} (বাংলা)
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{result.prevention_bn}</p>
                  </div>
                )}

                {/* Common in BD warning */}
                {result.is_common_in_bd && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-sm flex items-center gap-3 font-medium">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    {language === "bn" ? "এই রোগ বাংলাদেশে প্রচলিত — সতর্ক থাকুন" : "This disease is common in Bangladesh — stay vigilant"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50/50 border-t border-amber-100">
        <div className="container-cropiq">
          <div className="max-w-3xl mx-auto flex gap-3 text-sm text-amber-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">{language === "bn" ? "ডিসক্লেইমার" : "Disclaimer"}</p>
              <p className="text-amber-700 leading-relaxed">
                {language === "bn"
                  ? "এআই পরামর্শ তথ্যমূলক উদ্দেশ্যে। গুরুতর সমস্যায় কৃষি বিশেষজ্ঞের পরামর্শ নিন।"
                  : "AI advice is for informational purposes only. For serious crop problems, consult a local agricultural extension officer."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function InfoBox({ label, value, highlight, icon }: { label: string; value: string; highlight?: boolean; icon?: string }) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? "bg-gradient-to-r from-red-50 to-rose-50 border border-red-100" : "bg-gray-50 border border-gray-100"}`}>
      <p className="text-xs text-gray-400 mb-1.5 font-medium">{label}</p>
      <p className={`text-sm font-bold flex items-center gap-2 ${highlight ? "text-red-700" : "text-gray-800"}`}>
        {icon && <span>{icon}</span>}
        {value || "—"}
      </p>
    </div>
  )
}
