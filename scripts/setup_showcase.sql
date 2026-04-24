-- Table pour la Vitrine / Showcase (Services & Produits)
CREATE TABLE IF NOT EXISTS showcase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    price_prefix TEXT DEFAULT 'À partir de', -- Ex: "À partir de", "Forfait", etc.
    image_url TEXT,
    unit TEXT, -- Ex: "heure", "jour", "unité"
    category TEXT DEFAULT 'service', -- 'service' or 'product'
    status TEXT DEFAULT 'active', -- 'active' or 'private'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FORCE UPDATE: Migration des clés étrangères vers profiles si nécessaire
DO $$ 
BEGIN 
    -- Pour showcase_items
    ALTER TABLE showcase_items DROP CONSTRAINT IF EXISTS showcase_items_user_id_fkey;
    ALTER TABLE showcase_items ADD CONSTRAINT showcase_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

    -- Pour showcase_orders (buyer)
    ALTER TABLE showcase_orders DROP CONSTRAINT IF EXISTS showcase_orders_buyer_id_fkey;
    ALTER TABLE showcase_orders ADD CONSTRAINT showcase_orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES profiles(id) ON DELETE CASCADE;

    -- Pour showcase_orders (provider)
    ALTER TABLE showcase_orders DROP CONSTRAINT IF EXISTS showcase_orders_provider_id_fkey;
    ALTER TABLE showcase_orders ADD CONSTRAINT showcase_orders_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES profiles(id) ON DELETE CASCADE;

    -- Ajout de la colonne unit si manquante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase_items' AND column_name='unit') THEN
        ALTER TABLE showcase_items ADD COLUMN unit TEXT;
    END IF;

    -- Ajout des champs Shopify
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='shopify_domain') THEN
        ALTER TABLE profiles ADD COLUMN shopify_domain TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='shopify_access_token') THEN
        ALTER TABLE profiles ADD COLUMN shopify_access_token TEXT;
    END IF;
END $$;

-- Index pour la performance des recherches par utilisateur et par catégorie
CREATE INDEX IF NOT EXISTS idx_showcase_user ON showcase_items(user_id);
CREATE INDEX IF NOT EXISTS idx_showcase_status ON showcase_items(status);

-- RLS (Row Level Security)
ALTER TABLE showcase_items ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les articles actifs
DROP POLICY IF EXISTS "Public can read active items" ON showcase_items;
CREATE POLICY "Public can read active items" ON showcase_items 
FOR SELECT USING (status = 'active');

-- Table pour les Commandes (Orders)
CREATE TABLE IF NOT EXISTS showcase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES showcase_items(id) ON DELETE SET NULL,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'fulfilled', 'cancelled'
    quantity INTEGER DEFAULT 1,
    total_price NUMERIC,
    client_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS pour les commandes
ALTER TABLE showcase_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders (buyer or provider)" ON showcase_orders;
CREATE POLICY "Users can view their own orders (buyer or provider)" ON showcase_orders
FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = provider_id);

DROP POLICY IF EXISTS "Buyers can create orders" ON showcase_orders;
CREATE POLICY "Buyers can create orders" ON showcase_orders
FOR INSERT WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Providers can update order status" ON showcase_orders;
CREATE POLICY "Providers can update order status" ON showcase_orders
FOR UPDATE USING (auth.uid() = provider_id);

-- Seul le propriétaire peut gérer ses articles (All operations)
DROP POLICY IF EXISTS "Owners can manage their items" ON showcase_items;
CREATE POLICY "Owners can manage their items" ON showcase_items 
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- POLITIQUES POUR LE STOCKAGE DES IMAGES (Storage)
-- Note: À exécuter dans l'éditeur SQL pour configurer le bucket 'showcase'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('showcase', 'showcase', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (bucket_id = 'showcase');

DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'showcase' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Owners can delete their images" ON storage.objects;
CREATE POLICY "Owners can delete their images" ON storage.objects FOR DELETE USING (bucket_id = 'showcase' AND auth.uid() = (storage.foldername(name))[1]::uuid);
