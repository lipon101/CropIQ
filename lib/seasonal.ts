/**
 * Seasonal agro-climatic helper for Bangladesh.
 *
 * Determines the current Bangladeshi agricultural season from the calendar
 * month, then surfaces crop-window guidance: which crops are in their
 * planting/mid/harvest phase right now, and a plain-Bangla line of advice.
 *
 * Seasons follow the BMD / DAE (কৃষি সম্প্রসারণ অধিদপ্তর) convention:
 *   - রবি (Rabi)        — নভেম্বর → ফেব্রুয়ারি (শুকনো, শীত)
 *   - খরিফ-১ (Kharif-1) — মার্চ → মে (প্রাক-বর্ষা, গরম + কালবৈশাখী)
 *   - খরিফ-২ (Kharif-2) — জুন → অক্টোবর (বর্ষা, বন্যা ঝুঁকি)
 */

// ─── Season detection ───────────────────────────────────────────────────────

export interface SeasonInfo {
  /** Stable English key (e.g. "rabi", "kharif1", "kharif2"). */
  key: string
  /** Bengali name. */
  name_bn: string
  /** Bengali description of the season's typical weather character. */
  desc_bn: string
  /** Typical hazards for this season. */
  hazards_bn: string[]
  /** Starting month (1-12). */
  startMonth: number
  /** Ending month (1-12). */
  endMonth: number
}

const SEASONS: SeasonInfo[] = [
  {
    key: "rabi",
    name_bn: "রবি মৌসুম",
    desc_bn: "শুকনো ও ঠান্ডা আবহাওয়া — বৃষ্টি কম, কুয়াশা ও হালকা শীত পড়ে।",
    hazards_bn: ["কুয়াশা", "খরা", "শৈত্যপ্রবাহ"],
    startMonth: 11,
    endMonth: 2,
  },
  {
    key: "kharif1",
    name_bn: "খরিফ-১ (প্রাক-বর্ষা)",
    desc_bn: "গরম ও আর্দ্র বৃদ্ধি — কালবৈশাখী ঝড়, বজ্রপাত ও তাপপ্রবাহ হতে পারে।",
    hazards_bn: ["তাপপ্রবাহ", "কালবৈশাখী", "বজ্রপাত"],
    startMonth: 3,
    endMonth: 5,
  },
  {
    key: "kharif2",
    name_bn: "খরিফ-২ (বর্ষা)",
    desc_bn: "ভারী বর্ষা — বন্যা, জলাবদ্ধতা, পোকা-রোগের প্রকোপ বাড়ে।",
    hazards_bn: ["বন্যা", "জলাবদ্ধতা", "পোকা-রোগ"],
    startMonth: 6,
    endMonth: 10,
  },
]

/** Resolve the Bangladeshi season for a given month (1-12). Current month if omitted. */
export function getSeason(month?: number): SeasonInfo {
  const m = month ?? new Date(Date.now() + 6 * 60 * 60 * 1000).getMonth() + 1 // BD month
  for (const s of SEASONS) {
    if (s.startMonth <= s.endMonth) {
      if (m >= s.startMonth && m <= s.endMonth) return s
    } else {
      // wraps around year boundary (Rabi: Nov–Feb)
      if (m >= s.startMonth || m <= s.endMonth) return s
    }
  }
  return SEASONS[1]
}

// ─── Crop-window guidance ───────────────────────────────────────────────────

interface CropWindowRule {
  crop_en: string
  crop_bn: string
  /** (season key, phase label bn, action bn) */
  phases: { season: string; phase_bn: string; action_bn: string }[]
}

