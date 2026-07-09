-- ============================================================
-- mass_email_blast.sql – Domtom Connect
-- Envoi d'un Email de Lancement à TOUS les Utilisateurs Existants
-- ============================================================
-- IMPORTANT :
-- 1. Vérifier ton quota Brevo AVANT d'exécuter (300 emails/jour en plan gratuit)
-- 2. Exécuter ce script dans le SQL Editor de Supabase
-- 3. Ce script est à usage UNIQUE - ne pas relancer sans modifier le sujet
-- ============================================================

DO $$
DECLARE
    rec             RECORD;
    user_count      INT := 0;
    email_subject   TEXT;
    email_body      TEXT;
    first_name      TEXT;
BEGIN
    -- Sujet de la campagne (modifier à ta guise)
    email_subject := 'Du nouveau sur Domtom Connect – Rejoignez le réseau social ultramarin';

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

        -- Corps de l'email (professionnel, sans émoji)
        email_body := '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Du nouveau sur Domtom Connect</title>
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
                Le réseau professionnel<br>ultramarin est ouvert.
              </h1>
            </td>
          </tr>

          <!-- Corps principal -->
          <tr>
            <td style="background-color:#ffffff; padding: 40px; border-left:1px solid #e2e8f0; border-right:1px solid #e2e8f0;">

              <p style="margin:0 0 24px 0; font-size:1.05rem; color:#334155; line-height:1.7;">
                Bonjour ' || first_name || ',
              </p>

              <p style="margin:0 0 20px 0; font-size:1rem; color:#334155; line-height:1.7;">
                Depuis votre inscription sur Domtom Connect, la plateforme a considérablement évolué.
                Nous avons lancé <strong>DTC Moments</strong> : le premier réseau social professionnel
                dédié à la diaspora ultramarine et aux entrepreneurs des territoires insulaires.
              </p>

              <p style="margin:0 0 28px 0; font-size:1rem; color:#334155; line-height:1.7;">
                Ce que vous pouvez faire dès aujourd''hui depuis votre espace :
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
                          <strong style="color:#0f172a; font-size:0.95rem;">Publier vos actualités et opportunités</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">Partagez vos offres, recherches de partenariats ou actualités avec toute la communauté.</p>
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
                          <strong style="color:#0f172a; font-size:0.95rem;">Créer votre Chaîne professionnelle</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">Votre vitrine personnelle pour asseoir votre expertise et développer votre audience.</p>
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
                          <strong style="color:#0f172a; font-size:0.95rem;">Accéder aux offres d''emploi et aux projets</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">Trouvez des missions, des collaborateurs ou des experts dans votre territoire.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Principal -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://domtomconnect.com/mon-espace.html"
                       target="_blank"
                       style="display:inline-block; background-color:#10b981; color:#ffffff; text-decoration:none;
                              font-size:1rem; font-weight:700; padding:18px 40px; border-radius:12px;
                              letter-spacing:-0.01em;">
                      Accéder à mon espace
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Séparateur "La Nouveauté" -->
          <tr>
            <td style="background-color:#f8fafc; padding: 28px 40px; border-left:1px solid #e2e8f0; border-right:1px solid #e2e8f0; border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 12px 0; font-size:0.75rem; font-weight:800; color:#10b981; text-transform:uppercase; letter-spacing:0.1em;">
                Disponible maintenant
              </p>
              <h2 style="margin:0 0 12px 0; font-size:1.25rem; font-weight:800; color:#0f172a;">
                Le Réseau Social DTC Moments
              </h2>
              <p style="margin:0; font-size:0.9rem; color:#64748b; line-height:1.6;">
                Connectez-vous avec d''autres membres, échangez en temps réel, et construisez
                votre réseau professionnel au sein d''une communauté qui comprend vos enjeux territoriaux.
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color:#f8fafc; border-radius:0 0 16px 16px; border:1px solid #e2e8f0; border-top:none; padding: 28px 40px; text-align:center;">
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
