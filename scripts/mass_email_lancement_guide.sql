-- ============================================================
-- mass_email_lancement_guide.sql – Domtom Connect
-- Envoi de l'Email de Lancement Officiel du Guide Tome 1 à toute la base
-- ============================================================
-- MODE D'EMPLOI :
-- 1. Vérifier votre quota Brevo (300 emails/jour sur plan gratuit, ou illimité sur plan payant)
-- 2. Exécuter ce script directement dans le SQL Editor de Supabase
-- 3. Ce script parcourt tous les membres confirmés et leur envoie l'email de lancement
-- ============================================================

DO $$
DECLARE
    rec             RECORD;
    user_count      INT := 0;
    email_subject   TEXT;
    email_body      TEXT;
    first_name      TEXT;
BEGIN
    -- Sujet percutant et engageant
    email_subject := 'Nouveau : Les Fondamentaux de l''Entrepreneur (Tome 1) est disponible';

    -- Boucle sur tous les utilisateurs actifs avec email confirmé
    FOR rec IN
        SELECT
            au.email,
            COALESCE(p.full_name, 'Entrepreneur') AS full_name
        FROM auth.users au
        LEFT JOIN public.profiles p ON p.id = au.id
        WHERE au.email IS NOT NULL
          AND au.email_confirmed_at IS NOT NULL
          AND au.deleted_at IS NULL
        ORDER BY au.created_at ASC
    LOOP
        -- Extraction du prénom pour personnalisation
        first_name := split_part(rec.full_name, ' ', 1);
        IF first_name = '' OR first_name IS NULL THEN
            first_name := 'Cher entrepreneur';
        END IF;

        -- Corps de l'email responsive aux couleurs officielles Domtom Connect
        email_body := '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lancement Guide de l''Entrepreneur — Tome 1</title>
</head>
<body style="margin:0; padding:0; background-color:#020617; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, Helvetica, Arial, sans-serif; color:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#020617; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#0b1329; border:1px solid rgba(16, 185, 129, 0.3); border-radius:20px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.5);">

          <!-- En-tête -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b1329 0%, #020617 100%); padding: 36px 30px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.08);">
              <span style="background: rgba(16, 185, 129, 0.15); color:#10b981; border:1px solid rgba(16, 185, 129, 0.4); padding:6px 16px; border-radius:100px; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; display:inline-block; margin-bottom:14px;">
                Nouveauté Officielle · Domtom Connect
              </span>
              <h1 style="margin:0; color:#ffffff; font-size:1.65rem; font-weight:900; line-height:1.25; letter-spacing:-0.02em;">
                Les Fondamentaux de l''Entrepreneur <br>
                <span style="color:#10b981;">Tome 1 · Édition 2026</span>
              </h1>
            </td>
          </tr>

          <!-- Visuel Mockup du Livre -->
          <tr>
            <td align="center" style="padding: 28px 20px 10px; background-color:#0b1329;">
              <a href="https://domtomconnect.com/guide-entrepreneur.html" target="_blank" style="text-decoration:none;">
                <img src="https://domtomconnect.com/assets/images/bundle-mockup-tome1.jpg" alt="Guide de l''Entrepreneur Domtom Connect" width="460" style="max-width:100%; height:auto; border-radius:14px; border:1px solid rgba(16,185,129,0.3); box-shadow:0 10px 30px rgba(0,0,0,0.6); display:block;">
              </a>
            </td>
          </tr>

          <!-- Corps du Message -->
          <tr>
            <td style="padding: 24px 34px; font-size:1rem; line-height:1.7; color:#cbd5e1;">
              <p style="margin-top:0; font-size:1.1rem; color:#ffffff;">
                Bonjour <strong>' || first_name || '</strong>,
              </p>

              <p>
                On a tous vu passer des cours en ligne de 40 heures conçus pour des marchés saturés, où l''on te conseille de lever des millions avant même d''avoir validé ta première vente.
              </p>

              <p>
                Sur nos territoires — <strong>aux Antilles, en Guyane, à La Réunion, en Afrique ou au sein de la diaspora</strong> — la réalité est différente. Il y a le fret, l''octroi de mer, la proximité du réseau local et la nécessité absolue d''être rentable tout de suite.
              </p>

              <p>
                C''est pour cette raison exacte que nous avons conçu <strong>Les Fondamentaux de l''Entrepreneur — Tome 1</strong> : la toute première consultation numérique en 27 étapes d''action sur le terrain.
              </p>

              <!-- Points Clés -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px 20px;">
                <tr>
                  <td style="color:#cbd5e1; font-size:0.95rem; line-height:1.6;">
                    <div style="margin-bottom:10px;"><strong style="color:#10b981;">✓ 27 Chapitres Pratiques :</strong> 80% d''action, 20% de réflexion pour construire ton offre et la tester.</div>
                    <div style="margin-bottom:10px;"><strong style="color:#10b981;">✓ Carnet de Bord Interactif :</strong> Tes réponses sont sauvegardées en temps réel dans ton navigateur.</div>
                    <div style="margin-bottom:10px;"><strong style="color:#10b981;">✓ Simulateur Financier :</strong> Calcule ton point mort, tes marges et ton rythme de vente au centime près.</div>
                    <div><strong style="color:#10b981;">✓ Export PDF Personnalisé :</strong> Repars avec ton plan d''action 30 jours complet et structuré.</div>
                  </td>
                </tr>
              </table>

              <!-- Tarif de lancement -->
              <p style="text-align:center; margin: 26px 0 16px;">
                <span style="font-size:0.85rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em; display:block;">Tarif Spécial Lancement</span>
                <span style="font-size:2rem; font-weight:900; color:#ffffff;">27 €</span>
                <span style="font-size:1.1rem; color:#64748b; text-decoration:line-through; margin-left:8px;">47 €</span>
              </p>

              <!-- Bouton CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 20px;">
                    <a href="https://domtomconnect.com/guide-entrepreneur.html" target="_blank" style="background:#10b981; color:#020617; font-weight:900; font-size:1.05rem; padding:16px 36px; border-radius:12px; text-decoration:none; display:inline-block; box-shadow:0 8px 24px rgba(16,185,129,0.35);">
                      Découvrir le Guide & Débloquer mon Accès &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:0.85rem; color:#94a3b8; text-align:center; margin-bottom:0;">
                Accès immédiat à vie · Mises à jour incluses · Compatible smartphone, tablette et PC
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color:#020617; border-top:1px solid rgba(255,255,255,0.06); padding: 24px 30px; text-align:center;">
              <p style="margin:0 0 6px 0; font-size:0.8rem; color:#64748b;">
                Domtom Connect — L''écosystème entrepreneurial des Caraïbes, de l''Afrique et de la diaspora.
              </p>
              <p style="margin:0; font-size:0.75rem; color:#475569;">
                Pour modifier vos préférences ou nous poser une question : <a href="mailto:contact@domtomconnect.com" style="color:#10b981; text-decoration:none;">contact@domtomconnect.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

        -- Envoi via la fonction Brevo Supabase existante
        PERFORM public.send_brevo_email(
            rec.email,
            rec.full_name,
            email_subject,
            email_body
        );

        user_count := user_count + 1;

        -- Pause de respiration toutes les 10 emails pour respecter le rate-limit
        IF user_count % 10 = 0 THEN
            PERFORM pg_sleep(0.5);
        END IF;

    END LOOP;

    RAISE NOTICE 'Campagne de lancement envoyée avec succès à % entrepreneurs.', user_count;
END;
$$;
