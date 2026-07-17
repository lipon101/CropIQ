"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import { Menu, X, Sprout, User, LogOut, ChevronDown, Sparkles, Home, Microscope, MessageCircle, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const { t, language, toggleLanguage } = useLanguage()
  const { user, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/tools/disease-detector", label: t("nav.tools"), icon: Microscope, badge: true },
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
  ]

  const isAuthPage = pathname.startsWith("/auth")

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] border-b border-gray-100/50"
          : "bg-white/60 backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <div className="container-cropiq">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-leaf-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center shadow-lg shadow-leaf-200/50 group-hover:shadow-xl group-hover:shadow-leaf-300/40 transition-all duration-300 group-hover:scale-105">
                <Sprout className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Crop<span className="bg-clip-text text-transparent bg-gradient-to-r from-earth-500 to-amber-600">IQ</span>
              </span>
              <p className="text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase -mt-0.5">
                Agri · AI · Tech
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-leaf-700 bg-leaf-50 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="absolute -top-1 -right-1 text-[9px] font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-0.5 rounded-full shadow-sm">
                      NEW
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2.5">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="relative overflow-hidden px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center gap-1.5 text-gray-700 hover:border-gray-300 shadow-sm"
            >
              <span className="text-base">{language === "bn" ? "🇧🇩" : "🇬🇧"}</span>
              <span className="hidden sm:inline">{language === "bn" ? "বাংলা" : "English"}</span>
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {(user.email?.[0] || "U").toUpperCase()}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                    </button>

                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-scale-in overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{language === "bn" ? "কৃষক" : "Farmer"}</p>
                          </div>
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-leaf-50 hover:text-leaf-700 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" /> {t("dashboard.title")}
                          </Link>
                          <button
                            onClick={() => { setProfileOpen(false); signOut() }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> {t("nav.signout")}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  !isAuthPage && (
                    <div className="hidden sm:flex items-center gap-2">
                      <Link
                        href="/auth/signin"
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        {t("nav.signin")}
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="btn-primary text-sm py-2.5 px-5 shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
                        {t("nav.signup")}
                      </Link>
                    </div>
                  )
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors -mr-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
          }`}
        >
          <div className="py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-leaf-700 bg-leaf-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <link.icon className="w-4.5 h-4.5" />
                  {link.label}
                </Link>
              )
            })}
            {!user && !isAuthPage && (
              <div className="flex gap-2 pt-3 px-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary text-sm py-3 flex-1 text-center font-semibold"
                >
                  {t("nav.signin")}
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-sm py-3 flex-1 text-center"
                >
                  {t("nav.signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
