import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth/AuthContext"
import { LanguageProvider } from "@/lib/i18n/LanguageContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export const metadata: Metadata = {
  title: "CropIQ — AI-Powered Agriculture Intelligence for Bangladesh",
  description:
    "Free AI crop disease detection, live market prices, weather advisory, and farming chatbot in Bengali and English for Bangladeshi farmers.",
  keywords: "crop disease, agriculture AI, Bangladesh farming, crop diagnosis, market price, weather advisory, Bengali farming app",
  openGraph: {
    title: "CropIQ — Smart Farming for Bangladesh",
    description: "AI-powered agriculture tools for Bangladeshi farmers — completely free.",
    type: "website",
    locale: "bn_BD",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-leaf-50/30 to-white" suppressHydrationWarning>
        <ErrorBoundary>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
