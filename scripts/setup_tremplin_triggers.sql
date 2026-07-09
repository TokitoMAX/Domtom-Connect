-- ============================================================
-- setup_tremplin_triggers.sql – Domtom Connect
-- Déclencheur automatique d'email pour l'utilisateur
-- lorsqu'il soumet le formulaire Tremplin / Incubateur
-- ============================================================

CREATE OR REPLACE FUNCTION public.notify_candidate_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    candidate_email TEXT;
    candidate_name  TEXT;
    first_name      TEXT;
    program_type    TEXT;
    resend_api_key TEXT := 're_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7';
BEGIN
    candidate_email := NEW.candidate_email;
    candidate_name  := COALESCE(NEW.candidate_name, 'Candidat');
    first_name      := split_part(candidate_name, ' ', 1);
    
    -- Optionnel : identifier le programme depuis le form
    program_type    := COALESCE(NEW.project_name, 'votre projet');

    PERFORM extensions.http_post(
        'https://api.resend.com/emails',
        json_build_object(
            'from', 'Domtom Connect <onboarding@resend.dev>',
            'to', ARRAY[candidate_email],
            'subject', 'Candidature bien reçue – Domtom Connect',
            'html', '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="background:#0f172a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
    <p style="margin:0;color:#f59e0b;font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Domtom Connect</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;">Dossier bien reçu.</h1>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Bonjour ' || first_name || ',</p>
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Votre candidature pour <strong>"' || program_type || '"</strong> a été transmise avec succès à notre équipe.</p>
    <p style="margin:0 0 28px;font-size:1rem;color:#334155;line-height:1.7;">Nous étudions minutieusement chaque profil. Vous recevrez une réponse d''ici 48h à 72h concernant la suite du processus.</p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="https://domtomconnect.com/" target="_blank"
         style="display:inline-block;background:#f59e0b;color:#fff;text-decoration:none;font-size:0.95rem;font-weight:700;padding:16px 32px;border-radius:12px;">
        Retour à l''accueil
      </a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:0.8rem;color:#94a3b8;">Domtom Connect – L''écosystème entrepreneurial ultramarin.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>'
        )::text,
        'application/json',
        ARRAY[extensions.http_header('Authorization', 'Bearer ' || resend_api_key)]
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_candidate_application ON public.program_applications;
CREATE TRIGGER trigger_candidate_application
    AFTER INSERT ON public.program_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_candidate_application();
