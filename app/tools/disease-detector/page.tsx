"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, Microscope, Loader2, AlertCircle, Trash2, ShieldAlert, ImageIcon, FileText, Scan, RefreshCw, Clock, ChevronRight, WifiOff, Wifi } from "lucide-react"
import { ToolPageLayout, TOOLS } from "@/components/tools/ToolPageLayout"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"
import { queueDelete, queueDeleteAll, getPendingCount, processQueue, isOnline } from "@/lib/offline-queue"
import type { DiagnosisResult } from "@/types"

export default function DiseaseDetectorPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<"image" | "text">("image")
  const [scanHistory, setScanHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())
  const [online, setOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [syncing, setSyncing] = useState(false)

  const fetchHistory = async () => {
    if (!user) return
    setHistoryLoading(true)
    try {
      const { data } = await supabase
        .from("disease_scans")
        .select("id, crop_type, disease_name, confidence, cause, remedy_bn, prevention_bn, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)
      if (data) setScanHistory(data)
    } catch {} finally { setHistoryLoading(false) }
  }

  useEffect(() => { fetchHistory() }, [user])

  // ── Online / Offline detection ──
  useEffect(() => {
    const update = () => setOnline(isOnline())
    const syncPending = async () => {
      if (!isOnline() || !user) return
      setSyncing(true)
      const result = await processQueue({
        deleteOne: async (scanId) => {
          const { error } = await supabase.from("disease_scans").delete().eq("id", scanId)
          return { error }
        }
      })
      const synced = result.synced
      if (result.synced > 0 || result.failed > 0) {
        await fetchHistory()
        // Re-read pending count after sync
        getPendingCount().then(setPendingCount)
      }
      setSyncing(false)
    }

    window.addEventListener("online", update)
    window.addEventListener("offline", update)
    setOnline(isOnline())
    getPendingCount().then(setPendingCount)

    // Sync on mount if online
    if (isOnline()) syncPending()

    return () => {
      window.removeEventListener("online", update)
      window.removeEventListener("offline", update)
    }
  }, [user])

  const deleteScan = async (id: number) => {
    if (!confirm("এই স্ক্যান রেকর্ড ডিলিট করতে চান?")) return

    // Start fade-out animation
    setDeletingIds(prev => new Set(prev).add(id))

    // 🔴 Offline → queue to IndexedDB, remove from UI immediately
    if (!isOnline() && user) {
      await queueDelete(id, user.id)
      setPendingCount(prev => prev + 1)
      setTimeout(() => {
        setScanHistory(prev => prev.filter(s => s.id !== id))
        setDeletingIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }, 300)
      return
    }

    // 🟢 Online → delete from Supabase directly
    const { error: deleteError } = await supabase.from("disease_scans").delete().eq("id", id)

    if (deleteError) {
      console.error("Delete failed:", deleteError)
      setDeletingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setError("ডিলিট করতে সমস্যা হয়েছে — আবার চেষ্টা করুন")
      return
    }

    // Supabase confirmed — animate out then remove
    setTimeout(() => {
      setScanHistory(prev => prev.filter(s => s.id !== id))
      setDeletingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 300)
  }

  const deleteAllScans = async () => {
    if (!user || scanHistory.length === 0) return
    if (!confirm(`সব ${scanHistory.length}টি স্ক্যান রেকর্ড ডিলিট করতে চান?`)) return

    const allIds = new Set(scanHistory.map(s => s.id))
    setDeletingIds(allIds)

    // 🔴 Offline → queue to IndexedDB
    if (!isOnline()) {
      await queueDeleteAll(user.id, scanHistory.map(s => s.id))
      setPendingCount(prev => prev + 1)
      setTimeout(() => {
        setScanHistory([])
        setDeletingIds(new Set())
      }, 300)
      return
    }

    // 🟢 Online → delete from Supabase
    const { error: deleteError } = await supabase.from("disease_scans").delete().eq("user_id", user.id)

    if (deleteError) {
      console.error("Delete all failed:", deleteError)
      setDeletingIds(new Set())
      setError("সব ডিলিট করতে সমস্যা হয়েছে — আবার চেষ্টা করুন")
      return
    }

    setTimeout(() => {
      setScanHistory([])
      setDeletingIds(new Set())
    }, 300)
  }

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
      const d = await r.json()
      if (d.result) {
        setResult(d.result)
        // 💾 Save to Supabase for dashboard
        if (user) {
          const { error: saveErr } = await supabase.from("disease_scans").insert({
            user_id: user.id,
            crop_type: d.result.crop_type || null,
            disease_name: d.result.disease_name || null,
            confidence: d.result.confidence || null,
            cause: d.result.cause || null,
            remedy_bn: d.result.remedy_bn || null,
            prevention_bn: d.result.prevention_bn || null,
          })
          if (saveErr) {
            console.error("Save scan failed:", saveErr)
          } else {
            await fetchHistory()
          }
        }
      } else {
        setError("বিশ্লেষণ ব্যর্থ হয়েছে")
      }
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }
  const reset = () => { setImage(null); setImageFile(null); setDescription(""); setResult(null); setError("") }

  const viewHistoryResult = (scan: any) => {
    setImage(null); setImageFile(null); setDescription(""); setError("")
    setResult({
      crop_type: scan.crop_type,
      disease_name: scan.disease_name,
      confidence: scan.confidence,
      cause: scan.cause,
      remedy_bn: scan.remedy_bn,
      prevention_bn: scan.prevention_bn,
      remedy_en: "",
      prevention_en: "",
      is_common_in_bd: false,
    })
  }

  const hasContent = mode === "image" ? !!image : !!description.trim()

  return (
    <ToolPageLayout title="ফসল রোগ সনাক্তকারী" icon={<Microscope className="w-4 h-4 text-white" />} currentIndex={1}>
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden pt-2">

        {/* Mode Switch */}
        <div className="flex justify-center mb-2 shrink-0">
          <div className="inline-flex bg-white rounded-2xl border-2 border-gray-100 p-1.5 shadow-md">
            <button onClick={() => { setMode("image"); reset() }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${mode === "image" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
              <ImageIcon className="w-4 h-4" />ছবি
            </button>
            <button onClick={() => { setMode("text"); reset() }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${mode === "text" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
              <FileText className="w-4 h-4" />লক্ষণ
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className={`flex-1 w-full space-y-3 ${result || loading ? 'overflow-y-auto' : 'flex flex-col'}`}>

          {/* Input card — same size for both image & text modes */}
          {!result && !loading && (
            <div className="flex-1 flex flex-col">
              {/* Unified card container */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                {mode === "image" ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    className="flex-1 flex flex-col"
                  >
                    {image ? (
                      /* Image uploaded — show preview */
                      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-3">
                        <img src={image} alt="ফসলের ছবি" className="max-w-full max-h-[220px] object-contain rounded-xl shadow-sm border border-gray-200" />
                        <button onClick={reset} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />মুছে ফেলুন
                        </button>
                      </div>
                    ) : (
                      /* Empty state — upload button */
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex flex-col items-center justify-center gap-3 min-h-[180px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-500">ছবি আপলোড করুন</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">ট্যাপ বা ড্র্যাগ করে ছবি দিন</p>
                        </div>
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  </div>
                ) : (
                  /* Text mode — identical card size */
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={6}
                    className="flex-1 w-full p-4 rounded-2xl bg-transparent outline-none text-sm resize-none"
                    placeholder="লক্ষণ বর্ণনা করুন..."
                  />
                )}
              </div>

              {/* Analyze button */}
              {hasContent && (
                <div className="flex justify-center pt-3">
                  <button onClick={analyze} className="bg-gradient-to-r from-leaf-500 to-emerald-600 hover:from-leaf-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200/30 active:scale-95 transition-all flex items-center gap-2">
                    <Scan className="w-4 h-4" />রোগ সনাক্ত করুন
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-12 px-8 text-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-700">ছবি বিশ্লেষণ চলছে...</p>
                <p className="text-xs text-gray-400 mt-1">কয়েক সেকেন্ড সময় লাগতে পারে</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
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
                    <div className="bg-emerald-50 rounded-lg p-2 text-center">
                      <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wide mb-1">নির্ভুলতা</p>
                      <p className="text-lg font-extrabold text-emerald-700">{Math.round(result.confidence * 100)}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">ফসল</p>
                      <p className="text-sm font-extrabold text-gray-800">{result.crop_type || "—"}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2 text-center">
                      <p className="text-[11px] font-bold text-red-400 uppercase tracking-wide mb-1">কারণ</p>
                      <p className="text-xs font-extrabold text-red-600">{result.cause || "—"}</p>
                    </div>
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
              <div className="flex justify-center pb-3">
                <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all">
                  <RefreshCw className="w-4 h-4" />নতুন স্ক্যান
                </button>
              </div>
            </>
          )}

          {/* ── Scan History ── */}
          {scanHistory.length > 0 && (
            <div className="pb-4">
              {/* Online/Offline + pending indicators */}
              {(!online || pendingCount > 0 || syncing) && (
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  {!online ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-700">
                      <WifiOff className="w-3 h-3" /> অফলাইন — {pendingCount}টি ডিলিট পেন্ডিং
                    </span>
                  ) : syncing ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-bold text-blue-700">
                      <Loader2 className="w-3 h-3 animate-spin" /> সিঙ্ক হচ্ছে...
                    </span>
                  ) : pendingCount > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-700">
                      <Wifi className="w-3 h-3" /> {pendingCount}টি পেন্ডিং — রিকানেক্টেড
                    </span>
                  ) : null}
                </div>
              )}
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">স্ক্যান হিস্ট্রি</span>
                  {historyLoading && <Loader2 className="w-3 h-3 text-gray-400 animate-spin ml-1" />}
                </div>
                {scanHistory.length > 0 && (
                  <button
                    onClick={deleteAllScans}
                    className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors"
                  >
                    সব ডিলিট
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {scanHistory.length === 0 && deletingIds.size === 0 && (
                  <p className="text-center text-xs text-gray-400 py-4">কোন স্ক্যান রেকর্ড নেই</p>
                )}
                {scanHistory.map((scan: any) => {
                  const date = new Date(scan.created_at)
                  const timeAgo = getTimeAgo(date)
                  return (
                    <div
                      key={scan.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => viewHistoryResult(scan)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); viewHistoryResult(scan) } }}
                      className={`w-full text-left px-3.5 py-2.5 bg-white border border-gray-100 hover:border-leaf-200 hover:bg-leaf-50/50 rounded-xl flex items-center gap-3 transition-all duration-300 group cursor-pointer ${
                        deletingIds.has(scan.id) ? 'opacity-0 scale-95 pointer-events-none' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 truncate">{scan.disease_name}</p>
                        <p className="text-[11px] text-gray-400">{scan.crop_type || "ফসল"} · {timeAgo}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-600">{Math.round(scan.confidence * 100)}%</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-leaf-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteScan(scan.id)
                        }}
                        className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                        title="ডিলিট"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return "এইমাত্র"
  if (diffMin < 60) return `${diffMin} মিনিট আগে`
  if (diffHr < 24) return `${diffHr} ঘন্টা আগে`
  if (diffDay < 7) return `${diffDay} দিন আগে`
  return date.toLocaleDateString("bn-BD", { day: "numeric", month: "short" })
}
