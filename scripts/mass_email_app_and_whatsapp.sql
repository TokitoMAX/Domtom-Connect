-- ============================================================
-- mass_email_app_and_whatsapp.sql – Domtom Connect
-- Envoi d'un email professionnel à tous les utilisateurs
-- Sujet : Présentation de l'application et accès au groupe WhatsApp
-- IMPORTANT : Strictement professionnel, aucun émoji.
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
    email_subject := 'Domtom Connect : Déploiement de la plateforme et accès au groupe WhatsApp';

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
  <title>Domtom Connect</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#334155;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border-radius: 12px; overflow: hidden; background-color:#ffffff; border: 1px solid #e2e8f0;">
          
          <!-- En-tête -->
          <tr>
            <td style="background-color:#0f172a; padding: 36px 40px; text-align:left;">
              <p style="margin:0; color:#10b981; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em;">Domtom Connect</p>
              <h1 style="margin: 10px 0 0 0; color:#ffffff; font-size:1.45rem; font-weight:700; line-height:1.35;">
                Déploiement de l'écosystème et intégration du réseau WhatsApp
              </h1>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 40px; font-size:0.95rem; line-height:1.65; color:#334155;">
              <p style="margin:0 0 20px 0;">Bonjour {{FIRST_NAME}},</p>

              <p style="margin:0 0 20px 0;">
                Nous nous adressons à vous aujourd'hui pour vous présenter les récentes évolutions de l'écosystème <strong>Domtom Connect</strong> et vous donner accès aux canaux opérationnels de notre communauté d'affaires.
              </p>

              <!-- Section 1: L'Application -->
              <div style="background-color:#f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; padding: 22px; border-radius: 6px; margin: 24px 0;">
                <h2 style="margin:0 0 10px 0; font-size:1.05rem; color:#0f172a; font-weight:700;">1. L'Application et Plateforme Domtom Connect</h2>
                <p style="margin:0 0 12px 0; font-size:0.9rem; color:#475569; line-height:1.6;">
                  L'infrastructure Domtom Connect centralise l'ensemble des outils nécessaires au développement de vos projets dans les territoires ultramarins et au sein de la diaspora :
                </p>
                <ul style="margin:0; padding-left:20px; font-size:0.9rem; color:#334155; line-height:1.6;">
                  <li style="margin-bottom:6px;"><strong>Espace Réseau & Moments :</strong> Publication d'actualités, d'opportunités professionnelles et d'appels à projets.</li>
                  <li style="margin-bottom:6px;"><strong>Vitrines & Chaînes Dédiées :</strong> Valorisation de vos expertises, services et réalisations auprès d'une audience qualifiée.</li>
                  <li style="margin-bottom:6px;"><strong>Application Mobile Android (DTC Pulse) :</strong> Accès direct et notifications en temps réel depuis votre smartphone.</li>
                </ul>
              </div>

              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://domtomconnect.com/mon-espace.html" target="_blank"
                       style="display:inline-block; background-color:#0f172a; color:#ffffff; text-decoration:none; font-size:0.95rem; font-weight:600; padding:14px 32px; border-radius:8px;">
                      Accéder à la Plateforme et à l'Application
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Section 2: Le Groupe WhatsApp -->
              <div style="background-color:#f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0f172a; padding: 22px; border-radius: 6px; margin: 24px 0;">
                <h2 style="margin:0 0 10px 0; font-size:1.05rem; color:#0f172a; font-weight:700;">2. Le Groupe WhatsApp Officiel</h2>
                <p style="margin:0 0 12px 0; font-size:0.9rem; color:#475569; line-height:1.6;">
                  Afin de faciliter les interactions quotidiennes et accélérer la mise en relation entre porteurs de projets, prestataires et entrepreneurs, un groupe WhatsApp officiel est à votre disposition.
                </p>
                <p style="margin:0; font-size:0.9rem; color:#475569; line-height:1.6;">
                  Ce canal privé vous permet d'échanger directement avec les autres membres, de partager des besoins urgents et de suivre les annonces clés du réseau.
                </p>
              </div>

              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <a href="https://domtomconnect.com/rejoindre.html" target="_blank"
                       style="display:inline-block; background-color:#10b981; color:#ffffff; text-decoration:none; font-size:0.95rem; font-weight:600; padding:14px 32px; border-radius:8px;">
                      Rejoindre le Groupe WhatsApp Officiel
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px 0; font-size:0.9rem; color:#64748b; line-height:1.6;">
                Notre équipe demeure à votre disposition pour toute question ou accompagnement technique à l'adresse <a href="mailto:contact@domtomconnect.com" style="color:#0f172a; text-decoration:underline;">contact@domtomconnect.com</a>.
              </p>

              <p style="margin:24px 0 0 0; font-size:0.95rem; color:#334155; font-weight:600;">
                Cordialement,<br>
                <span style="font-weight:400; color:#64748b;">La Direction Domtom Connect</span>
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color:#f1f5f9; padding: 24px 40px; text-align:center; color:#64748b; font-size:0.8rem; border-top:1px solid #e2e8f0; line-height:1.5;">
              <p style="margin:0 0 6px 0;">
                Vous recevez cette notification en tant qu'utilisateur inscrit sur Domtom Connect.
              </p>
              <p style="margin:0;">
                Pour modifier vos préférences de communication, écrivez à <a href="mailto:contact@domtomconnect.com?subject=Desabonnement" style="color:#64748b; text-decoration:underline;">contact@domtomconnect.com</a>.<br>
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
