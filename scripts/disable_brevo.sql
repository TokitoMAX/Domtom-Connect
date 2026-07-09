-- disable_brevo.sql
-- Exécuter dans le SQL Editor de Supabase
CREATE OR REPLACE FUNCTION public.send_brevo_email(
    recipient_email TEXT,
    recipient_name  TEXT,
    subject         TEXT,
    html_content    TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- L'API Brevo n'est plus utilisée, on désactive l'envoi d'email 
    -- pour éviter que les erreurs 403 (Permission Denied) bloquent 
    -- les commentaires, likes, et abonnements.
    RETURN;
END;
$$;
