-- Migration: Add API key management for paid Data API
-- Run this in your Supabase SQL editor

-- API Keys table for paid API access
CREATE TABLE IF NOT EXISTS "ApiKey" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key_hash TEXT UNIQUE NOT NULL, -- Hashed API key (never store plain text)
  key_prefix TEXT NOT NULL, -- First 8 chars for identification (e.g., "pk_live_")
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  name TEXT, -- Descriptive name (e.g., "Production API Key")
  tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'starter', 'growth', 'enterprise'
  requests_limit INTEGER DEFAULT 100, -- Daily request limit
  requests_count INTEGER DEFAULT 0, -- Current period count
  requests_reset_at TIMESTAMP DEFAULT NOW(), -- When counter resets
  last_used_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP, -- Optional expiration
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- API usage logs for analytics and rate limiting
CREATE TABLE IF NOT EXISTS "ApiUsage" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  api_key_id UUID NOT NULL REFERENCES "ApiKey"(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_api_key_user ON "ApiKey"(user_id);
CREATE INDEX idx_api_key_hash ON "ApiKey"(key_hash);
CREATE INDEX idx_api_key_active ON "ApiKey"(is_active, tier);
CREATE INDEX idx_api_usage_key ON "ApiUsage"(api_key_id, created_at);
CREATE INDEX idx_api_usage_endpoint ON "ApiUsage"(endpoint, created_at);

-- Rate limiting helper function
CREATE OR REPLACE FUNCTION check_rate_limit(key_id UUID, limit_count INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  reset_at TIMESTAMP;
BEGIN
  -- Get current count and reset time
  SELECT requests_count, requests_reset_at 
  INTO current_count, reset_at
  FROM "ApiKey" 
  WHERE id = key_id;
  
  -- If reset time has passed, reset counter
  IF reset_at < NOW() THEN
    UPDATE "ApiKey" 
    SET requests_count = 0, requests_reset_at = NOW() + INTERVAL '1 day'
    WHERE id = key_id;
    RETURN true;
  END IF;
  
  -- Check if under limit
  IF current_count >= limit_count THEN
    RETURN false;
  END IF;
  
  -- Increment counter
  UPDATE "ApiKey" 
  SET requests_count = requests_count + 1, last_used_at = NOW()
  WHERE id = key_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE "ApiKey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiUsage" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own API keys" ON "ApiKey"
  FOR SELECT USING (user_id = current_user);

CREATE POLICY "Users can manage own API keys" ON "ApiKey"
  FOR ALL USING (user_id = current_user);

-- Insert sample API tiers
INSERT INTO "ApiKey" (key_hash, key_prefix, user_id, name, tier, requests_limit, is_active)
SELECT 
  'demo_key_hash_for_testing_only',
  'pk_demo_',
  id,
  'Demo Key',
  'free',
  100,
  true
FROM "User"
WHERE role = 'ADMIN'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Affiliate click tracking (detailed logs)
CREATE TABLE IF NOT EXISTS "AffiliateClick" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Affiliate conversions (sales)
CREATE TABLE IF NOT EXISTS "AffiliateConversion" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL,
  amount DECIMAL(10, 2),
  commission DECIMAL(10, 2),
  network TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_affiliate_click_product ON "AffiliateClick"(product_id, created_at);
CREATE INDEX idx_affiliate_conversion_product ON "AffiliateConversion"(product_id, created_at);

-- Comments
COMMENT ON TABLE "ApiKey" IS 'API keys for accessing paid data feeds';
COMMENT ON TABLE "ApiUsage" IS 'Usage logs for API analytics and rate limiting';
COMMENT ON TABLE "AffiliateClick" IS 'Detailed logs of affiliate link clicks';
COMMENT ON TABLE "AffiliateConversion" IS 'Affiliate sales conversions';;
