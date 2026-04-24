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

-- Sécurité : Ajout de la colonne unit si elle n'existe pas déjà (pour les mises à jour)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='showcase_items' AND column_name='unit') THEN
        ALTER TABLE showcase_items ADD COLUMN unit TEXT;
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
FOR ALL USING (auth.uid() = user_id);
