-- ============================================================
-- mass_email_tremplin.sql – Domtom Connect
-- Envoi de la campagne Programme Tremplin (6 Piliers d'Exécution)
-- Format 100% professionnel, aucun émoji.
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
    email_subject := 'Programme Tremplin : Construire une entreprise solide ne se fait pas au temps passé';

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
        IF first_name IS NULL OR first_name = '' THEN 
            first_name := 'Membre du réseau'; 
        END IF;

        email_body := REPLACE($html$<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Programme Tremplin · Domtom Connect</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#334155;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border-radius: 12px; overflow: hidden; background-color:#ffffff; border: 1px solid #e2e8f0;">
          
          <!-- En-tête -->
          <tr>
            <td style="background-color:#0f172a; padding: 36px 40px; text-align:left;">
              <p style="margin:0; color:#10b981; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em;">Domtom Connect · Programme Tremplin</p>
              <h1 style="margin: 10px 0 0 0; color:#ffffff; font-size:1.45rem; font-weight:700; line-height:1.35;">
                Construire une entreprise solide ne se fait pas au temps passé
              </h1>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 40px; font-size:0.95rem; line-height:1.65; color:#334155;">
              <p style="margin:0 0 20px 0;">Bonjour {{FIRST_NAME}},</p>

              <p style="margin:0 0 20px 0;">
                Développer un projet rentable entre l'Outre-Mer, l'Afrique et la diaspora confronte souvent les dirigeants à un même problème : accumuler des conseils théoriques sans jamais voir de résultats concrets en ligne.
              </p>

              <p style="margin:0 0 24px 0;">
                Le succès d'une entreprise ne dépend pas du nombre d'heures passées en visioconférence, mais de la mise en place de piliers opérationnels capables de générer du chiffre d'affaires.
              </p>

              <!-- Encadré Piliers -->
              <div style="background-color:#f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; padding: 22px; border-radius: 6px; margin: 24px 0;">
                <h2 style="margin:0 0 14px 0; font-size:1.05rem; color:#0f172a; font-weight:700;">
                  Les 6 Piliers d'Exécution du Programme Tremplin
                </h2>
                <ul style="margin:0; padding-left:20px; font-size:0.9rem; color:#334155; line-height:1.7;">
                  <li style="margin-bottom:8px;"><strong>Positionnement & Offres :</strong> Clarifier votre proposition de valeur et fixer une tarification rentable.</li>
                  <li style="margin-bottom:8px;"><strong>Présence Web & Conversion :</strong> Déployer un site vitrine et des tunnels optimisés pour convertir.</li>
                  <li style="margin-bottom:8px;"><strong>Image de Marque :</strong> Concevoir une identité visuelle crédible et soignée.</li>
                  <li style="margin-bottom:8px;"><strong>Acquisition & Prospection :</strong> Installer un système prévisible de qualification de prospects.</li>
                  <li style="margin-bottom:8px;"><strong>Structuration Financière :</strong> Sécuriser vos encaissements et piloter vos marges nettes.</li>
                  <li><strong>Visibilité Média :</strong> Asseoir votre autorité et diffuser vos réussites.</li>
                </ul>
              </div>

              <p style="margin:0 0 28px 0; font-size:0.95rem; color:#334155; line-height:1.65;">
                Notre engagement repose sur une règle stricte : <strong>chaque pilier est validé uniquement lorsqu'il est en production, testé et 100% opérationnel</strong>.
              </p>

              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <a href="https://domtomconnect.com/tremplin.html" target="_blank"
                       style="display:inline-block; background-color:#10b981; color:#ffffff; text-decoration:none; font-size:0.95rem; font-weight:600; padding:15px 34px; border-radius:8px;">
                      Découvrir le Programme Tremplin & Candidater
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px 0; font-size:0.9rem; color:#64748b; line-height:1.6;">
                Pour toute question relative à l'éligibilité de votre projet, notre équipe est joignable à l'adresse <a href="mailto:contact@domtomconnect.com" style="color:#0f172a; text-decoration:underline;">contact@domtomconnect.com</a>.
              </p>

              <p style="margin:24px 0 0 0; font-size:0.95rem; color:#334155; font-weight:600;">
                Bien cordialement,<br>
                <span style="font-weight:400; color:#64748b;">La Direction Domtom Connect</span>
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color:#f1f5f9; padding: 24px 40px; text-align:center; color:#64748b; font-size:0.8rem; border-top:1px solid #e2e8f0; line-height:1.5;">
              <p style="margin:0 0 6px 0;">
                Vous recevez cette communication en tant que membre inscrit sur Domtom Connect.
              </p>
              <p style="margin:0;">
                Pour gérer vos préférences, écrivez à <a href="mailto:contact@domtomconnect.com?subject=Desabonnement" style="color:#64748b; text-decoration:underline;">contact@domtomconnect.com</a>.<br>
                &copy; 2026 Domtom Connect. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>$html$, '{{FIRST_NAME}}', first_name);

        -- Ajout au batch Resend
        batch_array := batch_array || jsonb_build_object(
            'from', 'Domtom Connect <' || sender_email || '>',
            'to', jsonb_build_array(rec.email),
            'subject', email_subject,
            'html', email_body
        );

        user_count := user_count + 1;

        -- Envoi par paquet de 90 (limite Resend 100)
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

    -- Envoi du dernier batch
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

    RAISE NOTICE '% emails envoyés avec succès via Resend.', user_count;
END;
$$;
