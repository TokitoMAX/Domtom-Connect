-- Update business_docs for Stripe integration
ALTER TABLE public.business_docs 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_business_docs_stripe_session ON public.business_docs(stripe_session_id);

-- Ensure profiles has balance and total_earnings (already done by stripe_migration.sql but safe to repeat)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) DEFAULT 0;

-- Ensure profiles has subscription fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;
