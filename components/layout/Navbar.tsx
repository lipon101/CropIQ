"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import { Menu, X, Sprout, User, LogOut, ChevronDown } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { t, language, toggleLanguage } = useLanguage()
  const { user, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/tools/disease-detector", label: t("nav.tools") },
    { href: "/dashboard", label: t("nav.dashboard") },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-leaf-100 shadow-sm">
      <div className="container-cropiq">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-leaf-600 rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-leaf-800">
              Crop<span className="text-earth-500">IQ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-leaf-700 hover:bg-leaf-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-leaf-200 bg-white hover:bg-leaf-50 transition-colors flex items-center gap-1"
            >
              {language === "bn" ? "🇧🇩 বাংলা" : "🇬🇧 EN"}
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-leaf-50 hover:bg-leaf-100 transition-colors"
                    >
                      <div className="w-7 h-7 bg-leaf-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(user.email?.[0] || "U").toUpperCase()}
                      </div>
                      <ChevronDown className="w-4 h-4 text-leaf-600" />
                    </button>

                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-fade-in">
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-leaf-50"
                          >
                            <User className="w-4 h-4" /> {t("dashboard.title")}
                          </Link>
                          <button
                            onClick={() => {
                              setProfileOpen(false)
                              signOut()
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" /> {t("nav.signout")}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link href="/auth/signin" className="text-sm font-medium text-leaf-700 hover:text-leaf-800 px-3 py-1.5">
                      {t("nav.signin")}
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="btn-primary text-sm py-1.5 px-4"
                    >
                      {t("nav.signup")}
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-leaf-100 py-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-leaf-700 hover:bg-leaf-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 pt-2 px-2">
                <Link href="/auth/signin" className="btn-secondary text-sm py-2 flex-1 text-center">
                  {t("nav.signin")}
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm py-2 flex-1 text-center">
                  {t("nav.signup")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
