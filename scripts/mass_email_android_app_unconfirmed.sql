-- ============================================================
-- mass_email_android_app_unconfirmed.sql – Domtom Connect
-- Envoi d'un Email de relance (Utilisateurs non confirmés / inactifs)
-- ============================================================
-- IMPORTANT :
-- 1. Ce script cible UNIQUEMENT les comptes créés mais JAMAIS confirmés.
-- 2. Vérifier le quota Brevo AVANT d'exécuter.
-- 3. Exécuter ce script dans le SQL Editor de Supabase.
-- ============================================================

DO $$
DECLARE
    rec             RECORD;
    user_count      INT := 0;
    email_subject   TEXT;
    email_body      TEXT;
    first_name      TEXT;
BEGIN
    -- Sujet de la campagne de relance
    email_subject := '📱 Ne manquez pas l''application mobile Domtom Connect !';

    -- Boucle sur tous les utilisateurs inactifs (email NON confirmé)
    FOR rec IN
        SELECT
            au.email,
            COALESCE(p.full_name, 'Membre du réseau') AS full_name
        FROM auth.users au
        LEFT JOIN public.profiles p ON p.id = au.id
        WHERE au.email IS NOT NULL
          AND au.email_confirmed_at IS NULL  -- Uniquement les emails NON confirmés
          AND au.deleted_at IS NULL          -- Pas les comptes supprimés
        ORDER BY au.created_at ASC
    LOOP
        -- Extraire le prénom
        first_name := split_part(rec.full_name, ' ', 1);
        IF first_name = '' THEN
            first_name := 'Membre du réseau';
        END IF;

        -- Corps de l'email
        email_body := '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rejoignez la communauté sur l''App Mobile</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- En-tête -->
          <tr>
            <td style="background-color:#0f172a; border-radius:16px 16px 0 0; padding: 32px 40px; text-align:center;">
              <p style="margin:0; color:#10b981; font-size:0.75rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase;">Domtom Connect</p>
              <h1 style="margin: 12px 0 0 0; color:#ffffff; font-size:1.75rem; font-weight:800; letter-spacing:-0.03em; line-height:1.3;">
                Votre réseau social ultramarin<br>à portée de main.
              </h1>
            </td>
          </tr>

          <!-- Corps principal -->
          <tr>
            <td style="background-color:#ffffff; padding: 40px; border-left:1px solid #e2e8f0; border-right:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; border-radius:0 0 16px 16px;">

              <p style="margin:0 0 24px 0; font-size:1.05rem; color:#334155; line-height:1.7;">
                Bonjour ' || first_name || ',
              </p>

              <p style="margin:0 0 20px 0; font-size:1rem; color:#334155; line-height:1.7;">
                Il y a quelque temps, vous avez commencé votre inscription sur <strong>Domtom Connect</strong> sans la terminer totalement (votre e-mail n''a pas encore été confirmé).
              </p>

              <p style="margin:0 0 20px 0; font-size:1rem; color:#334155; line-height:1.7;">
                Aujourd''hui est le moment idéal pour nous rejoindre : <strong>L''application mobile DTC Pulse est enfin disponible sur Android !</strong>
              </p>
              
              <p style="margin:0 0 28px 0; font-size:1rem; color:#334155; line-height:1.7;">
                Venez découvrir ce que la communauté ultramarine partage chaque jour (opportunités, actualités territoriales, offres d''emploi, et messagerie instantanée).
              </p>

              <!-- CTA Principal -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://domtomconnect.com/application.html"
                       target="_blank"
                       style="display:inline-block; background-color:#10b981; color:#ffffff; text-decoration:none;
                              font-size:1rem; font-weight:700; padding:18px 40px; border-radius:12px;
                              letter-spacing:-0.01em; box-shadow: 0 10px 20px rgba(16,185,129,0.2);">
                      📲 Télécharger l''application
                    </a>
                  </td>
                </tr>
              </table>

              <p align="center" style="margin:0; font-size:0.9rem; color:#64748b;">
                Une fois sur le site, vous pourrez confirmer votre adresse e-mail ou vous reconnecter très facilement.
              </p>

            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="padding: 28px 40px; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:0.8rem; color:#94a3b8; line-height:1.5;">
                Cet email a été envoyé à <strong style="color:#64748b;">' || rec.email || '</strong> car vous avez débuté une inscription sur Domtom Connect.
              </p>
              <p style="margin:0; font-size:0.8rem; color:#94a3b8;">
                Pour vous désabonner de nos communications,
                <a href="mailto:contact@domtomconnect.com?subject=Desabonnement" style="color:#64748b; text-decoration:underline;">cliquez ici</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

        -- Envoi de l'email via Resend
        PERFORM net.http_post(
            url := 'https://api.resend.com/emails',
            body := jsonb_build_object(
                'from', 'Domtom Connect <onboarding@resend.dev>',
                'to', jsonb_build_array(rec.email),
                'subject', email_subject,
                'html', email_body
            ),
            headers := jsonb_build_object(
                'Authorization', 'Bearer re_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7',
                'Content-Type', 'application/json'
            )
        );

        user_count := user_count + 1;

        -- Petite pause toutes les 10 emails pour éviter le rate-limit Brevo
        IF user_count % 10 = 0 THEN
            PERFORM pg_sleep(0.5);
        END IF;

    END LOOP;

    RAISE NOTICE '% emails de relance envoyés avec succès.', user_count;
END;
$$;
