-- SCRIPT : Excellence Logistique & Fiscalité
ALTER TABLE public.showcase_orders 
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipping_carrier TEXT,
ADD COLUMN IF NOT EXISTS billing_address TEXT,
ADD COLUMN IF NOT EXISTS delivery_address TEXT,
ADD COLUMN IF NOT EXISTS invoice_number TEXT;

COMMENT ON COLUMN public.showcase_orders.tax_amount IS 'Montant des taxes calculées (TVA/Octroi de mer).';
COMMENT ON COLUMN public.showcase_orders.tracking_number IS 'Numéro de suivi du colis.';
COMMENT ON COLUMN public.showcase_orders.invoice_number IS 'Numéro de facture unique (ex: DOM-2024-001).';

-- Index pour la recherche par numéro de facture
CREATE INDEX IF NOT EXISTS idx_order_invoice ON showcase_orders(invoice_number);
