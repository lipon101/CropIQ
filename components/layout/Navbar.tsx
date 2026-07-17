"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"
import { Menu, X, Sprout, Leaf, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const { user, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isAuthPage = pathname.startsWith("/auth")

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/60" : "bg-white border-b border-gray-100"}`}>
      <div className="container-cropiq">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">Crop<span className="text-earth-500">IQ</span></span>
              <p className="text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase -mt-0.5">কৃষি · এআই · প্রযুক্তি</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "হোম" },
              { href: "/tools", label: "টুলস", badge: true },
              { href: "/dashboard", label: "ড্যাশবোর্ড" },
            ].map(link => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link key={link.href} href={link.href} className={`relative px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${isActive ? "text-leaf-700 bg-leaf-50 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  {link.label}
                  {link.badge && <span className="absolute -top-1 -right-1 text-[9px] font-extrabold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full shadow-sm leading-none">নতুন</span>}
                </Link>
              )
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            {!loading && (<>
              {user ? (
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-leaf-500 to-leaf-700 rounded-xl flex items-center justify-center text-white shadow-sm"><Leaf className="w-4 h-4" /></div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>
                  {profileOpen && (<>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100"><p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p><p className="text-xs text-gray-400 mt-0.5">কৃষক</p></div>
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-leaf-50 hover:text-leaf-700"><LayoutDashboard className="w-4 h-4" />ড্যাশবোর্ড</Link>
                      <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-leaf-50 hover:text-leaf-700"><User className="w-4 h-4" />সেটিংস</Link>
                      <button onClick={() => { setProfileOpen(false); signOut() }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"><LogOut className="w-4 h-4" />লগআউট</button>
                    </div>
                  </>)}
                </div>
              ) : !isAuthPage && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/auth/signin" className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-50">লগইন</Link>
                  <Link href="/auth/signup" className="btn-primary-sm">রেজিস্ট্রেশন</Link>
                </div>
              )}
            </>)}

            <button className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 -mr-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label="মেনু">
              {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-80 border-t border-gray-100" : "max-h-0"}`}>
          <div className="py-3 space-y-1">
            {[{ href: "/", label: "হোম" }, { href: "/tools", label: "টুলস" }, { href: "/dashboard", label: "ড্যাশবোর্ড" }].map(link => (
              <Link key={link.href} href={link.href} className={`block px-4 py-3 rounded-xl text-sm font-semibold ${pathname === link.href ? "text-leaf-700 bg-leaf-50" : "text-gray-600 hover:bg-gray-50"}`}>{link.label}</Link>
            ))}
            {!user && !isAuthPage && (
              <div className="flex gap-2 pt-3 px-2">
                <Link href="/auth/signin" className="btn-secondary-sm flex-1 text-center">লগইন</Link>
                <Link href="/auth/signup" className="btn-primary-sm flex-1 text-center">রেজিস্ট্রেশন</Link>
              </div>
            )}
            {user && (
              <Link href="/settings" className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">সেটিংস</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
