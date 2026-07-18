-- ============================================================
-- setup_analytics_tables.sql – Domtom Connect
-- Système analytique (Data Harvesting)
-- ============================================================
-- Création des tables pour suivre l'activité et les performances
-- ============================================================

-- 1. Table des logs d'activité utilisateur
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(255) NOT NULL, -- Ex: 'login', 'profile_update', 'item_viewed'
    metadata JSONB DEFAULT '{}'::jsonb, -- Données additionnelles (URL, ID du post...)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer les requêtes d'activité
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_action ON public.user_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_date ON public.user_activity_logs(created_at);

-- Activer RLS (Row Level Security)
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs ne peuvent lire que leurs propres logs, l'admin a tous les droits
DROP POLICY IF EXISTS "Users can read own activity logs" ON public.user_activity_logs;
CREATE POLICY "Users can read own activity logs" 
    ON public.user_activity_logs FOR SELECT 
    USING (auth.uid() = user_id);

-- Politique : Permettre l'insertion par le compte de service (API) ou l'utilisateur
DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity_logs;
CREATE POLICY "Users can insert own activity" 
    ON public.user_activity_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 2. Table des logs de campagnes E-mail (pour les Webhooks Resend)
CREATE TABLE IF NOT EXISTS public.email_campaign_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL, -- Ex: 'onboarding_d3', 'inactivity_d30'
    resend_id VARCHAR(255) UNIQUE,       -- ID fourni par Resend lors de l'envoi
    status VARCHAR(50) DEFAULT 'sent',   -- 'sent', 'delivered', 'opened', 'clicked', 'bounced'
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer le traitement des webhooks (via resend_id)
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_id ON public.email_campaign_logs(resend_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign ON public.email_campaign_logs(campaign_name);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_campaign_logs(user_id);

-- Activer RLS
ALTER TABLE public.email_campaign_logs ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs n'ont pas accès à cette table en lecture directement
DROP POLICY IF EXISTS "Admin only read email logs" ON public.email_campaign_logs;
CREATE POLICY "Admin only read email logs" 
    ON public.email_campaign_logs FOR SELECT 
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- 3. Vues Analytiques (Views) pour simplifier les requêtes Admin
DROP VIEW IF EXISTS public.view_campaign_performance;
CREATE VIEW public.view_campaign_performance AS
SELECT 
    campaign_name,
    COUNT(*) as total_sent,
    SUM(CASE WHEN status IN ('opened', 'clicked') THEN 1 ELSE 0 END) as total_opened,
    SUM(CASE WHEN status = 'clicked' THEN 1 ELSE 0 END) as total_clicked,
    SUM(CASE WHEN status = 'bounced' THEN 1 ELSE 0 END) as total_bounced,
    ROUND((SUM(CASE WHEN status IN ('opened', 'clicked') THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100, 2) as open_rate_percentage
FROM 
    public.email_campaign_logs
GROUP BY 
    campaign_name
ORDER BY 
    total_sent DESC;

DROP VIEW IF EXISTS public.view_active_users_30_days;
CREATE VIEW public.view_active_users_30_days AS
SELECT DISTINCT user_id 
FROM public.user_activity_logs 
WHERE created_at >= (CURRENT_TIMESTAMP - INTERVAL '30 days');

-- Fin du script
