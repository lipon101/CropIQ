import { NextResponse } from "next/server"
function parseCookies(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const idx = part.indexOf("=")
      const name = part.slice(0, idx)
      const value = part.slice(idx + 1)
      return { name, value }
    })
}

import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return parseCookies(request.headers.get("cookie") ?? "")
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
    return response
  }

  return NextResponse.redirect(`${origin}/auth/signin?error=auth_callback_error`)
}
