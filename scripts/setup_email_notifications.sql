-- ============================================================
-- setup_email_notifications.sql – Domtom Connect
-- Notifications Email Automatiques via Brevo (Transactionnel)
-- ============================================================
-- INSTRUCTIONS :
-- 1. Remplace 'COLLER_TA_CLE_API_BREVO_ICI' par ta vraie clé API Brevo
--    (elle commence par xkeysib-...)
-- 2. Remplace 'contact@domtomconnect.com' par ton adresse email Expéditeur
--    (celle que tu as validée dans Brevo > Expéditeurs)
-- 3. Exécute ce script dans l'éditeur SQL de Supabase
-- ============================================================

-- ETAPE 1 : Activer l'extension pg_net pour les requêtes HTTP
-- (Elle est déjà activée par défaut sur Supabase)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================
-- ETAPE 2 : La Fonction Principale d'Envoi Email via Brevo
-- ============================================================
CREATE OR REPLACE FUNCTION public.send_brevo_email(
    recipient_email TEXT,
    recipient_name  TEXT,
    subject         TEXT,
    html_content    TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    brevo_api_key TEXT := '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';
    sender_email  TEXT := 'contact@domtomconnect.com';
    sender_name   TEXT := 'Domtom Connect';
    request_body  JSONB;
BEGIN
    -- Construction du corps de la requête JSON pour Brevo
    request_body := jsonb_build_object(
        'sender', jsonb_build_object(
            'name',  sender_name,
            'email', sender_email
        ),
        'to', jsonb_build_array(
            jsonb_build_object(
                'email', recipient_email,
                'name',  recipient_name
            )
        ),
        'subject',     subject,
        'htmlContent', html_content
    );

    -- Envoi asynchrone via pg_net (non-bloquant)
    -- Note: net.http_post sur Supabase attend body en JSONB
    PERFORM net.http_post(
        url     := 'https://api.brevo.com/v3/smtp/email',
        body    := request_body,
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'api-key',       brevo_api_key
        )
    );
END;
$$;

-- ============================================================
-- ETAPE 3 : Fonction Trigger – Notification de Commentaire
-- S'exécute automatiquement quand quelqu'un commente un post
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_on_new_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    post_owner_id   UUID;
    post_owner_name TEXT;
    post_owner_email TEXT;
    commenter_name  TEXT;
    post_title      TEXT;
    post_url        TEXT;
    email_subject   TEXT;
    email_body      TEXT;
BEGIN
    -- 1. Récupérer le propriétaire du post (auteur de showcase_items)
    SELECT si.owner_id, p.full_name, au.email
    INTO   post_owner_id, post_owner_name, post_owner_email
    FROM   public.showcase_items si
    JOIN   public.profiles p ON p.id = si.owner_id
    JOIN   auth.users au     ON au.id = si.owner_id
    WHERE  si.id = NEW.post_id;

    -- 2. Récupérer le nom du commentateur
    SELECT full_name
    INTO   commenter_name
    FROM   public.profiles
    WHERE  id = NEW.user_id;

    -- 3. Ne pas envoyer un email si la personne commente son propre post
    IF post_owner_id = NEW.user_id THEN
        RETURN NEW;
    END IF;

    -- 4. Récupérer le titre du post (ou un titre générique)
    SELECT COALESCE(title, 'votre publication')
    INTO   post_title
    FROM   public.showcase_items
    WHERE  id = NEW.post_id;

    -- 5. Construire le lien direct vers le post
    post_url := 'https://domtomconnect.com/mon-espace.html#moments';

    -- 6. Construire l'email (professionnel, sans émoji)
    email_subject := 'Nouveau commentaire sur votre publication – Domtom Connect';

    email_body := '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau commentaire</title>
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
              <h1 style="margin: 12px 0 0 0; color:#ffffff; font-size:1.75rem; font-weight:800; letter-spacing:-0.03em;">Nouveau commentaire</h1>
            </td>
          </tr>

          <!-- Corps principal -->
          <tr>
            <td style="background-color:#ffffff; padding: 40px; border-left:1px solid #e2e8f0; border-right:1px solid #e2e8f0;">
              <p style="margin:0 0 24px 0; font-size:1rem; color:#334155; line-height:1.6;">
                Bonjour ' || COALESCE(post_owner_name, 'Membre du réseau') || ',
              </p>
              <p style="margin:0 0 24px 0; font-size:1rem; color:#334155; line-height:1.6;">
                <strong>' || COALESCE(commenter_name, 'Un membre du réseau') || '</strong> a réagi à votre publication <em>"' || post_title || '"</em>.
              </p>
              <p style="margin:0 0 32px 0; font-size:1rem; color:#334155; line-height:1.6;">
                Connectez-vous à votre espace pour lire le commentaire, y répondre et maintenir l''échange actif au sein de la communauté.
              </p>
              
              <!-- Bouton CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="' || post_url || '" target="_blank"
                       style="display:inline-block; background-color:#10b981; color:#ffffff; text-decoration:none;
                              font-size:0.95rem; font-weight:700; padding:16px 32px; border-radius:12px;">
                      Voir le commentaire
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color:#f8fafc; border-radius:0 0 16px 16px; border:1px solid #e2e8f0; border-top:none; padding: 24px 40px; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:0.8rem; color:#94a3b8;">
                Vous recevez cet email car vous êtes membre de Domtom Connect.
              </p>
              <p style="margin:0; font-size:0.8rem; color:#94a3b8;">
                Pour gérer vos préférences de notification, rendez-vous dans 
                <a href="https://domtomconnect.com/mon-espace.html#parametres" style="color:#64748b;">vos paramètres</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

    -- 7. Envoi de l'email
    PERFORM public.send_brevo_email(
        post_owner_email,
        COALESCE(post_owner_name, 'Membre du réseau'),
        email_subject,
        email_body
    );

    RETURN NEW;
