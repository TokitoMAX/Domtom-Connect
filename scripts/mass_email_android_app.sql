-- ============================================================
-- mass_email_android_app.sql – Domtom Connect
-- Envoi d'un Email pour annoncer l'Application Android
-- ============================================================
-- IMPORTANT :
-- 1. Vérifier le quota Brevo AVANT d'exécuter (300 emails/jour en plan gratuit)
-- 2. Exécuter ce script dans le SQL Editor de Supabase
-- ============================================================

DO $$
DECLARE
    rec             RECORD;
    user_count      INT := 0;
    email_subject   TEXT;
    email_body      TEXT;
    first_name      TEXT;
BEGIN
    -- Sujet de la campagne
    email_subject := '📱 L''application mobile Domtom Connect est disponible sur Android !';

    -- Boucle sur tous les utilisateurs actifs (email confirmé)
    FOR rec IN
        SELECT
            au.email,
            COALESCE(p.full_name, 'Membre du réseau') AS full_name
        FROM auth.users au
        LEFT JOIN public.profiles p ON p.id = au.id
        WHERE au.email IS NOT NULL
          AND au.email_confirmed_at IS NOT NULL  -- Uniquement les emails confirmés
          AND au.deleted_at IS NULL              -- Pas les comptes supprimés
        ORDER BY au.created_at ASC
    LOOP
        -- Extraire le prénom (premier mot du nom complet)
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
  <title>L''application mobile est là !</title>
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
                DTC Pulse arrive<br>sur votre smartphone.
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
                Excellente nouvelle ! L''application mobile <strong>DTC Pulse</strong> est désormais officiellement disponible pour tous nos utilisateurs sur <strong>Android</strong>.
              </p>
              
              <p style="margin:0 0 28px 0; font-size:1rem; color:#334155; line-height:1.7;">
                Afin de vous offrir une expérience fluide et sans intermédiaire, nous avons choisi de distribuer l''application en direct, en dehors du Play Store. Vous pouvez donc installer l''application en quelques secondes depuis notre site.
              </p>

              <!-- Feature list -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #f1f5f9; vertical-align:top;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px; vertical-align:top; padding-top:2px;">
                          <div style="width:8px; height:8px; background-color:#10b981; border-radius:50%; margin-top:6px;"></div>
                        </td>
                        <td>
                          <strong style="color:#0f172a; font-size:0.95rem;">Un réseau social dans la poche</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">Ne manquez plus aucune actualité, post ou story de la communauté ultramarine.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #f1f5f9; vertical-align:top;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px; vertical-align:top; padding-top:2px;">
                          <div style="width:8px; height:8px; background-color:#10b981; border-radius:50%; margin-top:6px;"></div>
                        </td>
                        <td>
                          <strong style="color:#0f172a; font-size:0.95rem;">Messagerie en temps réel</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">Communiquez facilement et recevez vos notifications directement sur votre smartphone.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; vertical-align:top;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px; vertical-align:top; padding-top:2px;">
                          <div style="width:8px; height:8px; background-color:#10b981; border-radius:50%; margin-top:6px;"></div>
                        </td>
                        <td>
                          <strong style="color:#0f172a; font-size:0.95rem;">Installation simple et rapide</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">Téléchargez le fichier APK et autorisez simplement l''installation sur votre appareil.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Principal -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://domtomconnect.com/application.html"
                       target="_blank"
                       style="display:inline-block; background-color:#10b981; color:#ffffff; text-decoration:none;
                              font-size:1rem; font-weight:700; padding:18px 40px; border-radius:12px;
                              letter-spacing:-0.01em; box-shadow: 0 10px 20px rgba(16,185,129,0.2);">
                      📲 Télécharger l''application Android
                    </a>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin-top: 16px;">
                <p style="margin: 0; font-size: 0.85rem; color: #92400e; line-height: 1.5;">
                  <strong>À noter :</strong> Lors de l''installation, votre appareil Android vous demandera peut-être d''autoriser les installations provenant de sources inconnues. C''est une procédure normale pour les applications téléchargées hors du Play Store.
                </p>
              </div>

            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="padding: 28px 40px; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:0.8rem; color:#94a3b8; line-height:1.5;">
                Vous recevez cet email car vous êtes membre de Domtom Connect.<br>
                Cet email a été envoyé à <strong style="color:#64748b;">' || rec.email || '</strong>.
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

        -- Envoi de l'email à cet utilisateur
        PERFORM public.send_brevo_email(
            rec.email,
            rec.full_name,
            email_subject,
            email_body
        );

        user_count := user_count + 1;

        -- Petite pause toutes les 10 emails pour éviter le rate-limit Brevo
        IF user_count % 10 = 0 THEN
            PERFORM pg_sleep(0.5);
        END IF;

    END LOOP;

    RAISE NOTICE '% emails envoyés avec succès.', user_count;
END;
$$;
