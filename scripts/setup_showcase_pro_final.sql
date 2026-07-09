-- SCRIPT : Expertise Fiscale & Logistique Finale
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0;

-- SCRIPT : Adresses Clients dans les commandes
ALTER TABLE public.showcase_orders
ADD COLUMN IF NOT EXISTS shipping_name TEXT,
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_zip TEXT,
ADD COLUMN IF NOT EXISTS shipping_country TEXT DEFAULT 'France';

COMMENT ON COLUMN public.profiles.tax_rate IS 'Taux de taxe applicable par l''expert (ex: 8.5 pour l''octroi de mer).';
