-- ============================================================
-- mass_email_android_app_unconfirmed.sql – Domtom Connect
-- Envoi d'un Email de relance (Utilisateurs inactifs) via Resend BATCH API
-- ============================================================

DO $$
DECLARE
    rec             RECORD;
    user_count      INT := 0;
    email_subject   TEXT;
    email_body      TEXT;
    first_name      TEXT;
    batch_array     JSONB := '[]'::jsonb;
    sender_email    TEXT := 'contact@domtomconnect.com'; -- DOMAINE VÉRIFIÉ
BEGIN
    email_subject := '📱 Ne manquez pas l''application mobile Domtom Connect !';

    FOR rec IN
        SELECT
            au.email,
            COALESCE(p.full_name, 'Membre du réseau') AS full_name
        FROM auth.users au
        LEFT JOIN public.profiles p ON p.id = au.id
        WHERE au.email IS NOT NULL
          AND au.email_confirmed_at IS NULL  -- NON confirmés
          AND au.deleted_at IS NULL
        ORDER BY au.created_at ASC
    LOOP
        first_name := split_part(rec.full_name, ' ', 1);
        IF first_name = '' THEN first_name := 'Membre du réseau'; END IF;

        email_body := '
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
        <tr>
          <td style="background-color:#0f172a; border-radius:16px 16px 0 0; padding: 32px 40px; text-align:center;">
            <p style="margin:0; color:#10b981; font-size:0.75rem; font-weight:700; text-transform:uppercase;">Domtom Connect</p>
            <h1 style="margin: 12px 0 0 0; color:#ffffff; font-size:1.75rem; font-weight:800;">Votre réseau social ultramarin<br>à portée de main.</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color:#ffffff; padding: 40px; border-left:1px solid #e2e8f0; border-right:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; border-radius:0 0 16px 16px;">
            <p style="margin:0 0 24px 0; font-size:1.05rem; color:#334155;">Bonjour ' || first_name || ',</p>
            <p style="margin:0 0 20px 0; font-size:1rem; color:#334155;">Il y a quelque temps, vous avez commencé votre inscription sur <strong>Domtom Connect</strong> sans la terminer totalement.</p>
            <p style="margin:0 0 20px 0; font-size:1rem; color:#334155;">Aujourd''hui est le moment idéal pour nous rejoindre : <strong>L''application mobile DTC Pulse est enfin disponible sur Android !</strong></p>
            <p style="margin:0 0 28px 0; font-size:1rem; color:#334155;">Venez découvrir ce que la communauté ultramarine partage chaque jour.</p>
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
              <tr><td align="center">
                <a href="https://domtomconnect.com/application.html" target="_blank"
                   style="display:inline-block; background-color:#10b981; color:#ffffff; text-decoration:none; font-size:1rem; font-weight:700; padding:18px 40px; border-radius:12px;">
                  📲 Télécharger l''application
                </a>
              </td></tr>
            </table>
            <p align="center" style="margin:0; font-size:0.9rem; color:#64748b;">Une fois sur le site, vous pourrez confirmer votre adresse e-mail ou vous reconnecter très facilement.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>';

        -- Ajouter l'email au batch
        batch_array := batch_array || jsonb_build_object(
            'from', 'Domtom Connect <' || sender_email || '>',
            'to', jsonb_build_array(rec.email),
            'subject', email_subject,
            'html', email_body
        );

        user_count := user_count + 1;

        -- Batch API de Resend
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

    -- Dernier batch
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

    RAISE NOTICE '% emails de relance ajoutés aux batchs d''envoi.', user_count;
END;
$$;