END;
$$;

-- ============================================================
-- ETAPE 4 : Attacher le Trigger à la table feed_comments
-- ============================================================
DROP TRIGGER IF EXISTS trigger_notify_on_new_comment ON public.feed_comments;

CREATE TRIGGER trigger_notify_on_new_comment
    AFTER INSERT ON public.feed_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_new_comment();


-- ============================================================
-- ETAPE 5 (BONUS) : Trigger – Notification de Nouveau Follower
-- S'exécute quand quelqu'un s'abonne à une Chaîne
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_on_new_follower()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    channel_owner_name  TEXT;
    channel_owner_email TEXT;
    follower_name       TEXT;
    email_subject       TEXT;
    email_body          TEXT;
BEGIN
    -- Récupérer les infos du propriétaire de la chaîne (celui qui est suivi)
    SELECT p.full_name, au.email
    INTO   channel_owner_name, channel_owner_email
    FROM   public.profiles p
    JOIN   auth.users au ON au.id = p.id
    WHERE  p.id = NEW.following_id;

    -- Récupérer le nom du nouveau follower
    SELECT full_name
    INTO   follower_name
    FROM   public.profiles
    WHERE  id = NEW.follower_id;

    email_subject := 'Nouveau membre dans votre réseau – Domtom Connect';

    email_body := '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
          <tr>
            <td style="background-color:#0f172a; border-radius:16px 16px 0 0; padding: 32px 40px; text-align:center;">
              <p style="margin:0; color:#10b981; font-size:0.75rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase;">Domtom Connect</p>
              <h1 style="margin: 12px 0 0 0; color:#ffffff; font-size:1.75rem; font-weight:800; letter-spacing:-0.03em;">Nouveau membre dans votre réseau</h1>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff; padding: 40px; border-left:1px solid #e2e8f0; border-right:1px solid #e2e8f0;">
              <p style="margin:0 0 24px 0; font-size:1rem; color:#334155; line-height:1.6;">
                Bonjour ' || COALESCE(channel_owner_name, 'Membre du réseau') || ',
              </p>
              <p style="margin:0 0 24px 0; font-size:1rem; color:#334155; line-height:1.6;">
                <strong>' || COALESCE(follower_name, 'Un membre du réseau') || '</strong> vient de s''abonner à votre Chaîne. Votre audience sur Domtom Connect continue de croître.
              </p>
              <p style="margin:0 0 32px 0; font-size:1rem; color:#334155; line-height:1.6;">
                C''est l''occasion de publier du contenu exclusif pour votre communauté et de renforcer votre positionnement d''expert au sein de l''écosystème ultramarin.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="https://domtomconnect.com/mon-espace.html#channel" target="_blank"
                       style="display:inline-block; background-color:#0f172a; color:#ffffff; text-decoration:none;
                              font-size:0.95rem; font-weight:700; padding:16px 32px; border-radius:12px;">
                      Voir ma Chaîne
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc; border-radius:0 0 16px 16px; border:1px solid #e2e8f0; border-top:none; padding: 24px 40px; text-align:center;">
              <p style="margin:0; font-size:0.8rem; color:#94a3b8;">
                Vous recevez cet email car vous êtes membre de Domtom Connect.
                <a href="https://domtomconnect.com/mon-espace.html#parametres" style="color:#64748b;">Gérer mes notifications</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

    PERFORM public.send_brevo_email(
        channel_owner_email,
        COALESCE(channel_owner_name, 'Membre du réseau'),
        email_subject,
        email_body
    );

    RETURN NEW;
END;
$$;

-- Attacher le trigger à la table user_subscriptions
DROP TRIGGER IF EXISTS trigger_notify_on_new_follower ON public.user_subscriptions;

CREATE TRIGGER trigger_notify_on_new_follower
    AFTER INSERT ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_new_follower();


-- ============================================================
-- VERIFICATION : Tester l'envoi manuel d'un email
-- (Décommente les lignes ci-dessous et remplace les valeurs)
-- ============================================================
-- SELECT public.send_brevo_email(
--     'ton.adresse@gmail.com',
--     'Ton Prénom',
--     'Test Email – Domtom Connect',
--     '<h1>Cela fonctionne</h1><p>Le système d''emails automatiques est opérationnel.</p>'
-- );
