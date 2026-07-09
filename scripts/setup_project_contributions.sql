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

-- Sécurité : Ajout des colonnes si la table existe déjà sans elles
ALTER TABLE public.contributions ADD COLUMN IF NOT EXISTS donor_name TEXT;
ALTER TABLE public.contributions ADD COLUMN IF NOT EXISTS donor_message TEXT;
ALTER TABLE public.contributions ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Index pour accélérer les lookups par projet
CREATE INDEX IF NOT EXISTS idx_contributions_project_id ON public.contributions(project_id);

-- Ajout d'une colonne pour suivre le financement total dans la table projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS total_raised DECIMAL(12, 2) DEFAULT 0;

-- Fonction Trigger pour mettre à jour dynamiquement le total_raised et le solde financier du porteur
CREATE OR REPLACE FUNCTION public.handle_contribution_update()
RETURNS TRIGGER AS $$
DECLARE
    project_owner_id UUID;
    net_val DECIMAL(12,2);
BEGIN
    -- Récupérer l'ID du porteur de projet
    SELECT owner_id INTO project_owner_id FROM public.projects WHERE id = NEW.project_id;

    -- Si nouvelle contribution complétée
    IF (NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed')) THEN
        
        -- 1. Mise à jour du compteur public de la levée de fonds
        UPDATE public.projects 
        SET total_raised = COALESCE(total_raised, 0) + NEW.amount
        WHERE id = NEW.project_id;

        -- 2. Calcul financier (95% porteur / 5% Domtom Connect)
        net_val := NEW.amount * 0.95;

        -- 3. Crédit du solde de l'expert/propriétaire
        UPDATE public.profiles
        SET 
            balance = COALESCE(balance, 0) + net_val,
            total_earnings = COALESCE(total_earnings, 0) + NEW.amount
        WHERE id = project_owner_id;

        -- 4. Audit Trail
        INSERT INTO public.transaction_logs (provider_id, amount, type, status)
        VALUES (project_owner_id, net_val, 'credit', 'crowdfunding_contribution');
    
    -- Gestion des remboursements (optionnel pour l'instant)
    ELSIF (NEW.status IN ('failed', 'refunded') AND OLD.status = 'completed') THEN
        UPDATE public.projects 
        SET total_raised = total_raised - OLD.amount
        WHERE id = NEW.project_id;
        
        -- Note: Le retrait du solde en cas de remboursement doit être géré avec prudence pour éviter les soldes négatifs.
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
