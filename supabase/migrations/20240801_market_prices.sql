-- ========================================
-- CropIQ: market_prices table (real DAM data)
-- Run this in Supabase SQL Editor, or via `supabase db push`.
-- The refresh job (app/api/refresh-prices) writes here with the service role;
-- everyone can read — market prices are public data.
-- ========================================

CREATE TABLE IF NOT EXISTS market_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  commodity TEXT NOT NULL,
  variety TEXT,
  market TEXT NOT NULL,
  district TEXT NOT NULL,
  price_per_kg NUMERIC(10, 2) NOT NULL CHECK (price_per_kg >= 0),
  unit TEXT DEFAULT 'kg',
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- One price per commodity per district per day → idempotent daily upserts
  CONSTRAINT market_prices_district_commodity_date_key UNIQUE (district, commodity, date)
);

CREATE INDEX IF NOT EXISTS idx_market_prices_district_date ON market_prices (district, date DESC);
CREATE INDEX IF NOT EXISTS idx_market_prices_commodity ON market_prices (commodity);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON market_prices (date);

-- RLS: public read-only. Writes come from the server-side refresh job using the
-- service-role key, which bypasses RLS.
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_prices' AND policyname = 'Public read market prices') THEN
    CREATE POLICY "Public read market prices" ON market_prices
      FOR SELECT USING (true);
  END IF;
END $$;
