"use client"

import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Sprout, Heart } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-leaf-900 text-white mt-auto">
      <div className="container-cropiq py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-leaf-500 rounded-lg flex items-center justify-center">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                Crop<span className="text-earth-400">IQ</span>
              </span>
            </div>
            <p className="text-leaf-200 text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-leaf-200 mb-3">Features</h4>
            <ul className="space-y-2 text-sm text-leaf-300">
              <li>🌾 AI Crop Disease Detector</li>
              <li>🤖 AI Farming Chatbot</li>
              <li>💰 Live Market Price Board</li>
              <li>🌤️ Weather & Crop Advisory</li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-leaf-200 mb-3">About</h4>
            <ul className="space-y-2 text-sm text-leaf-300">
              <li>{t("footer.team")}</li>
              <li>Bangladesh University of Business & Technology</li>
              <li>Department of Computer Science & Engineering</li>
              <li>CSE 400: Software Development IV</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-leaf-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-leaf-400">
          <p>&copy; 2026 CropIQ — Group 5, CSE 400, BUBT</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for Bangladeshi farmers 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  )
}
