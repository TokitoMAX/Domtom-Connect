-- Création de la table des contributions pour le Soutien Participatif (Domtom Connect)
-- Ce script gère les dons/soutiens aux projets de l'écosystème.

CREATE TABLE IF NOT EXISTS public.contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- NULL si donateur non inscrit ou anonyme
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'EUR',
    status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
    donor_name TEXT,
    donor_message TEXT,
    payment_id TEXT, -- ID de transaction PayPal
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
 );

-- Index pour accélérer les lookups par projet
CREATE INDEX IF NOT EXISTS idx_contributions_project_id ON public.contributions(project_id);

-- Ajout d'une colonne pour suivre le financement total dans la table projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS total_raised DECIMAL(12, 2) DEFAULT 0;

-- Fonction Trigger pour mettre à jour dynamiquement le total_raised d'un projet
CREATE OR REPLACE FUNCTION public.handle_contribution_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Si nouvelle contribution complétée
    IF (TG_OP = 'INSERT' AND NEW.status = 'completed') THEN
        UPDATE public.projects 
        SET total_raised = total_raised + NEW.amount
        WHERE id = NEW.project_id;
    
    -- Si mise à jour vers statut complété
    ELSIF (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status != 'completed') THEN
        UPDATE public.projects 
        SET total_raised = total_raised + NEW.amount
        WHERE id = NEW.project_id;
        
    -- Si annulation ou remboursement
    ELSIF (TG_OP = 'UPDATE' AND NEW.status IN ('failed', 'refunded') AND OLD.status = 'completed') THEN
        UPDATE public.projects 
        SET total_raised = total_raised - OLD.amount
        WHERE id = NEW.project_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS tr_contribution_update ON public.contributions;
CREATE TRIGGER tr_contribution_update
AFTER INSERT OR UPDATE ON public.contributions
FOR EACH ROW EXECUTE FUNCTION public.handle_contribution_update();

-- Sécurité (RLS)
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Lecture publique (tout le monde peut voir le succès d'un projet)
DROP POLICY IF EXISTS "Public view contributions" ON public.contributions;
CREATE POLICY "Public view contributions"
ON public.contributions FOR SELECT
USING (true);

-- Insertion (tout le monde peut tenter de contribuer via PayPal, le statut passera à completed via le système de paiement)
DROP POLICY IF EXISTS "Anyone can contribute" ON public.contributions;
CREATE POLICY "Anyone can contribute"
ON public.contributions FOR INSERT
WITH CHECK (true);

-- Notifier le succès (Logique métier additionnelle)
COMMENT ON TABLE public.contributions IS 'Table gérant le soutien participatif aux Épopées des Antilles.';
