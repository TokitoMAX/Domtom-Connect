-- ============================================================
-- mass_email_lancement_guide.sql – Domtom Connect
-- Envoi de l'Email de Lancement Officiel du Guide Tome 1 à toute la base
-- Provider : Resend Batch API (re_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7)
-- Sender   : Domtom Connect <contact@domtomconnect.com>
-- Format   : Standard HTML classique 600px, 100% compatible tous clients mail
-- Règle    : STRICTEMENT AUCUN ÉMOJI (sujet et corps)
-- ============================================================
-- MODE D'EMPLOI :
-- 1. Exécuter ce script directement dans le SQL Editor de Supabase
-- 2. Le script regroupe les envois par paquets de 90 via l'API Batch Resend
-- 3. Aucun compte Brevo requis (Resend est le provider officiel actif de Domtom Connect)
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
    resend_key      TEXT := 're_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7';
BEGIN
    -- Sujet standard et professionnel (aucun émoji)
    email_subject := 'Nouveau sur Domtom Connect : Guide de l''Entrepreneur (Tome 1)';

    -- Boucle sur tous les utilisateurs actifs avec email confirmé
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
        -- Extraction du prénom pour personnalisation
        first_name := split_part(rec.full_name, ' ', 1);
        IF first_name IS NULL OR first_name = '' THEN
            first_name := 'Membre du réseau';
        END IF;

        -- Format email HTML classique 600px, fond clair, styles inline, 100% compatible
        email_body := REPLACE($html$<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guide de l'Entrepreneur - Tome 1</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased; color:#334155;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 15px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; box-shadow:0 4px 20px rgba(0,0,0,0.06); border-radius:12px; overflow:hidden; background-color:#ffffff; border:1px solid #e2e8f0;">

          <!-- En-tête sobre -->
          <tr>
            <td style="background-color:#0f172a; padding:32px 40px; text-align:center;">
              <p style="margin:0; color:#10b981; font-size:0.75rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase;">
                Domtom Connect - La Boutique
              </p>
              <h1 style="margin:12px 0 0 0; color:#ffffff; font-size:1.75rem; font-weight:800; letter-spacing:-0.03em; line-height:1.3;">
                Les Fondamentaux de l'Entrepreneur<br>
                <span style="color:#10b981;">Tome 1 - Edition 2026</span>
              </h1>
            </td>
          </tr>

          <!-- Corps principal blanc -->
          <tr>
            <td style="padding:40px; font-size:0.95rem; line-height:1.65; color:#334155;">

              <p style="margin:0 0 20px 0; font-size:1.05rem;">
                Bonjour {{FIRST_NAME}},
              </p>

              <p style="margin:0 0 18px 0; font-size:0.95rem; line-height:1.65;">
                Lancer une activite rentable aux Antilles, en Guyane, a La Reunion, en Afrique ou au sein de la diaspora exige une approche adaptee. Les realites du terrain (fret, octroi de mer, taille de marche, circuits courts) ne s'improvisent pas avec des cours purement theoriques.
              </p>

              <p style="margin:0 0 22px 0; font-size:0.95rem; line-height:1.65;">
                C'est pourquoi nous venons de publier officiellement <strong>Les Fondamentaux de l'Entrepreneur (Tome 1)</strong>. Concu comme une consultation numerique pas-a-pas, ce guide interactif vous permet de batir, tester et rentabiliser votre offre sur le terrain.
              </p>

              <!-- Apercu Visuel -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px;">
                <tr>
                  <td align="center">
                    <a href="https://domtomconnect.com/guide-entrepreneur.html" target="_blank" style="text-decoration:none; display:block;">
                      <img src="https://domtomconnect.com/assets/images/bundle-mockup-tome1.jpg" alt="Guide Tome 1 Domtom Connect" width="520" style="max-width:100%; height:auto; border-radius:10px; border:1px solid #e2e8f0; display:block;">
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px 0; font-size:1rem; font-weight:700; color:#0f172a;">
                Ce que contient cette premiere edition :
              </p>

              <!-- Liste des fonctionnalites avec puces table standard (sans emoji) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid #f1f5f9; vertical-align:top;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px; vertical-align:top; padding-top:2px;">
                          <div style="width:8px; height:8px; background-color:#10b981; border-radius:50%; margin-top:6px;"></div>
                        </td>
                        <td>
                          <strong style="color:#0f172a; font-size:0.95rem;">27 chapitres d'action concrets</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">80% d'exercices pratiques et 20% de reflexion pour passer a l'action des aujourd'hui.</p>
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
                          <strong style="color:#0f172a; font-size:0.95rem;">Carnet de bord interactif integre</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">Toutes vos reponses et plans strategiques sont sauvegardes dans votre navigateur.</p>
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
                          <strong style="color:#0f172a; font-size:0.95rem;">Simulateur financier de rentabilite</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">Calcul automatique de votre point mort, volume de ventes et marge brute.</p>
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
                          <strong style="color:#0f172a; font-size:0.95rem;">Export PDF personnalise de votre feuille de route</strong>
                          <p style="margin:4px 0 0 0; color:#64748b; font-size:0.875rem; line-height:1.5;">Telechargez et imprimez votre plan d'action 30 jours directement finalise.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Encadre Tarif de Lancement -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:22px; margin-bottom:28px; text-align:center;">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 6px 0; font-size:0.75rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.1em;">
                      Offre Speciale de Lancement
                    </p>
                    <p style="margin:0; font-size:2rem; font-weight:800; color:#0f172a; line-height:1.2;">
                      27 EUR
                      <span style="font-size:1.1rem; color:#94a3b8; text-decoration:line-through; font-weight:400; margin-left:8px;">47 EUR</span>
                    </p>
                    <p style="margin:8px 0 0 0; font-size:0.85rem; color:#64748b;">
                      Acces immediat et illimite - Mises a jour a vie incluses
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Bouton CTA Principal (standard table button, compatible Outlook & Mobile) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color:#10b981; border-radius:10px;">
                          <a href="https://domtomconnect.com/guide-entrepreneur.html" target="_blank" style="display:inline-block; padding:16px 36px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:1rem; font-weight:700; color:#ffffff; text-decoration:none; border-radius:10px;">
                            Consulter la Boutique et Debloquer l'Acces
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0; font-size:0.85rem; color:#64748b; text-align:center; line-height:1.5;">
                Consultable instantanement sur smartphone, tablette et ordinateur.
              </p>

            </td>
          </tr>

          <!-- Pied de page classique -->
          <tr>
            <td style="background-color:#f1f5f9; padding:24px 40px; text-align:center; color:#64748b; font-size:0.8rem; border-top:1px solid #e2e8f0; line-height:1.5;">
              <p style="margin:0 0 6px 0;">
                Domtom Connect - La plateforme des entrepreneurs d'Outre-Mer et de la diaspora.
              </p>
              <p style="margin:0;">
                Pour toute question, repondez directement a cet email ou ecrivez a : <a href="mailto:contact@domtomconnect.com" style="color:#10b981; text-decoration:none;">contact@domtomconnect.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>$html$, '{{FIRST_NAME}}', first_name);

        -- Ajout de l'email au lot Resend (format Batch API)
        batch_array := batch_array || jsonb_build_object(
            'from', 'Domtom Connect <' || sender_email || '>',
            'to', jsonb_build_array(rec.email),
            'subject', email_subject,
            'html', email_body
        );

        user_count := user_count + 1;

        -- Envoi par paquet de 90 (limite maximale Resend : 100 emails par requête)
        IF jsonb_array_length(batch_array) >= 90 THEN
            PERFORM net.http_post(
                url := 'https://api.resend.com/emails/batch',
                body := batch_array,
                headers := jsonb_build_object(
                    'Authorization', 'Bearer ' || resend_key,
                    'Content-Type', 'application/json'
                )
            );
            batch_array := '[]'::jsonb;
            PERFORM pg_sleep(1);
        END IF;

    END LOOP;

    -- Envoi du reliquat (dernier paquet d'emails)
    IF jsonb_array_length(batch_array) > 0 THEN
        PERFORM net.http_post(
            url := 'https://api.resend.com/emails/batch',
            body := batch_array,
            headers := jsonb_build_object(
                'Authorization', 'Bearer ' || resend_key,
                'Content-Type', 'application/json'
            )
        );
    END IF;

    RAISE NOTICE 'Campagne Guide Tome 1 envoyee avec succes a % utilisateurs via Resend Batch.', user_count;
END;
$$;
