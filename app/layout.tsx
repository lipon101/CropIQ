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
    "Free AI crop disease detection, live market prices, weather advisory, and farming chatbot in Bengali and English for Bangladeshi farmers. Smart Agriculture & Bioinformatics Hub.",
  keywords: "crop disease, agriculture AI, Bangladesh farming, crop diagnosis, market price, weather advisory, Bengali farming app, smart agriculture, bioinformatics, plant disease detection",
  authors: [{ name: "CropIQ Team — Group 5, CSE 400, BUBT" }],
  openGraph: {
    title: "CropIQ — Smart Farming for Bangladesh",
    description: "AI-powered agriculture tools for Bangladeshi farmers — completely free. Disease detection, market prices, weather advisory & AI chatbot in Bengali.",
    type: "website",
    locale: "bn_BD",
    siteName: "CropIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "CropIQ — Smart Farming for Bangladesh",
    description: "AI-powered agriculture tools for Bangladeshi farmers — completely free.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-leaf-50/20 via-white to-white" suppressHydrationWarning>
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
