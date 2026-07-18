-- ============================================================
-- mass_email_newsletter.sql – Domtom Connect
-- Envoi de la Newsletter (Récapitulatif) via Resend BATCH API
-- ============================================================
-- COMMENT L'UTILISER :
-- Modifiez uniquement les variables dans la section "EDITION DE LA NEWSLETTER" ci-dessous.
-- Ne modifiez pas le code HTML plus bas.
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

    -- ============================================================
    -- ✏️ EDITION DE LA NEWSLETTER (Modifiez les textes ici)
    -- ============================================================
    
    -- Le sujet de l'email
    sujet_email     TEXT := 'Actualités Domtom Connect : Programme Tremplin, Incubation et Application Mobile';
    
    -- L'introduction
    intro_texte     TEXT := 'L''écosystème Domtom Connect se structure pour mieux vous accompagner. Voici les dernières avancées majeures de notre réseau à destination des professionnels et entrepreneurs ultramarins.';

    -- ACTUALITÉ PRINCIPALE (Article, post ou événement)
    actu_titre      TEXT := 'Lancement du Programme Tremplin & Incubation';
    actu_desc       TEXT := 'Nous avons l''ambition d''incuber et d''accompagner les startups ainsi que les entreprises issues des Antilles, de la Guyane et de la diaspora. Le Programme Tremplin est conçu pour propulser vos projets de développement.';
    actu_lien       TEXT := 'https://domtomconnect.com/tremplin.html';
    actu_bouton     TEXT := 'Découvrir le programme';

    -- OPPORTUNITÉ N°1 (Emploi, mission ou annonce)
    opp1_titre      TEXT := 'Application Mobile Android : DTC Pulse';
    opp1_lieu       TEXT := 'Disponible au téléchargement libre';
    opp1_lien       TEXT := 'https://domtomconnect.com/application.html';

    -- OPPORTUNITÉ N°2 (Emploi, mission ou annonce)
    opp2_titre      TEXT := 'Appel à candidatures - Entrepreneurs';
    opp2_lieu       TEXT := 'Rejoignez notre réseau d''incubation';
    opp2_lien       TEXT := 'https://domtomconnect.com/';

    -- ============================================================
    -- FIN DE L'EDITION (Ne plus rien modifier à partir d'ici)
    -- ============================================================

BEGIN
    email_subject := sujet_email;

    FOR rec IN
        SELECT au.email, COALESCE(p.full_name, 'Membre') AS full_name
        FROM auth.users au
        LEFT JOIN public.profiles p ON p.id = au.id
        WHERE au.email IS NOT NULL
          AND au.email_confirmed_at IS NOT NULL
          AND au.deleted_at IS NULL
        ORDER BY au.created_at ASC
    LOOP
        first_name := split_part(rec.full_name, ' ', 1);
        IF first_name = '' THEN first_name := 'Membre'; END IF;

        email_body := '
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border:1px solid #e2e8f0; border-radius:8px;">
        
        <!-- HEADER -->
        <tr>
          <td style="padding: 30px 40px; border-bottom:1px solid #e2e8f0; text-align:center; background-color:#0f172a; border-radius:8px 8px 0 0;">
            <p style="margin:0; color:#10b981; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em;">La Sélection</p>
            <h1 style="margin:10px 0 0 0; color:#ffffff; font-size:1.5rem; font-weight:bold;">Domtom Connect</h1>
          </td>
        </tr>
        
        <!-- INTRODUCTION -->
        <tr>
          <td style="padding: 40px 40px 20px 40px;">
            <p style="margin:0 0 15px 0; font-size:1rem; color:#334155;">Bonjour ' || first_name || ',</p>
            <p style="margin:0; font-size:1rem; color:#334155; line-height:1.6;">' || intro_texte || '</p>
          </td>
        </tr>

        <!-- ACTUALITÉ PRINCIPALE -->
        <tr>
          <td style="padding: 20px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; border-radius:6px; padding:25px;">
              <tr>
                <td>
                  <p style="margin:0 0 5px 0; color:#64748b; font-size:0.75rem; font-weight:bold; text-transform:uppercase;">À LA UNE</p>
                  <h2 style="margin:0 0 10px 0; color:#0f172a; font-size:1.15rem;">' || actu_titre || '</h2>
                  <p style="margin:0 0 20px 0; color:#475569; font-size:0.95rem; line-height:1.5;">' || actu_desc || '</p>
                  <a href="' || actu_lien || '" style="display:inline-block; background-color:#1e293b; color:#ffffff; text-decoration:none; font-size:0.9rem; padding:10px 20px; border-radius:4px; font-weight:bold;">
                    ' || actu_bouton || '
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- OPPORTUNITÉS -->
        <tr>
          <td style="padding: 20px 40px 40px 40px;">
            <p style="margin:0 0 15px 0; color:#0f172a; font-size:1.1rem; font-weight:bold; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">Opportunités Récentes</p>
            
            <!-- OPP 1 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:15px;">
              <tr>
                <td style="padding-bottom:10px; border-bottom:1px solid #f1f5f9;">
                  <h3 style="margin:0 0 5px 0; font-size:1rem; color:#10b981;">' || opp1_titre || '</h3>
                  <p style="margin:0 0 5px 0; font-size:0.85rem; color:#64748b;">' || opp1_lieu || '</p>
                  <a href="' || opp1_lien || '" style="font-size:0.85rem; color:#1e293b; font-weight:bold; text-decoration:underline;">Voir les détails →</a>
                </td>
              </tr>
            </table>

            <!-- OPP 2 -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-top:5px;">
                  <h3 style="margin:0 0 5px 0; font-size:1rem; color:#10b981;">' || opp2_titre || '</h3>
                  <p style="margin:0 0 5px 0; font-size:0.85rem; color:#64748b;">' || opp2_lieu || '</p>
                  <a href="' || opp2_lien || '" style="font-size:0.85rem; color:#1e293b; font-weight:bold; text-decoration:underline;">Voir les détails →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- FOOTER -->
        <tr>
          <td style="padding: 30px 40px; text-align:center; border-top:1px solid #e2e8f0; background-color:#f8fafc; border-radius:0 0 8px 8px;">
            <p style="margin:0; font-size:0.8rem; color:#94a3b8;">La Direction Domtom Connect</p>
            <p style="margin:5px 0 0 0; font-size:0.75rem; color:#94a3b8;">Vous recevez cet email car vous êtes inscrit sur notre réseau professionnel.</p>
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

        user_count := user_count + 1;

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

    RAISE NOTICE '% emails ajoutés au batch de la Newsletter.', user_count;
END;
$$;
