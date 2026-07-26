-- ============================================================
-- mass_email_v6_update.sql – Domtom Connect
-- Envoi de la campagne Email pour la Mise à Jour Majeure DTC Pulse v6
-- Format professionnel sans émojis
-- ============================================================

DO $$
DECLARE
    rec             RECORD;
    user_count      INT := 0;
    email_subject   TEXT;
    email_body      TEXT;
    first_name      TEXT;
    batch_array     JSONB := '[]'::jsonb;
    sender_email    TEXT := 'contact@domtomconnect.com';
BEGIN
    email_subject := 'Mise à jour majeure DTC Pulse - Version 6';

    FOR rec IN
        SELECT
            au.email,
            COALESCE(p.full_name, 'Membre du réseau') AS full_name
        FROM auth.users au
        LEFT JOIN public.profiles p ON p.id = au.id
        WHERE au.email IS NOT NULL
          AND au.email_confirmed_at IS NOT NULL
          AND au.deleted_at IS NULL
        ORDER BY au.created_at ASC
    LOOP
        first_name := split_part(rec.full_name, ' ', 1);
        IF first_name = '' THEN first_name := 'Membre du réseau'; END IF;

        email_body := '
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border-radius: 12px; overflow: hidden; background-color:#ffffff; border: 1px solid #e2e8f0;">
        <tr>
          <td style="background-color:#0f172a; padding: 32px 40px; text-align:left;">
            <p style="margin:0; color:#10b981; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em;">Domtom Connect</p>
            <h1 style="margin: 10px 0 0 0; color:#ffffff; font-size:1.5rem; font-weight:700; line-height:1.3;">Mise à jour majeure de l''application DTC Pulse (v6)</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px; color:#334155; font-size:0.95rem; line-height:1.6;">
            <p style="margin:0 0 20px 0;">Bonjour ' || first_name || ',</p>
            
            <p style="margin:0 0 20px 0;">
              Nous vous informons qu''une nouvelle version officielle (v6) de l''application mobile <strong>DTC Pulse</strong> est disponible. Cette version apporte des améliorations majeures concernant les fonctionnalités, la stabilité et la sécurité.
            </p>

            <p style="margin:0 0 24px 0;">
              Afin d''assurer la continuité de vos services et de bénéficier des dernières fonctionnalités, nous vous invitons à procéder à la mise à jour dès à présent.
            </p>

            <div style="background-color:#f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0f172a; padding: 24px; border-radius: 6px; margin-bottom: 28px;">
              <h3 style="margin:0 0 14px 0; font-size:1rem; color:#0f172a; font-weight:700;">Procédure d''installation :</h3>
              <ol style="margin:0; padding-left:20px; color:#334155; line-height:1.7;">
                <li style="margin-bottom:8px;">Accédez à la page officielle : <a href="https://domtomconnect.com/application.html" target="_blank" style="color:#0f172a; font-weight:600; text-decoration:underline;">domtomconnect.com/application.html</a></li>
                <li style="margin-bottom:8px;">Cliquez sur le bouton <strong>Télécharger la version v6 (APK)</strong>.</li>
                <li>Exécutez l''installation sur votre appareil Android. <em>(En cas de message indiquant un conflit d''ancienne version, veuillez désinstaller la version précédente du 13 juillet avant de lancer l''installation de la v6).</em></li>
              </ol>
            </div>

            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
              <tr><td align="center">
                <a href="https://domtomconnect.com/application.html" target="_blank"
                   style="display:inline-block; background-color:#0f172a; color:#ffffff; text-decoration:none; font-size:0.95rem; font-weight:600; padding:16px 36px; border-radius:8px;">
                  Télécharger la version v6 (APK)
                </a>
              </td></tr>
            </table>

            <p style="margin:0 0 8px 0; font-size:0.9rem; color:#64748b;">
              Pour toute question ou assistance technique, notre support reste joignable à l''adresse <a href="mailto:contact@domtomconnect.com" style="color:#64748b; text-decoration:underline;">contact@domtomconnect.com</a>.
            </p>
            
            <p style="margin:24px 0 0 0; font-size:0.95rem; color:#334155; font-weight:600;">
              Cordialement,<br>
              <span style="font-weight:400; color:#64748b;">L''équipe Domtom Connect</span>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f1f5f9; padding: 20px; text-align:center; color:#64748b; font-size:0.8rem; border-top:1px solid #e2e8f0;">
            © 2026 Domtom Connect. Tous droits réservés.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>';

        -- Ajouter l'email au batch (Resend Batch API)
        batch_array := batch_array || jsonb_build_object(
            'from', 'Domtom Connect <' || sender_email || '>',
            'to', jsonb_build_array(rec.email),
            'subject', email_subject,
            'html', email_body
        );

        user_count := user_count + 1;

        -- Resend Batch API supporte jusqu'à 100 emails par requête
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

    -- Envoyer les emails restants dans le dernier batch
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

    RAISE NOTICE '% emails de notification v6 ajoutés aux batchs d''envoi avec succès.', user_count;
END;
$$;
