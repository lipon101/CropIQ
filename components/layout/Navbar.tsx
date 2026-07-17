"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import { Menu, X, Sprout, User, LogOut, ChevronDown, Search } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const { t, language, toggleLanguage } = useLanguage()
  const { user, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { href: "/", label: t("nav.home") },
    {
      href: "/tools/disease-detector",
      label: t("nav.tools"),
      badge: true,
    },
    { href: "/dashboard", label: t("nav.dashboard") },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="container-cropiq">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 bg-leaf-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-leaf-800">
                Crop<span className="text-earth-500">IQ</span>
              </span>
              <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase -mt-0.5">
                AGRI · AI · TECH
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? "text-leaf-700 bg-leaf-50"
                      : "text-gray-600 hover:text-leaf-700 hover:bg-leaf-50/50"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full leading-none">
                      NEW
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center gap-1 text-gray-700"
            >
              {language === "bn" ? "বাং" : "EN"}
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-7 h-7 bg-leaf-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(user.email?.[0] || "U").toUpperCase()}
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-fade-in">
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <User className="w-4 h-4" /> {t("dashboard.title")}
                          </Link>
                          <button
                            onClick={() => {
                              setProfileOpen(false)
                              signOut()
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" /> {t("nav.signout")}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link
                      href="/auth/signin"
                      className="text-sm font-medium text-gray-600 hover:text-leaf-700 px-3 py-1.5"
                    >
                      {t("nav.signin")}
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="btn-primary text-sm py-2 px-4 shadow-sm"
                    >
                      {t("nav.signup")}
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 -mr-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "text-leaf-700 bg-leaf-50"
                      : "text-gray-600 hover:text-leaf-700 hover:bg-leaf-50"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            {!user && (
              <div className="flex gap-2 pt-2 px-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary text-sm py-2.5 flex-1 text-center"
                >
                  {t("nav.signin")}
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-sm py-2.5 flex-1 text-center"
                >
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
