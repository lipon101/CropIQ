"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type Language = "bn" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

// ═══════════════════════════════════════════
//  TRANSLATION DICTIONARY
// ═══════════════════════════════════════════
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.tools": "Tools",
    "nav.dashboard": "Dashboard",
    "nav.signin": "Sign In",
    "nav.signup": "Sign Up",
    "nav.signout": "Sign Out",
    // Homepage
    "home.hero.title": "Smart Farming for Bangladesh",
    "home.hero.subtitle": "AI-powered crop disease detection, live market prices, weather advisory, and farming chatbot — all in Bengali and English, completely free.",
    "home.hero.cta": "Get Started Free",
    "home.hero.learn": "Learn More",
    "home.features.title": "Everything a Farmer Needs",
    "home.features.subtitle": "Four powerful tools in one unified platform",
    "home.features.disease.title": "AI Crop Disease Detector",
    "home.features.disease.desc": "Upload a photo of your crop, get instant disease diagnosis and treatment recommendations in Bengali.",
    "home.features.chatbot.title": "AI Farming Chatbot",
    "home.features.chatbot.desc": "Ask any farming question in Bengali — planting, fertilizer, pest control, irrigation, and more.",
    "home.features.market.title": "Live Market Price Board",
    "home.features.market.desc": "Check real-time commodity prices across Bangladesh markets. Know the fair price before you sell.",
    "home.features.weather.title": "Weather & Crop Advisory",
    "home.features.weather.desc": "7-day weather forecast for your district with AI-generated planting and harvesting advice.",
    "home.how.title": "How It Works",
    "home.how.step1": "Sign Up Free",
    "home.how.step1desc": "Create your account in seconds with email or phone number.",
    "home.how.step2": "Choose a Tool",
    "home.how.step2desc": "Upload crop photos, ask questions, check prices, or get weather advice.",
    "home.how.step3": "Get Results",
    "home.how.step3desc": "Receive AI-powered insights and recommendations instantly.",
    "home.stats.farmers": "Farmers Helped",
    "home.stats.diseases": "Diseases Identified",
    "home.stats.districts": "Districts Covered",
    "home.stats.commodities": "Commodities Tracked",
    // Tools
    "tools.disease.title": "AI Crop Disease Detector",
    "tools.disease.subtitle": "Upload a photo of your affected crop and get instant diagnosis",
    "tools.disease.upload": "Upload Crop Photo",
    "tools.disease.camera": "Take Photo",
    "tools.disease.describe": "Or describe symptoms in text...",
    "tools.disease.analyze": "Analyze Crop",
    "tools.disease.analyzing": "Analyzing...",
    "tools.disease.result": "Diagnosis Result",
    "tools.disease.crop": "Crop",
    "tools.disease.disease": "Disease",
    "tools.disease.confidence": "Confidence",
    "tools.disease.cause": "Cause",
    "tools.disease.remedy": "Treatment",
    "tools.disease.prevention": "Prevention",
    "tools.disease.save": "Save Result",
    "tools.disease.saved": "Saved!",
    // Chatbot
    "tools.chatbot.title": "AI Farming Chatbot",
    "tools.chatbot.subtitle": "Ask any farming question in Bengali or English",
    "tools.chatbot.placeholder": "আপনার প্রশ্ন লিখুন...",
    "tools.chatbot.send": "Send",
    "tools.chatbot.typing": "CropIQ is typing...",
    "tools.chatbot.suggestions": "Suggested Questions",
    "tools.chatbot.sug1": "ধান গাছে ব্লাস্ট রোগের চিকিৎসা কি?",
    "tools.chatbot.sug2": "আলু চাষের সঠিক সময় কখন?",
    "tools.chatbot.sug3": "টমেটো গাছের পাতা কুঁকড়ে যাচ্ছে কেন?",
    "tools.chatbot.sug4": "জৈব সার কিভাবে তৈরি করবো?",
    "tools.chatbot.new": "New Chat",
    "tools.chatbot.history": "Chat History",
    "tools.chatbot.copy": "Copy",
    // Market
    "tools.market.title": "Live Market Price Board",
    "tools.market.subtitle": "Daily commodity prices across Bangladesh markets",
    "tools.market.commodity": "Commodity",
    "tools.market.district": "District",
    "tools.market.market": "Market",
    "tools.market.price": "Price/kg",
    "tools.market.date": "Date",
    "tools.market.noData": "No price data available for this selection",
    "tools.market.trend": "Trend",
    "tools.market.up": "Rising",
    "tools.market.down": "Falling",
    "tools.market.stable": "Stable",
    // Weather
    "tools.weather.title": "Weather & Crop Advisory",
    "tools.weather.subtitle": "7-day forecast and AI farming recommendations for your district",
    "tools.weather.selectDistrict": "Select District",
    "tools.weather.selectCrop": "Select Crop",
    "tools.weather.getAdvisory": "Get Advisory",
    "tools.weather.forecast": "7-Day Forecast",
    "tools.weather.advisory": "AI Farming Advisory",
    "tools.weather.temp": "Temp",
    "tools.weather.humidity": "Humidity",
    "tools.weather.rain": "Rain",
    "tools.weather.wind": "Wind",
    // Dashboard
    "dashboard.title": "My Dashboard",
    "dashboard.scans": "Disease Scans",
    "dashboard.chats": "Chat Sessions",
    "dashboard.advisories": "Weather Advisories",
    "dashboard.saved": "Saved Items",
    "dashboard.recent": "Recent Activity",
    "dashboard.settings": "Settings",
    "dashboard.profile": "Profile",
    "dashboard.noData": "No data yet. Start using CropIQ tools!",
    // General
    "general.loading": "Loading...",
    "general.error": "Something went wrong",
    "general.retry": "Retry",
    "general.save": "Save",
    "general.cancel": "Cancel",
    "general.delete": "Delete",
    "general.confirm": "Confirm",
    "general.search": "Search",
    "general.filter": "Filter",
    "footer.tagline": "Built for Bangladeshi farmers — because technology should speak their language.",
    "footer.team": "Group 5 • CSE 400 • BUBT • Intake 51",
  },
  bn: {
    "nav.home": "হোম",
    "nav.tools": "টুলস",
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.signin": "লগইন",
    "nav.signup": "রেজিস্ট্রেশন",
    "nav.signout": "লগআউট",
    "home.hero.title": "বাংলাদেশের জন্য স্মার্ট কৃষি",
    "home.hero.subtitle": "এআই-চালিত ফসলের রোগ সনাক্তকরণ, লাইভ বাজার মূল্য, আবহাওয়া পরামর্শ এবং কৃষি চ্যাটবট — বাংলা ও ইংরেজিতে, সম্পূর্ণ বিনামূল্যে।",
    "home.hero.cta": "বিনামূল্যে শুরু করুন",
    "home.hero.learn": "আরও জানুন",
    "home.features.title": "একজন কৃষকের যা যা প্রয়োজন",
    "home.features.subtitle": "একটি প্লাটফর্মে চারটি শক্তিশালী টুল",
    "home.features.disease.title": "এআই ফসল রোগ সনাক্তকরণ",
    "home.features.disease.desc": "আপনার ফসলের ছবি আপলোড করুন, সাথে সাথে রোগ নির্ণয় ও চিকিৎসার পরামর্শ পান বাংলায়।",
    "home.features.chatbot.title": "এআই কৃষি চ্যাটবট",
    "home.features.chatbot.desc": "কৃষি সংক্রান্ত যেকোনো প্রশ্ন করুন বাংলায় — চাষাবাদ, সার, পোকামাকড়, সেচ ও আরও অনেক কিছু।",
    "home.features.market.title": "লাইভ বাজার মূল্য বোর্ড",
    "home.features.market.desc": "বাংলাদেশের বিভিন্ন বাজারের পণ্যের দাম দেখুন। বিক্রির আগে সঠিক দাম জানুন।",
    "home.features.weather.title": "আবহাওয়া ও ফসল পরামর্শ",
    "home.features.weather.desc": "আপনার জেলার ৭ দিনের আবহাওয়া পূর্বাভাস সহ এআই-উৎপাদিত চাষ ও ফসল কাটার পরামর্শ।",
    "home.how.title": "কিভাবে কাজ করে",
    "home.how.step1": "বিনামূল্যে রেজিস্টার",
    "home.how.step1desc": "ইমেইল বা ফোন নম্বর দিয়ে সেকেন্ডের মধ্যে অ্যাকাউন্ট তৈরি করুন।",
    "home.how.step2": "একটি টুল বেছে নিন",
    "home.how.step2desc": "ফসলের ছবি আপলোড করুন, প্রশ্ন করুন, বাজারদর দেখুন বা আবহাওয়ার পরামর্শ নিন।",
    "home.how.step3": "ফলাফল দেখুন",
    "home.how.step3desc": "তাৎক্ষণিক এআই-চালিত তথ্য ও পরামর্শ গ্রহণ করুন।",
    "home.stats.farmers": "সহায়তা প্রাপ্ত কৃষক",
    "home.stats.diseases": "রোগ সনাক্তকৃত",
    "home.stats.districts": "জেলা কাভার",
    "home.stats.commodities": "পণ্য ট্র্যাক",
    "tools.disease.title": "এআই ফসল রোগ সনাক্তকারী",
    "tools.disease.subtitle": "আক্রান্ত ফসলের ছবি আপলোড করুন এবং তাৎক্ষণিক রোগ নির্ণয় পান",
    "tools.disease.upload": "ফসলের ছবি আপলোড করুন",
    "tools.disease.camera": "ছবি তুলুন",
    "tools.disease.describe": "অথবা লক্ষণগুলো লিখে বর্ণনা করুন...",
    "tools.disease.analyze": "ফসল বিশ্লেষণ করুন",
    "tools.disease.analyzing": "বিশ্লেষণ চলছে...",
    "tools.disease.result": "রোগ নির্ণয়ের ফলাফল",
    "tools.disease.crop": "ফসল",
    "tools.disease.disease": "রোগ",
    "tools.disease.confidence": "নিশ্চিততা",
    "tools.disease.cause": "কারণ",
    "tools.disease.remedy": "চিকিৎসা",
    "tools.disease.prevention": "প্রতিরোধ",
    "tools.disease.save": "ফলাফল সংরক্ষণ করুন",
    "tools.disease.saved": "সংরক্ষিত!",
    "tools.chatbot.title": "এআই কৃষি চ্যাটবট",
    "tools.chatbot.subtitle": "বাংলা বা ইংরেজিতে যেকোনো কৃষি প্রশ্ন করুন",
    "tools.chatbot.placeholder": "আপনার প্রশ্ন লিখুন...",
    "tools.chatbot.send": "পাঠান",
    "tools.chatbot.typing": "CropIQ উত্তর লিখছে...",
    "tools.chatbot.suggestions": "পরামর্শিত প্রশ্ন",
    "tools.chatbot.sug1": "ধান গাছে ব্লাস্ট রোগের চিকিৎসা কি?",
    "tools.chatbot.sug2": "আলু চাষের সঠিক সময় কখন?",
    "tools.chatbot.sug3": "টমেটো গাছের পাতা কুঁকড়ে যাচ্ছে কেন?",
    "tools.chatbot.sug4": "জৈব সার কিভাবে তৈরি করবো?",
    "tools.chatbot.new": "নতুন চ্যাট",
    "tools.chatbot.history": "চ্যাট ইতিহাস",
    "tools.chatbot.copy": "কপি",
    "tools.market.title": "লাইভ বাজার মূল্য বোর্ড",
    "tools.market.subtitle": "বাংলাদেশের বাজারসমূহের দৈনিক পণ্যমূল্য",
    "tools.market.commodity": "পণ্য",
    "tools.market.district": "জেলা",
    "tools.market.market": "বাজার",
    "tools.market.price": "মূল্য/কেজি",
    "tools.market.date": "তারিখ",
    "tools.market.noData": "এই নির্বাচনের জন্য কোন মূল্য তথ্য নেই",
    "tools.market.trend": "প্রবণতা",
    "tools.market.up": "বাড়ছে",
    "tools.market.down": "কমছে",
    "tools.market.stable": "স্থিতিশীল",
    "tools.weather.title": "আবহাওয়া ও ফসল পরামর্শ",
    "tools.weather.subtitle": "আপনার জেলার ৭ দিনের পূর্বাভাস ও এআই কৃষি পরামর্শ",
    "tools.weather.selectDistrict": "জেলা নির্বাচন করুন",
    "tools.weather.selectCrop": "ফসল নির্বাচন করুন",
    "tools.weather.getAdvisory": "পরামর্শ নিন",
    "tools.weather.forecast": "৭ দিনের পূর্বাভাস",
    "tools.weather.advisory": "এআই কৃষি পরামর্শ",
    "tools.weather.temp": "তাপমাত্রা",
    "tools.weather.humidity": "আর্দ্রতা",
    "tools.weather.rain": "বৃষ্টি",
    "tools.weather.wind": "বাতাস",
    "dashboard.title": "আমার ড্যাশবোর্ড",
    "dashboard.scans": "রোগ স্ক্যান",
    "dashboard.chats": "চ্যাট সেশন",
    "dashboard.advisories": "আবহাওয়া পরামর্শ",
    "dashboard.saved": "সংরক্ষিত আইটেম",
    "dashboard.recent": "সাম্প্রতিক কার্যক্রম",
    "dashboard.settings": "সেটিংস",
    "dashboard.profile": "প্রোফাইল",
    "dashboard.noData": "এখনও কোন তথ্য নেই। CropIQ টুল ব্যবহার শুরু করুন!",
    "general.loading": "লোড হচ্ছে...",
    "general.error": "কিছু সমস্যা হয়েছে",
    "general.retry": "আবার চেষ্টা",
    "general.save": "সংরক্ষণ",
    "general.cancel": "বাতিল",
    "general.delete": "মুছুন",
    "general.confirm": "নিশ্চিত করুন",
    "general.search": "খুঁজুন",
    "general.filter": "ফিল্টার",
    "footer.tagline": "বাংলাদেশের কৃষকদের জন্য তৈরি — কারণ প্রযুক্তি তাদের ভাষায় কথা বলা উচিত।",
    "footer.team": "গ্রুপ ৫ • সিএসই ৪০০ • বিইউবিটি • ইনটেক ৫১",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bn")

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("cropiq-lang", lang)
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "bn" ? "en" : "bn")
  }, [language, setLanguage])

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] || key
    },
    [language]
  )

  React.useEffect(() => {
    const saved = localStorage.getItem("cropiq-lang") as Language | null
    if (saved && (saved === "bn" || saved === "en")) {
      setLanguageState(saved)
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
