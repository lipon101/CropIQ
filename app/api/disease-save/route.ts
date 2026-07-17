import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await req.json()

    const { error } = await supabase.from("disease_scans").insert({
      user_id: user.id,
      crop_type: body.crop_type,
      disease_name: body.disease_name,
      confidence: body.confidence,
      cause: body.cause,
      remedy_bn: body.remedy_bn,
      remedy_en: body.remedy_en,
      prevention_bn: body.prevention_bn,
      prevention_en: body.prevention_en,
      is_common_in_bd: body.is_common_in_bd,
    })

    if (error) {
      console.error("Save error:", error)
      return NextResponse.json({ error: "Failed to save" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
