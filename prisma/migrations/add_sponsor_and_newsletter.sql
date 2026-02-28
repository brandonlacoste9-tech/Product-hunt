-- Migration: Add sponsor and newsletter tables for monetization
-- Run this in your Supabase SQL editor

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  region TEXT, -- 'US', 'CA', 'MX' for regional targeting
  interests TEXT[], -- Array of category interests
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for active subscribers
CREATE INDEX idx_newsletter_active ON "NewsletterSubscriber"(is_active, subscribed_at);
CREATE INDEX idx_newsletter_region ON "NewsletterSubscriber"(region) WHERE is_active = true;

-- Sponsor/Featured listing purchases
CREATE TABLE IF NOT EXISTS "SponsorPurchase" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents (e.g., 15000 = $150)
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending', -- pending, paid, active, expired, refunded
  tier TEXT NOT NULL, -- 'featured_week', 'homepage_banner', 'newsletter_spot'
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for sponsor queries
CREATE INDEX idx_sponsor_status ON "SponsorPurchase"(status, starts_at, ends_at);
CREATE INDEX idx_sponsor_product ON "SponsorPurchase"(product_id);

-- Add affiliate tracking to Product table
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS affiliate_url TEXT,
ADD COLUMN IF NOT EXISTS affiliate_clicks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS affiliate_conversions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS launch_date TIMESTAMP;

-- Create view for active sponsors (used in frontend queries)
CREATE OR REPLACE VIEW active_sponsors AS
SELECT 
  sp.*,
  p.name as product_name,
  p.tagline as product_tagline,
  p.logo as product_logo,
  p.website as product_website
FROM "SponsorPurchase" sp
JOIN "Product" p ON sp.product_id = p.id
WHERE sp.status = 'active'
  AND sp.starts_at <= NOW()
  AND sp.ends_at >= NOW()
ORDER BY sp.starts_at DESC;

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_newsletter_updated_at ON "NewsletterSubscriber";
CREATE TRIGGER update_newsletter_updated_at
  BEFORE UPDATE ON "NewsletterSubscriber"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sponsor_updated_at ON "SponsorPurchase";
CREATE TRIGGER update_sponsor_updated_at
  BEFORE UPDATE ON "SponsorPurchase"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SponsorPurchase" ENABLE ROW LEVEL SECURITY;

-- Policies for NewsletterSubscriber
CREATE POLICY "Allow public insert" ON "NewsletterSubscriber"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view own subscription" ON "NewsletterSubscriber"
  FOR SELECT USING (email = current_user);

-- Policies for SponsorPurchase
CREATE POLICY "Allow public read of active sponsors" ON "SponsorPurchase"
  FOR SELECT USING (status IN ('active', 'paid'));

-- Insert sample data for testing
INSERT INTO "NewsletterSubscriber" (email, name, region, interests)
VALUES 
  ('test@example.com', 'Test User', 'US', ARRAY['ai-ml', 'productivity']),
  ('maker@startup.ca', 'Canadian Maker', 'CA', ARRAY['developer-tools', 'saas'])
ON CONFLICT (email) DO NOTHING;

-- Comment explaining the migration
COMMENT ON TABLE "NewsletterSubscriber" IS 'Email subscribers for the weekly newsletter';
COMMENT ON TABLE "SponsorPurchase" IS 'Paid featured listing purchases via Stripe';
