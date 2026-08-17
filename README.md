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
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (server-only — used by the market-price refresh job) |
| `CRON_SECRET` | Optional secret to trigger `/api/refresh-prices` manually |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENWEATHERMAP_API_KEY` | OpenWeatherMap API key |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL |

## 📈 Market Price Refresh Job

Market prices are written into Supabase's `market_prices` table by `app/api/refresh-prices` from **two real sources** (run daily via the cron in `vercel.json`, 23:00 UTC = 05:00 Bangladesh time):

- **DAM — national daily retail averages** from the official [Department of Agricultural Marketing](https://market.dam.gov.bd) price ticker, stored under the `জাতীয় বাজার` (national market) district.
- **WFP — district-level monthly retail prices** from the [WFP food-prices dataset on HDX](https://data.humdata.org/dataset/wfp-food-prices-for-bangladesh) (a ~4.5MB CSV of per-market observations covering 62 of 64 districts, sourced in part from DAM). Prices are averaged per district and dated with WFP's observation month. DAM's own per-district report can't be used directly — its legacy BIRT backend is unreachable from outside Bangladesh and its district AJAX cascade fails server-side.

- Run the migration `supabase/migrations/20240801_market_prices.sql` first to create the table.
- Add `SUPABASE_SERVICE_ROLE_KEY` (and optionally `CRON_SECRET`) to your env.
- Manual trigger: `curl -H "x-cron-secret: $CRON_SECRET" https://your-app.vercel.app/api/refresh-prices`
- **Self-healing:** if the newest stored price is more than 2 days old (or the table is empty — e.g. the cron missed a run), the next request to `/api/prices` kicks off a background refresh automatically (deduped, max once per 30 min; the 4.5MB WFP CSV is cached in-process for 6h).
- The board's district filter shows the real WFP per-district prices; `জাতীয় বাজার (সারাদেশ)` shows the fresh DAM daily national averages.
- `/api/prices` still falls back to the built-in demo seed data when Supabase is empty or unreachable.

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
