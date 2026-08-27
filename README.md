# 🌾 CropIQ — AI-Powered Agriculture Intelligence Platform

**Group 5 | CSE 400 | BUBT | Intake 51**

An AI-powered web platform providing Bangladeshi farmers with free tools for crop disease diagnosis, market price tracking, weather-based advisory, and Bengali-language farming Q&A.

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in your API keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Tech Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Auth:** Supabase Auth (email/password)
- **AI:** OpenRouter (free tier model)
- **Weather:** OpenWeatherMap API
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel

## 📋 Environment Variables

Set these in `.env.local` (local) or Vercel dashboard (production):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENWEATHERMAP_API_KEY` | OpenWeatherMap API key |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL |

## 📈 Market Price Refresh Job

Market prices are served live from two official sources:

- **[DAM](https://market.dam.gov.bd)** — national daily retail averages (`জাতীয় বাজার` / national market).
- **[WFP (HDX)](https://data.humdata.org/dataset/wfp-food-prices-for-bangladesh)** — district-level monthly retail prices across 62 of 64 districts.

> ✅ **বিশ্ব খাদ্য কর্মসূচী (WFP) ও সরকারি কৃষি বিপণন অধিদপ্তর (DAM) থেকে ৭০০+ রিয়েল লাইভ দাম সিঙ্ক হয়েছে! 🌾✨✅**
> কোনো ডামি বা ফেক ডেটা নয় — `/api/refresh-prices` জব প্রতিদিন Vercel Cron (`0 23 * * *` UTC ≈ ভোর ৫টা বাংলাদেশ সময়) দ্বারা স্বয়ংক্রিয়ভাবে চালু হয়ে বাংলাদেশের ৬২টি জেলার ৩৪+ কৃষি পণ্যের হালনাগাদ, সঠিক বাজারদর Supabase-এ সিঙ্ক করে।

## 📁 Project Structure

```
├── app/               # Next.js App Router pages & API routes
│   ├── api/           # 8 API endpoints (AI, weather, prices, refresh job)
│   ├── auth/          # Sign in / Sign up
│   ├── tools/         # Disease, Chatbot, Market, Weather
│   └── dashboard/     # User dashboard
├── components/        # Reusable UI components
├── lib/               # Utilities, OpenRouter client, i18n, constants
└── types/             # TypeScript type definitions
```

## 🌐 Features

- 🔬 **AI Crop Disease Detector** — Upload photo → instant diagnosis + treatment
- 🤖 **AI Farming Chatbot** — Bengali/English Q&A with farming knowledge
- 💰 **Live Market Price Board** — 30+ commodities across BD districts
- 🌤️ **Weather & Crop Advisory** — 7-day forecast + AI farming advice
- 👤 **User Dashboard** — Scan history, saved items, profile

## 👥 Team

| Name | Role |
|------|------|
| Md. Torikul Islam Lipon | Project Lead / Full-Stack |
| Al-Amin Oyon | AI Integration |
| Md Jobair Hossan | Database & DevOps |
| Samia Homayara | UI/UX & Frontend |
| Md. Aslam Hossain | Data Engineering |
| Sree Partho Chondro Mohanto | QA & Testing |
