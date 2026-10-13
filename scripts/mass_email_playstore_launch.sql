-- ============================================================
-- mass_email_playstore_launch.sql – Domtom Connect
-- Annonce officielle : DTC Pulse est disponible sur le Google Play Store Android !
-- À exécuter directement dans le SQL Editor de Supabase
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
    email_subject := '🚀 DTC Pulse est disponible sur le Google Play Store Android !';

    FOR rec IN
        SELECT
            au.email,
            COALESCE(p.full_name, 'Membre du réseau') AS full_name
        FROM auth.users au
        LEFT JOIN public.profiles p ON p.id = au.id
        WHERE au.email IS NOT NULL
          AND au.deleted_at IS NULL
        ORDER BY au.created_at ASC
    LOOP
        first_name := split_part(rec.full_name, ' ', 1);
        IF first_name = '' OR first_name IS NULL THEN 
            first_name := 'Membre du réseau'; 
        END IF;

        email_body := '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DTC Pulse sur Google Play</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, Helvetica, Arial, sans-serif; color:#334155;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px; background-color:#f8fafc;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
          
          <!-- En-tête Sombre & Badge Vert -->
          <tr>
            <td style="background-color:#070d0a; padding: 40px 32px; text-align:center;">
              <span style="display:inline-block; background-color:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); color:#10b981; font-size:11px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; padding:6px 14px; border-radius:9999px;">
                Domtom Connect &bull; Officiel
              </span>
              <h1 style="margin:16px 0 0 0; color:#ffffff; font-size:1.75rem; font-weight:900; line-height:1.25;">
                DTC Pulse est disponible sur le Google Play Store !
              </h1>
              <p style="margin:10px 0 0 0; color:#94a3b8; font-size:0.95rem;">
                Votre écosystème d''affaires ultramarin directement sur smartphone Android
              </p>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 36px 32px; line-height:1.65; font-size:1rem; color:#334155;">
              <p style="margin:0 0 20px 0; font-size:1.05rem;">Bonjour ' || first_name || ',</p>

              <p style="margin:0 0 20px 0;">
                C''est officiel, l''application mobile <strong>DTC Pulse</strong> est certifiée et disponible pour tous les téléphones Android sur le <strong>Google Play Store</strong>.
              </p>

              <p style="margin:0 0 24px 0;">
                Plus besoin d''installation manuelle ni de configuration complexe. Vous pouvez désormais la télécharger en un clic et accéder à toute la dynamique économique péyi.
              </p>

              <!-- Bouton Call-to-Action Principal -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="https://play.google.com/store/apps/details?id=com.domtomconnect.app" target="_blank"
                       style="display:inline-block; background-color:#10b981; color:#02120b; text-decoration:none; font-size:1.05rem; font-weight:800; padding:18px 36px; border-radius:12px; box-shadow:0 6px 20px rgba(16,185,129,0.35);">
                      📲 Télécharger DTC Pulse sur Google Play
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Encadré Fonctionnalités Clés -->
              <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #10b981; padding:20px; border-radius:8px; margin:28px 0;">
                <h3 style="margin:0 0 12px 0; font-size:1.05rem; color:#0f172a; font-weight:800;">
                  Ce que vous allez retrouver dans l''application
                </h3>
                <ul style="margin:0; padding-left:20px; color:#475569; font-size:0.95rem; line-height:1.7;">
                  <li style="margin-bottom:8px;"><strong>DTC Map &bull;</strong> Localisez en temps réel les entreprises, commerces et créateurs péyi autour de vous.</li>
                  <li style="margin-bottom:8px;"><strong>DTC Live &bull;</strong> Participez aux sessions d''échanges et masterminds en direct entre les îles et la diaspora.</li>
                  <li style="margin-bottom:8px;"><strong>Vitrines & Showcase &bull;</strong> Achetez, vendez et développez vos mandats avec paiements sécurisés.</li>
                  <li><strong>Réseau Business &bull;</strong> Connectez-vous avec des entrepreneurs qui partagent vos réalités de terrain.</li>
                </ul>
              </div>

              <!-- Soutien et Avis -->
              <p style="margin:0 0 20px 0; font-size:0.95rem; color:#475569;">
                Chaque avis et chaque note 5 étoiles compte pour donner à nos talents toute la visibilité qu''ils méritent face aux algorithmes traditionnels.
              </p>

              <p style="margin:28px 0 0 0; font-size:0.95rem; color:#334155; font-weight:700;">
                Bien cordialement,<br>
                <span style="font-weight:400; color:#64748b;">Loïc Villeronce et l''équipe Domtom Connect</span><br>
                <a href="https://domtomconnect.com" style="color:#10b981; text-decoration:none; font-weight:600;">www.domtomconnect.com</a>
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color:#f1f5f9; padding:24px 32px; text-align:center; color:#64748b; font-size:0.8rem; border-top:1px solid #e2e8f0; line-height:1.5;">
              <p style="margin:0 0 6px 0;">
                Vous recevez cet email car vous êtes inscrit sur l''espace membre Domtom Connect.
              </p>
              <p style="margin:0;">
                &copy; 2026 Domtom Connect. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
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

    RAISE NOTICE 'Campagne Google Play Store envoyee avec succes a % utilisateurs.', user_count;
END;
$$;
