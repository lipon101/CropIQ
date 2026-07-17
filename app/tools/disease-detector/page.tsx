"use client"

import { useState, useRef, useCallback } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import {
  Upload, Camera, Microscope, Leaf, ShieldAlert, ShieldCheck,
  Loader2, Save, AlertCircle, ChevronDown, ChevronUp, Trash2,
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
      if (data.result) {
        setResult(data.result)
      } else {
        setError(language === "bn" ? "বিশ্লেষণ ব্যর্থ হয়েছে" : "Analysis failed. Try with a clearer photo.")
      }
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
          crop_type: result.crop_type,
          disease_name: result.disease_name,
          confidence: result.confidence,
          cause: result.cause,
          remedy_bn: result.remedy_bn,
          remedy_en: result.remedy_en,
          prevention_bn: result.prevention_bn,
          prevention_en: result.prevention_en,
          is_common_in_bd: result.is_common_in_bd,
        }),
      })
      setSaved(true)
    } catch {
      setError(language === "bn" ? "সংরক্ষণ ব্যর্থ হয়েছে" : "Failed to save")
    }
  }

  const reset = () => {
    setImage(null)
    setImageFile(null)
    setDescription("")
    setResult(null)
    setError("")
    setSaved(false)
  }

  return (
    <div className="container-cropiq py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-2xl mb-4">
          <Microscope className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t("tools.disease.title")}</h1>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">{t("tools.disease.subtitle")}</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode("image")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === "image" ? "bg-white shadow text-leaf-700" : "text-gray-500"}`}
          >
            <Upload className="w-4 h-4 inline mr-1" />
            {language === "bn" ? "ছবি আপলোড" : "Upload Image"}
          </button>
          <button
            onClick={() => setMode("text")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === "text" ? "bg-white shadow text-leaf-700" : "text-gray-500"}`}
          >
            <AlertCircle className="w-4 h-4 inline mr-1" />
            {language === "bn" ? "লক্ষণ লিখুন" : "Describe Symptoms"}
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="max-w-2xl mx-auto">
        {mode === "image" ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              image ? "border-leaf-300 bg-leaf-50/30" : "border-gray-300 hover:border-leaf-400 bg-white"
            }`}
          >
            {image ? (
              <div className="space-y-4">
                <img src={image} alt="Crop preview" className="max-h-64 mx-auto rounded-xl shadow-md" />
                <div className="flex justify-center gap-3">
                  <button onClick={reset} className="btn-secondary text-sm py-2">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    {language === "bn" ? "সরান" : "Remove"}
                  </button>
                  <button onClick={handleAnalyze} disabled={loading} className="btn-primary text-sm py-2">
                    {loading ? (
                      <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                    ) : (
                      <Microscope className="w-4 h-4 inline mr-1" />
                    )}
                    {loading ? t("tools.disease.analyzing") : t("tools.disease.analyze")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-leaf-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-leaf-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">{t("tools.disease.upload")}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {language === "bn" ? "JPG, PNG বা WebP (সর্বোচ্চ ১০MB)" : "JPG, PNG or WebP (max 10MB)"}
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-sm py-2">
                    <Upload className="w-4 h-4 inline mr-1" />
                    {language === "bn" ? "ছবি নির্বাচন করুন" : "Choose Image"}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary text-sm py-2"
                  >
                    <Camera className="w-4 h-4 inline mr-1" />
                    {t("tools.disease.camera")}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="card-cropiq">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="input-field"
              placeholder={
                language === "bn"
                  ? "আপনার ফসলের লক্ষণ বর্ণনা করুন...\n\nযেমন: ধান গাছের পাতা হলুদ হয়ে যাচ্ছে এবং পাতায় বাদামী দাগ দেখা যাচ্ছে। গাছের বৃদ্ধি থমকে গেছে।"
                  : "Describe your crop's symptoms...\n\ne.g., Rice plant leaves are turning yellow with brown spots. Plant growth is stunted."
              }
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !description.trim()}
              className="btn-primary w-full mt-4 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
              ) : (
                <Microscope className="w-4 h-4 inline mr-1" />
              )}
              {loading ? t("tools.disease.analyzing") : t("tools.disease.analyze")}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-6 card-cropiq text-center py-8 animate-pulse-gentle">
            <Loader2 className="w-8 h-8 text-leaf-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-medium">{t("tools.disease.analyzing")}</p>
            <p className="text-sm text-gray-400 mt-1">
              {language === "bn"
                ? "আপনার ফসলের ছবি বিশ্লেষণ করা হচ্ছে..."
                : "Analyzing your crop image..."}
            </p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="mt-6 card-cropiq animate-slide-up space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {result.is_common_in_bd ? (
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-leaf-500" />
                )}
                {t("tools.disease.result")}
              </h3>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                  saved ? "bg-leaf-100 text-leaf-700" : "bg-gray-100 hover:bg-leaf-100 text-gray-600 hover:text-leaf-700"
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                {saved ? t("tools.disease.saved") : t("tools.disease.save")}
              </button>
            </div>

            {/* Confidence Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">{t("tools.disease.confidence")}</span>
                <span className="font-bold text-leaf-700">{Math.round(result.confidence * 100)}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    result.confidence > 0.8 ? "bg-leaf-500" : result.confidence > 0.5 ? "bg-earth-500" : "bg-red-500"
                  }`}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoBox label={t("tools.disease.crop")} value={result.crop_type} />
              <InfoBox label={t("tools.disease.disease")} value={result.disease_name} highlight />
              <InfoBox label={t("tools.disease.cause")} value={result.cause} />
            </div>

            {/* Treatment (Bengali) */}
            <div className="bg-leaf-50 rounded-xl p-4">
              <h4 className="font-semibold text-leaf-800 mb-2">
                🇧🇩 {t("tools.disease.remedy")} (বাংলা)
              </h4>
              <p className="text-gray-700 text-sm whitespace-pre-line">{result.remedy_bn}</p>
            </div>

            {/* Prevention (Bengali) */}
            {result.prevention_bn && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  🛡️ {t("tools.disease.prevention")} (বাংলা)
                </h4>
                <p className="text-gray-700 text-sm whitespace-pre-line">{result.prevention_bn}</p>
              </div>
            )}

            {/* Common in BD Badge */}
            {result.is_common_in_bd && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {language === "bn"
                  ? "এই রোগ বাংলাদেশে প্রচলিত"
                  : "This disease is common in Bangladesh"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? "text-red-700" : "text-gray-800"}`}>{value || "—"}</p>
    </div>
  )
}
