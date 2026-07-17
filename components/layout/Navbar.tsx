"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/lib/auth/AuthContext"
import { Menu, X, Sprout, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react"
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
    window.addEventListener("scroll", onScroll, {passive:true})
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/tools/disease-detector", label: t("nav.tools"), badge: true },
    { href: "/dashboard", label: t("nav.dashboard") },
  ]

  const isAuthPage = pathname.startsWith("/auth")

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/60" : "bg-white border-b border-gray-100"}`}>
      <div className="container-cropiq">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center shadow-md shadow-leaf-200/50 group-hover:shadow-lg group-hover:scale-105 transition-all">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">Crop<span className="bg-clip-text text-transparent bg-gradient-to-r from-earth-500 to-amber-600">IQ</span></span>
              <p className="text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase -mt-0.5">AGRI · AI · TECH</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link key={link.href} href={link.href} className={`relative px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${isActive ? "text-leaf-700 bg-leaf-50 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  {link.label}
                  {link.badge && <span className="absolute -top-1 -right-1 text-[9px] font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-0.5 rounded-full shadow-sm leading-none">NEW</span>}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <button onClick={toggleLanguage} className="px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center gap-1.5 text-gray-700 shadow-sm">
              <span className="text-base">{language === "bn" ? "🇧🇩" : "🇬🇧"}</span>
              <span className="hidden sm:inline">{language === "bn" ? "বাংলা" : "EN"}</span>
            </button>

            {!loading && (<>
              {user ? (
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">{user.email?.[0]?.toUpperCase() || "U"}</div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen?"rotate-180":""}`} />
                  </button>
                  {profileOpen && (<>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100"><p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p><p className="text-[11px] text-gray-400 mt-0.5">{language==="bn"?"কৃষক":"Farmer"}</p></div>
                      <Link href="/dashboard" onClick={()=>setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-leaf-50 hover:text-leaf-700 transition-colors"><LayoutDashboard className="w-4 h-4" />{t("dashboard.title")}</Link>
                      <button onClick={()=>{setProfileOpen(false);signOut()}} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"><LogOut className="w-4 h-4" />{t("nav.signout")}</button>
                    </div>
                  </>)}
                </div>
              ) : !isAuthPage && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/auth/signin" className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">{t("nav.signin")}</Link>
                  <Link href="/auth/signup" className="btn-primary-sm">{t("nav.signup")}</Link>
                </div>
              )}
            </>)}

            <button className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 -mr-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}</button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen?"max-h-96 border-t border-gray-100":"max-h-0"}`}>
          <div className="py-3 space-y-1">
            {navLinks.map(link => {
              const isActive = pathname === link.href
              return <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${isActive?"text-leaf-700 bg-leaf-50":"text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>{link.label}</Link>
            })}
            {!user && !isAuthPage && (
              <div className="flex gap-2 pt-3 px-2">
                <Link href="/auth/signin" className="btn-secondary-sm flex-1 text-center">{t("nav.signin")}</Link>
                <Link href="/auth/signup" className="btn-primary-sm flex-1 text-center">{t("nav.signup")}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
