"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props { children: React.ReactNode; fallback?: React.ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error } }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error("ErrorBoundary:", error, errorInfo) }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-leaf-50/50 to-white p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-premium border border-gray-100 p-8 md:p-10 text-center animate-scale-in">
            <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-7 h-7 text-red-500" /></div>
            <h2 className="text-lg font-extrabold text-gray-900 mb-2">কিছু সমস্যা হয়েছে</h2>
            <p className="text-sm text-gray-500 mb-6">অপ্রত্যাশিত একটি ত্রুটি ঘটেছে। পৃষ্ঠাটি রিফ্রেশ করুন।</p>
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }} className="btn-primary inline-flex text-sm px-6 py-3"><RefreshCw className="w-4 h-4" /> রিফ্রেশ করুন</button>
            {this.state.error && (
              <details className="mt-5 text-left"><summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 font-medium">ত্রুটির বিবরণ</summary>
                <pre className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3 overflow-auto max-h-28">{this.state.error.message}</pre>
              </details>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
