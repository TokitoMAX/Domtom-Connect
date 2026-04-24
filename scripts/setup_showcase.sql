-- Table pour la Vitrine / Showcase (Services & Produits)
CREATE TABLE IF NOT EXISTS showcase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    price_prefix TEXT DEFAULT 'À partir de', -- Ex: "À partir de", "Forfait", etc.
    image_url TEXT,
    category TEXT DEFAULT 'service', -- 'service' or 'product'
    status TEXT DEFAULT 'active', -- 'active' or 'private'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la performance des recherches par utilisateur et par catégorie
CREATE INDEX IF NOT EXISTS idx_showcase_user ON showcase_items(user_id);
CREATE INDEX IF NOT EXISTS idx_showcase_status ON showcase_items(status);

-- RLS (Row Level Security)
ALTER TABLE showcase_items ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les articles actifs
CREATE POLICY "Public can read active items" ON showcase_items 
FOR SELECT USING (status = 'active');

-- Seul le propriétaire peut gérer ses articles (All operations)
CREATE POLICY "Owners can manage their items" ON showcase_items 
FOR ALL USING (auth.uid() = user_id);
