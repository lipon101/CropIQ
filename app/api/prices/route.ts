import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Sample seed data for demo — used when Supabase table is empty
const SEED_PRICES = [
  { id: "s1", commodity: "Rice (Miniket)", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 72, date: new Date().toISOString().split("T")[0] },
  { id: "s2", commodity: "Rice (Nazirshail)", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 82, date: new Date().toISOString().split("T")[0] },
  { id: "s3", commodity: "Potato", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 35, date: new Date().toISOString().split("T")[0] },
  { id: "s4", commodity: "Onion (Local)", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 65, date: new Date().toISOString().split("T")[0] },
  { id: "s5", commodity: "Onion (Imported)", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 55, date: new Date().toISOString().split("T")[0] },
  { id: "s6", commodity: "Garlic", market: "Shyambazar", district: "Dhaka", price_per_kg: 180, date: new Date().toISOString().split("T")[0] },
  { id: "s7", commodity: "Green Chili", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 120, date: new Date().toISOString().split("T")[0] },
  { id: "s8", commodity: "Eggplant", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 55, date: new Date().toISOString().split("T")[0] },
  { id: "s9", commodity: "Tomato", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 40, date: new Date().toISOString().split("T")[0] },
  { id: "s10", commodity: "Lentil (Local)", market: "Shyambazar", district: "Dhaka", price_per_kg: 140, date: new Date().toISOString().split("T")[0] },
  { id: "s11", commodity: "Rice (Miniket)", market: "Reazuddin Bazar", district: "Chattogram", price_per_kg: 74, date: new Date().toISOString().split("T")[0] },
  { id: "s12", commodity: "Potato", market: "Reazuddin Bazar", district: "Chattogram", price_per_kg: 38, date: new Date().toISOString().split("T")[0] },
  { id: "s13", commodity: "Rice (Miniket)", market: "Shaheb Bazar", district: "Rajshahi", price_per_kg: 68, date: new Date().toISOString().split("T")[0] },
  { id: "s14", commodity: "Onion (Local)", market: "Shaheb Bazar", district: "Rajshahi", price_per_kg: 60, date: new Date().toISOString().split("T")[0] },
  { id: "s15", commodity: "Mango", market: "Shaheb Bazar", district: "Rajshahi", price_per_kg: 80, date: new Date().toISOString().split("T")[0] },
  { id: "s16", commodity: "Rice (Miniket)", market: "Daulatpur", district: "Khulna", price_per_kg: 70, date: new Date().toISOString().split("T")[0] },
  { id: "s17", commodity: "Fish (Rui)", market: "Daulatpur", district: "Khulna", price_per_kg: 320, date: new Date().toISOString().split("T")[0] },
  { id: "s18", commodity: "Potato", market: "Zindabazar", district: "Sylhet", price_per_kg: 40, date: new Date().toISOString().split("T")[0] },
  { id: "s19", commodity: "Egg (Farm)", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 140, date: new Date().toISOString().split("T")[0] },
  { id: "s20", commodity: "Chicken (Broiler)", market: "Karwan Bazar", district: "Dhaka", price_per_kg: 210, date: new Date().toISOString().split("T")[0] },
]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const district = searchParams.get("district") || ""
    const commodity = searchParams.get("commodity") || ""
    const date = searchParams.get("date") || ""

    // Try Supabase first
    try {
      const supabase = await createServerSupabaseClient()
      let query = supabase.from("market_prices").select("*")

      if (district) query = query.eq("district", district)
      if (commodity) query = query.ilike("commodity", `%${commodity}%`)
      if (date) query = query.eq("date", date)
      else query = query.order("date", { ascending: false })

      const { data, error } = await query.limit(100)

      if (!error && data && data.length > 0) {
        return NextResponse.json({ prices: data })
      }
    } catch {
      // Supabase unavailable — fall through to seed data
    }

    // Fallback to seed data
    let prices = [...SEED_PRICES]
    if (district) prices = prices.filter((p) => p.district === district)
    if (commodity) prices = prices.filter((p) => p.commodity.toLowerCase().includes(commodity.toLowerCase()))
    if (date) prices = prices.filter((p) => p.date === date)

    return NextResponse.json({ prices })
  } catch (error: any) {
    // Always return seed data on error
    return NextResponse.json({ prices: SEED_PRICES })
  }
}
