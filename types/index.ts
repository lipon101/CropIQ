// Supabase Database Types
export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  district: string | null
  language: "bn" | "en"
  created_at: string
}

export interface DiseaseScan {
  id: string
  user_id: string
  image_url: string | null
  crop_type: string | null
  disease_name: string | null
  confidence: number | null
  cause: string | null
  remedy_bn: string | null
  remedy_en: string | null
  prevention_bn: string | null
  prevention_en: string | null
  is_common_in_bd: boolean
  created_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  session_id?: string
  role: "user" | "assistant"
  content_bn: string | null
  content_en: string | null
  content: string
  created_at: string
}

export interface MarketPrice {
  id: string
  commodity: string
  variety: string | null
  market: string
  district: string
  price_per_kg: number
  unit: string
  date: string
  created_at: string
}

export interface WeatherAdvisory {
  id: string
  user_id: string
  district: string
  crop_type: string | null
  forecast_json: any
  advisory_bn: string | null
  advisory_en: string | null
  created_at: string
}

// UI Types
export interface DiagnosisResult {
  crop_type: string
  disease_name: string
  confidence: number
  cause: string
  remedy_bn: string
  remedy_en: string
  prevention_bn: string
  prevention_en: string
  is_common_in_bd: boolean
}

export interface WeatherDay {
  date: string
  temp_min: number
  temp_max: number
  humidity: number
  rain_mm: number
  wind_kmh: number
  description: string
  icon: string
}

export interface WeatherData {
  district: string
  current: {
    temp: number
    humidity: number
    description: string
    icon: string
    wind_kmh: number
  }
  forecast: WeatherDay[]
}
