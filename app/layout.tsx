import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth/AuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export const metadata: Metadata = {
  title: "CropIQ — বাংলাদেশের স্মার্ট কৃষি প্ল্যাটফর্ম",
  description: "এআই-চালিত ফসলের রোগ সনাক্তকরণ, লাইভ বাজার মূল্য, আবহাওয়া পরামর্শ এবং কৃষি চ্যাটবট — সম্পূর্ণ বিনামূল্যে।",
  keywords: "ফসল রোগ, কৃষি এআই, বাংলাদেশ কৃষি, ফসল সনাক্তকরণ, বাজার মূল্য, আবহাওয়া, বাংলা কৃষি অ্যাপ",
  openGraph: { title: "CropIQ — বাংলাদেশের স্মার্ট কৃষি", description: "কৃষকদের জন্য সম্পূর্ণ বিনামূল্যের এআই টুল", type: "website", locale: "bn_BD", siteName: "CropIQ" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white" suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