const WINDOW_RULES: CropWindowRule[] = [
  {
    crop_en: "Rice",
    crop_bn: "ধান",
    phases: [
      { season: "rabi", phase_bn: "বোরো ধান রোপণ/পরিচর্যা", action_bn: "বোরো চারার বীজতলা তৈরি করুন; সেচ নিশ্চিত রাখুন।" },
      { season: "kharif1", phase_bn: "বোরো কাটা ও আউশ বপন", action_bn: "বোরো ধান কাটুন; খালি জমিতে আউশ বপনের প্রস্তুতি নিন।" },
      { season: "kharif2", phase_bn: "আমন রোপণ", action_bn: "আমন চারা রোপণের সঠিক সময় — রোপণে দেরি করবেন না।" },
    ],
  },
  {
    crop_en: "Wheat",
    crop_bn: "গম",
    phases: [
      { season: "rabi", phase_bn: "গম বপন ও বৃদ্ধি", action_bn: "রবি মৌসুমে গম বপনের উপযুক্ত সময় — সেচ ও আগাছা নিয়ন্ত্রণ করুন।" },
    ],
  },
  {
    crop_en: "Potato",
    crop_bn: "আলু",
    phases: [
      { season: "rabi", phase_bn: "আলু রোপণ ও পরিচর্যা", action_bn: "রবি মৌসুমে আলু লাগান; ঠান্ডা আবহাওয়ায় রোগ থেকে গাছ বাঁচান।" },
    ],
  },
  {
    crop_en: "Jute",
    crop_bn: "পাট",
    phases: [
      { season: "kharif1", phase_bn: "পাট বপন", action_bn: "প্রাক-বর্ষায় পাট বপনের সময়; জমি গভীর চাষ দিন।" },
      { season: "kharif2", phase_bn: "পাট সেচ ও আগাছা নিয়ন্ত্রণ", action_bn: "বর্ষায় পাট গাছ দ্রুত বাড়ে — জমিতে পানি জমতে দেবেন না।" },
    ],
  },
  {
    crop_en: "Maize",
    crop_bn: "ভুট্টা",
    phases: [
      { season: "rabi", phase_bn: "রবি ভুট্টা বপন", action_bn: "শীত মৌসুমে ভুট্টার ফলন ভালো — ভালো বীজ বেছে লাগান।" },
      { season: "kharif1", phase_bn: "খরিফ ভুট্টা বৃদ্ধি", action_bn: "গরমে ভুট্টার সেচ বাড়ান; পোকা পর্যবেক্ষণ করুন।" },
    ],
  },
  {
    crop_en: "Mustard",
    crop_bn: "সরিষা",
    phases: [
      { season: "rabi", phase_bn: "সরিষা বপন", action_bn: "রবিতে সরিষা বপন করুন — অল্প সময়ের ফসল, সেচে লাভ ভালো।" },
    ],
  },
  {
    crop_en: "Onion",
    crop_bn: "পেঁয়াজ",
    phases: [
      { season: "rabi", phase_bn: "পেঁয়াজ চারা রোপণ", action_bn: "শীত মৌসুমে পেঁয়াজ লাগান; জমি উঁচু রাখুন।" },
    ],
  },
  {
    crop_en: "Tomato",
    crop_bn: "টমেটো",
    phases: [
      { season: "rabi", phase_bn: "টমেটো চারা রোপণ", action_bn: "শীতে টমেটো লাগান; ঠান্ডা ও কুয়াশায় রোগ প্রতিরোধে সতর্ক থাকুন।" },
    ],
  },
  {
    crop_en: "Chili",
    crop_bn: "মরিচ",
    phases: [
      { season: "kharif2", phase_bn: "মরিচ রোপণ/পরিচর্যা", action_bn: "বর্ষায় মরিচ গাছে রোগ বেশি — নিকাশ ভালো রাখুন।" },
    ],
  },
]

/** Build the seasonal outlook for a given crop (app name_en) and optional month. */
export function getSeasonalOutlook(cropEn: string, month?: number) {
  const season = getSeason(month)
  const rule = WINDOW_RULES.find((r) => r.crop_en === cropEn)
  const phase = rule?.phases.find((p) => p.season === season.key)

  return {
    season,
    crop: rule ? { crop_en: rule.crop_en, crop_bn: rule.crop_bn } : null,
    phase: phase ? { phase_bn: phase.phase_bn, action_bn: phase.action_bn } : null,
  }
}
