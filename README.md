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

## 📁 Project Structure

```
├── app/               # Next.js App Router pages & API routes
│   ├── api/           # 7 API endpoints (AI, weather, prices)
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
