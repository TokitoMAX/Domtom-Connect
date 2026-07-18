-- ============================================================
-- setup_automations_pro.sql – Domtom Connect
-- Automatisations E-mail (Onboarding & Relance)
-- ============================================================

-- 1. Fonction : Séquence Onboarding (J+3)
-- Envoie un e-mail institutionnel 3 jours après l'inscription si le profil est incomplet.
CREATE OR REPLACE FUNCTION public.send_onboarding_d3()
RETURNS void AS $$
DECLARE
    rec RECORD;
    email_body TEXT;
    email_subject TEXT;
    batch_array JSONB := '[]'::jsonb;
    sender_email TEXT := 'contact@domtomconnect.com';
BEGIN
    email_subject := 'Optimisez votre profil professionnel sur Domtom Connect';

    FOR rec IN
        SELECT
            au.email,
            COALESCE(p.full_name, 'Membre') AS full_name
        FROM auth.users au
        JOIN public.profiles p ON p.id = au.id
        WHERE au.created_at >= (CURRENT_DATE - INTERVAL '4 days')
          AND au.created_at < (CURRENT_DATE - INTERVAL '3 days')
          AND au.email_confirmed_at IS NOT NULL
          AND au.deleted_at IS NULL
          AND p.avatar_url IS NULL -- Critère "Profil incomplet"
    LOOP
        email_body := '
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border:1px solid #e2e8f0; border-radius:8px;">
        <tr>
          <td style="padding: 30px 40px; border-bottom:1px solid #e2e8f0; text-align:center;">
            <h1 style="margin:0; color:#0f172a; font-size:1.5rem; font-weight:bold;">Domtom Connect</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px;">
            <p style="margin:0 0 20px 0; font-size:1rem; color:#334155;">Bonjour ' || split_part(rec.full_name, ' ', 1) || ',</p>
            <p style="margin:0 0 20px 0; font-size:1rem; color:#334155; line-height:1.6;">Nous vous remercions pour votre inscription sur Domtom Connect, le réseau professionnel des territoires ultramarins.</p>
            <p style="margin:0 0 20px 0; font-size:1rem; color:#334155; line-height:1.6;">Nous avons remarqué que votre profil n''est pas encore totalement renseigné. Compléter vos informations (photo, parcours) vous permettra d''accroître votre visibilité auprès de notre communauté et des recruteurs.</p>
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
              <tr><td align="center">
                <a href="https://domtomconnect.com/profil.html" target="_blank"
                   style="display:inline-block; background-color:#1e293b; color:#ffffff; text-decoration:none; font-size:1rem; padding:15px 30px; border-radius:6px; font-weight:bold;">
                  Mettre à jour mon profil
                </a>
              </td></tr>
            </table>
            <p style="margin:0; font-size:1rem; color:#334155;">Cordialement,<br>L''équipe Domtom Connect</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>';

        batch_array := batch_array || jsonb_build_object(
            'from', 'Domtom Connect <' || sender_email || '>',
            'to', jsonb_build_array(rec.email),
            'subject', email_subject,
            'html', email_body
        );

        IF jsonb_array_length(batch_array) >= 90 THEN
            PERFORM net.http_post(
                url := 'https://api.resend.com/emails/batch',
                body := batch_array,
                headers := jsonb_build_object(
                    'Authorization', 'Bearer re_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7',
                    'Content-Type', 'application/json'
                )
            );
            batch_array := '[]'::jsonb;
            PERFORM pg_sleep(1);
        END IF;
    END LOOP;

    IF jsonb_array_length(batch_array) > 0 THEN
        PERFORM net.http_post(
            url := 'https://api.resend.com/emails/batch',
            body := batch_array,
            headers := jsonb_build_object(
                'Authorization', 'Bearer re_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7',
                'Content-Type', 'application/json'
            )
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Fonction : Relance Inactifs (J+30)
-- Envoie un e-mail aux utilisateurs inactifs depuis plus de 30 jours.
CREATE OR REPLACE FUNCTION public.send_inactivity_d30()
RETURNS void AS $$
DECLARE
    rec RECORD;
    email_body TEXT;
    email_subject TEXT;
    batch_array JSONB := '[]'::jsonb;
    sender_email TEXT := 'contact@domtomconnect.com';
BEGIN
    email_subject := 'Actualités de votre réseau Domtom Connect';

    FOR rec IN
        SELECT au.email, COALESCE(p.full_name, 'Membre') AS full_name
        FROM auth.users au
        JOIN public.profiles p ON p.id = au.id
        WHERE au.email_confirmed_at IS NOT NULL
          AND au.deleted_at IS NULL
          AND au.id NOT IN (
              -- Exclure ceux qui ont une activité dans les 30 derniers jours
              SELECT user_id FROM public.user_activity_logs WHERE created_at >= (CURRENT_DATE - INTERVAL '30 days')
          )
    LOOP
        email_body := '
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border:1px solid #e2e8f0; border-radius:8px;">
        <tr>
          <td style="padding: 30px 40px; border-bottom:1px solid #e2e8f0; text-align:center;">
            <h1 style="margin:0; color:#0f172a; font-size:1.5rem; font-weight:bold;">Domtom Connect</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px;">
            <p style="margin:0 0 20px 0; font-size:1rem; color:#334155;">Bonjour ' || split_part(rec.full_name, ' ', 1) || ',</p>
            <p style="margin:0 0 20px 0; font-size:1rem; color:#334155; line-height:1.6;">Cela fait plusieurs semaines que vous ne vous êtes pas connecté à la plateforme Domtom Connect.</p>
            <p style="margin:0 0 20px 0; font-size:1rem; color:#334155; line-height:1.6;">De nouvelles offres professionnelles, événements et discussions ont été publiés récemment. Connectez-vous dès à présent pour ne pas manquer les dernières opportunités de votre réseau.</p>
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
              <tr><td align="center">
                <a href="https://domtomconnect.com/" target="_blank"
                   style="display:inline-block; background-color:#1e293b; color:#ffffff; text-decoration:none; font-size:1rem; padding:15px 30px; border-radius:6px; font-weight:bold;">
                  Accéder à la plateforme
                </a>
              </td></tr>
            </table>
            <p style="margin:0; font-size:1rem; color:#334155;">Cordialement,<br>La Direction Domtom Connect</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>';

        batch_array := batch_array || jsonb_build_object(
            'from', 'Domtom Connect <' || sender_email || '>',
            'to', jsonb_build_array(rec.email),
            'subject', email_subject,
            'html', email_body
        );

        IF jsonb_array_length(batch_array) >= 90 THEN
            PERFORM net.http_post(
                url := 'https://api.resend.com/emails/batch',
                body := batch_array,
                headers := jsonb_build_object(
                    'Authorization', 'Bearer re_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7',
                    'Content-Type', 'application/json'
                )
            );
            batch_array := '[]'::jsonb;
            PERFORM pg_sleep(1);
        END IF;
    END LOOP;

    IF jsonb_array_length(batch_array) > 0 THEN
        PERFORM net.http_post(
            url := 'https://api.resend.com/emails/batch',
            body := batch_array,
            headers := jsonb_build_object(
                'Authorization', 'Bearer re_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7',
                'Content-Type', 'application/json'
            )
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Fonction Mère : Exécute toutes les automatisations
CREATE OR REPLACE FUNCTION public.run_daily_automations()
RETURNS void AS $$
BEGIN
    -- 1. Onboarding (J+3)
    PERFORM public.send_onboarding_d3();
    
    -- 2. Relance Inactifs (J+30)
    PERFORM public.send_inactivity_d30();
    
    -- (D'autres campagnes peuvent être ajoutées ici)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Planification via pg_cron (tous les jours à 02:00 UTC)
-- Nécessite l'extension pg_cron activée sur Supabase
-- SELECT cron.schedule('daily_automations', '0 2 * * *', 'SELECT public.run_daily_automations();');
