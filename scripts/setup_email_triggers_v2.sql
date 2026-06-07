-- ============================================================
-- setup_email_triggers_v2.sql – Domtom Connect
-- 6 Triggers d'Emails Automatiques pour la Rétention Utilisateur
-- ============================================================
-- Prérequis : La fonction public.send_brevo_email() doit déjà exister
-- (créée via setup_email_notifications.sql)
-- Exécuter ce script dans l'éditeur SQL de Supabase
-- ============================================================


-- ============================================================
-- TRIGGER 1 : EMAIL DE BIENVENUE (nouveau compte créé)
-- Table : auth.users (via la table profiles)
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_welcome_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email  TEXT;
    user_name   TEXT;
    first_name  TEXT;
BEGIN
    -- Récupérer l'email depuis auth.users
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
    user_name  := COALESCE(NEW.full_name, 'Membre du réseau');
    first_name := split_part(user_name, ' ', 1);
    IF first_name = '' THEN first_name := 'Membre du réseau'; END IF;

    PERFORM public.send_brevo_email(
        user_email,
        user_name,
        'Bienvenue sur Domtom Connect – Votre espace est prêt',
        '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="background:#0f172a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
    <p style="margin:0;color:#10b981;font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Domtom Connect</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;">Bienvenue dans le réseau.</h1>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Bonjour ' || first_name || ',</p>
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Votre compte Domtom Connect est actif. Vous rejoignez un réseau professionnel dédié aux entrepreneurs, experts et porteurs de projets des territoires ultramarins et de la diaspora.</p>
    <p style="margin:0 0 28px;font-size:1rem;color:#334155;line-height:1.7;">Pour démarrer, complétez votre profil et explorez les opportunités disponibles sur la plateforme.</p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="https://domtomconnect.com/mon-espace.html" target="_blank"
         style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;font-size:0.95rem;font-weight:700;padding:16px 32px;border-radius:12px;">
        Accéder à mon espace
      </a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:0.8rem;color:#94a3b8;">Vous recevez cet email suite à la création de votre compte sur Domtom Connect.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>'
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_welcome_email ON public.profiles;
CREATE TRIGGER trigger_welcome_email
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_welcome_email();


-- ============================================================
-- TRIGGER 2 : ÉPOPÉE APPROUVÉE (statut projet -> 'approved')
-- Table : public.projects
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_project_approved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    owner_email TEXT;
    owner_name  TEXT;
    first_name  TEXT;
    project_title TEXT;
BEGIN
    -- Déclencher uniquement si le statut passe à 'approved'
    IF OLD.status = NEW.status OR NEW.status != 'approved' THEN
        RETURN NEW;
    END IF;

    SELECT au.email, p.full_name
    INTO   owner_email, owner_name
    FROM   auth.users au
    JOIN   public.profiles p ON p.id = au.id
    WHERE  au.id = NEW.owner_id;

    first_name    := COALESCE(split_part(owner_name, ' ', 1), 'Porteur de projet');
    project_title := COALESCE(NEW.title, NEW.name, 'votre Épopée');

    PERFORM public.send_brevo_email(
        owner_email,
        COALESCE(owner_name, 'Porteur de projet'),
        'Votre Épopée a été approuvée – Domtom Connect',
        '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="background:#0f172a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
    <p style="margin:0;color:#10b981;font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Domtom Connect</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;">Votre dossier est validé.</h1>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Bonjour ' || first_name || ',</p>
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Après examen de votre dossier, votre Épopée <strong>"' || project_title || '"</strong> a été approuvée par notre équipe. Elle est désormais visible publiquement sur la plateforme et éligible au soutien participatif.</p>
    <p style="margin:0 0 28px;font-size:1rem;color:#334155;line-height:1.7;">Connectez-vous à votre espace de pilotage pour consulter votre tableau de bord et suivre l''avancement de votre levée de fonds.</p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="https://domtomconnect.com/mon-espace.html#success-engine" target="_blank"
         style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;font-size:0.95rem;font-weight:700;padding:16px 32px;border-radius:12px;">
        Accéder à mon tableau de bord
      </a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:0.8rem;color:#94a3b8;">Domtom Connect – L''écosystème entrepreneurial ultramarin.
    <a href="mailto:contact@domtomconnect.com?subject=Desabonnement" style="color:#64748b;">Se désabonner</a>.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>'
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_project_approved ON public.projects;
CREATE TRIGGER trigger_project_approved
    AFTER UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_project_approved();


-- ============================================================
-- TRIGGER 3 : CONTRIBUTION REÇUE (quelqu'un finance un projet)
-- Table : public.contributions
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_contribution_received()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    owner_email   TEXT;
    owner_name    TEXT;
    first_name    TEXT;
    project_title TEXT;
    amount_str    TEXT;
    donor_str     TEXT;
BEGIN
    -- Déclencher uniquement si le statut est 'completed'
    IF NEW.status != 'completed' THEN
        RETURN NEW;
    END IF;
    -- Ne pas re-notifier si le statut était déjà 'completed'
    IF TG_OP = 'UPDATE' AND OLD.status = 'completed' THEN
        RETURN NEW;
    END IF;

    SELECT au.email, p.full_name
    INTO   owner_email, owner_name
    FROM   public.projects pr
    JOIN   auth.users au  ON au.id = pr.owner_id
    JOIN   public.profiles p ON p.id = pr.owner_id
    WHERE  pr.id = NEW.project_id;

    first_name    := COALESCE(split_part(owner_name, ' ', 1), 'Porteur de projet');
    project_title := COALESCE((SELECT title FROM public.projects WHERE id = NEW.project_id), 'votre projet');
    amount_str    := to_char(NEW.amount, 'FM999 999 999') || ' ' || COALESCE(NEW.currency, 'EUR');
    donor_str     := COALESCE(NEW.donor_name, 'Un membre de la communauté');

    PERFORM public.send_brevo_email(
        owner_email,
        COALESCE(owner_name, 'Porteur de projet'),
        'Nouveau soutien reçu pour votre Épopée – Domtom Connect',
        '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="background:#0f172a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
    <p style="margin:0;color:#10b981;font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Domtom Connect</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;">Soutien reçu.</h1>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Bonjour ' || first_name || ',</p>
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;"><strong>' || donor_str || '</strong> vient de soutenir votre Épopée <strong>"' || project_title || '"</strong> à hauteur de <strong>' || amount_str || '</strong>.</p>
    <p style="margin:0 0 28px;font-size:1rem;color:#334155;line-height:1.7;">Ce montant sera disponible dans votre espace financier après validation. Consultez votre tableau de bord pour suivre l''ensemble de votre levée de fonds.</p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="https://domtomconnect.com/mon-espace.html#success-engine" target="_blank"
         style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;font-size:0.95rem;font-weight:700;padding:16px 32px;border-radius:12px;">
        Voir mon tableau de bord
      </a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:0.8rem;color:#94a3b8;">Domtom Connect – L''écosystème entrepreneurial ultramarin.
    <a href="mailto:contact@domtomconnect.com?subject=Desabonnement" style="color:#64748b;">Se désabonner</a>.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>'
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_contribution_received ON public.contributions;
CREATE TRIGGER trigger_contribution_received
    AFTER INSERT OR UPDATE ON public.contributions
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_contribution_received();


-- ============================================================
-- TRIGGER 4 : NOUVEAU MESSAGE MASTERMIND
-- Table : public.messages (conversation_id fixe)
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_mastermind_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    mastermind_conv_id UUID := '11111111-1111-1111-1111-111111111111';
    sender_name       TEXT;
    rec               RECORD;
BEGIN
    -- Uniquement pour le salon Mastermind
    IF NEW.conversation_id != mastermind_conv_id THEN
        RETURN NEW;
    END IF;

    SELECT full_name INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;

    -- Notifier tous les participants SAUF l'expéditeur
    FOR rec IN
        SELECT au.email, p.full_name,
               COALESCE(split_part(p.full_name, ' ', 1), 'Membre') AS first_name
        FROM   conversation_participants cp
        JOIN   auth.users au  ON au.id = cp.user_id
        JOIN   public.profiles p ON p.id = cp.user_id
        WHERE  cp.conversation_id = mastermind_conv_id
          AND  cp.user_id != NEW.sender_id
          AND  au.email IS NOT NULL
    LOOP
        PERFORM public.send_brevo_email(
            rec.email,
            rec.full_name,
            'Nouveau message dans le Salon Mastermind – Domtom Connect',
            '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="background:#0f172a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
    <p style="margin:0;color:#fbbf24;font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Salon Mastermind DTC</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;">Nouveau message.</h1>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Bonjour ' || rec.first_name || ',</p>
    <p style="margin:0 0 28px;font-size:1rem;color:#334155;line-height:1.7;"><strong>' || COALESCE(sender_name, 'Un membre') || '</strong> vient de publier un message dans le Salon Mastermind privé. Connectez-vous pour lire le message et y répondre.</p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="https://domtomconnect.com/mon-espace.html#mastermind" target="_blank"
         style="display:inline-block;background:#fbbf24;color:#0f172a;text-decoration:none;font-size:0.95rem;font-weight:700;padding:16px 32px;border-radius:12px;">
        Rejoindre le salon
      </a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:0.8rem;color:#94a3b8;">Domtom Connect – Salon réservé aux membres du Club.
    <a href="mailto:contact@domtomconnect.com?subject=Desabonnement" style="color:#64748b;">Se désabonner</a>.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>'
        );
    END LOOP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_mastermind_message ON public.messages;
CREATE TRIGGER trigger_mastermind_message
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_mastermind_message();


-- ============================================================
-- TRIGGER 5 : NOUVELLE OFFRE D'EMPLOI (notifier les experts)
-- Table : public.job_offers
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_new_job_offer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rec          RECORD;
    budget_str   TEXT;
BEGIN
    -- Uniquement quand le statut est 'open' (offre publiée)
    IF NEW.status != 'open' THEN
        RETURN NEW;
    END IF;
    -- Éviter une double notification si l'offre était déjà ouverte
    IF TG_OP = 'UPDATE' AND OLD.status = 'open' THEN
        RETURN NEW;
    END IF;

    budget_str := CASE
        WHEN NEW.budget IS NOT NULL THEN to_char(NEW.budget, 'FM999 999 999') || ' EUR'
        ELSE 'Budget à définir'
    END;

    -- Notifier tous les experts du réseau
    FOR rec IN
        SELECT au.email, p.full_name,
               COALESCE(split_part(p.full_name, ' ', 1), 'Expert') AS first_name
        FROM   public.profiles p
        JOIN   auth.users au ON au.id = p.id
        WHERE  p.role IN ('expert', 'prestataire')
          AND  au.email IS NOT NULL
          AND  au.email_confirmed_at IS NOT NULL
          AND  au.deleted_at IS NULL
    LOOP
        PERFORM public.send_brevo_email(
            rec.email,
            rec.full_name,
            'Nouvelle offre de mission disponible – Domtom Connect',
            '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="background:#0f172a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
    <p style="margin:0;color:#10b981;font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Domtom Connect – Offres de mission</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;">Une mission correspond à votre profil.</h1>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Bonjour ' || rec.first_name || ',</p>
    <p style="margin:0 0 8px;font-size:1rem;color:#334155;line-height:1.7;">Une nouvelle offre de mission vient d''être publiée sur Domtom Connect :</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:28px;border:1px solid #e2e8f0;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
        <span style="font-size:0.75rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Titre</span><br>
        <strong style="color:#0f172a;font-size:1rem;">' || COALESCE(NEW.title, 'Mission disponible') || '</strong>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
        <span style="font-size:0.75rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Secteur</span><br>
        <span style="color:#334155;">' || COALESCE(NEW.sector, 'Non précisé') || '</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
        <span style="font-size:0.75rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Territoire</span><br>
        <span style="color:#334155;">' || COALESCE(NEW.territory, 'Non précisé') || '</span>
      </td></tr>
      <tr><td style="padding:8px 0;">
        <span style="font-size:0.75rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Budget estimé</span><br>
        <strong style="color:#10b981;">' || budget_str || '</strong>
      </td></tr>
    </table>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="https://domtomconnect.com/mon-espace.html#jobs" target="_blank"
         style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;font-size:0.95rem;font-weight:700;padding:16px 32px;border-radius:12px;">
        Voir l''offre et postuler
      </a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:0.8rem;color:#94a3b8;">Vous recevez cet email car vous êtes référencé comme expert sur Domtom Connect.
    <a href="mailto:contact@domtomconnect.com?subject=Desabonnement" style="color:#64748b;">Se désabonner</a>.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>'
        );
    END LOOP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_new_job_offer ON public.job_offers;
CREATE TRIGGER trigger_new_job_offer
    AFTER INSERT OR UPDATE ON public.job_offers
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_job_offer();


-- ============================================================
-- TRIGGER 6 : RAPPEL D'INACTIVITÉ (fonction manuelle à planifier)
-- Ce trigger n'est pas automatique : il se déclenche via un appel
-- planifié (pg_cron) ou via le SQL Editor de Supabase manuellement.
-- Exécuter la commande ci-dessous pour envoyer les rappels :
-- SELECT public.send_inactivity_reminders();
-- ============================================================
CREATE OR REPLACE FUNCTION public.send_inactivity_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rec        RECORD;
    first_name TEXT;
BEGIN
    -- Notifier les utilisateurs inactifs depuis 7 jours
    -- (basé sur last_sign_in_at dans auth.users)
    FOR rec IN
        SELECT
            au.email,
            COALESCE(p.full_name, 'Membre du réseau') AS full_name
        FROM auth.users au
        LEFT JOIN public.profiles p ON p.id = au.id
        WHERE au.last_sign_in_at < NOW() - INTERVAL '7 days'
          AND au.last_sign_in_at > NOW() - INTERVAL '30 days' -- Pas relancer ceux absents > 1 mois
          AND au.email IS NOT NULL
          AND au.email_confirmed_at IS NOT NULL
          AND au.deleted_at IS NULL
    LOOP
        first_name := COALESCE(split_part(rec.full_name, ' ', 1), 'Membre du réseau');

        PERFORM public.send_brevo_email(
            rec.email,
            rec.full_name,
            'Des opportunités vous attendent sur Domtom Connect',
            '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="background:#0f172a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
    <p style="margin:0;color:#10b981;font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Domtom Connect</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;">Le réseau bouge.</h1>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">Bonjour ' || first_name || ',</p>
    <p style="margin:0 0 20px;font-size:1rem;color:#334155;line-height:1.7;">De nouvelles opportunités, publications et connexions ont émergé sur Domtom Connect depuis votre dernière visite. Prenez quelques minutes pour consulter ce qui pourrait faire avancer votre activité.</p>
    <p style="margin:0 0 28px;font-size:1rem;color:#334155;line-height:1.7;">Offres de missions, projets à soutenir, membres à rencontrer : votre espace vous attend.</p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="https://domtomconnect.com/mon-espace.html" target="_blank"
         style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;font-size:0.95rem;font-weight:700;padding:16px 32px;border-radius:12px;">
        Reprendre où vous en étiez
      </a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:0.8rem;color:#94a3b8;">Vous recevez cet email car vous êtes membre de Domtom Connect.
    <a href="mailto:contact@domtomconnect.com?subject=Desabonnement" style="color:#64748b;">Se désabonner</a>.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>'
        );

        -- Pause toutes les 10 notifications pour éviter le rate-limit
        IF MOD((SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at < NOW() - INTERVAL '7 days')::INT, 10) = 0 THEN
            PERFORM pg_sleep(0.5);
        END IF;
    END LOOP;
END;
$$;

-- ============================================================
-- RÉSUMÉ DES TRIGGERS ACTIFS APRÈS CE SCRIPT
-- ============================================================
-- trigger_welcome_email          -> profiles (AFTER INSERT)
-- trigger_project_approved       -> projects (AFTER UPDATE, statut -> 'approved')
-- trigger_contribution_received  -> contributions (AFTER INSERT/UPDATE, statut -> 'completed')
-- trigger_mastermind_message     -> messages (AFTER INSERT, conv Mastermind uniquement)
-- trigger_new_job_offer          -> job_offers (AFTER INSERT/UPDATE, statut -> 'open')
-- send_inactivity_reminders()    -> Appel manuel ou pg_cron hebdomadaire
-- ============================================================
-- Pour activer les rappels d'inactivité toutes les semaines (optionnel) :
-- SELECT cron.schedule('rappel-inactivite', '0 9 * * 1', 'SELECT public.send_inactivity_reminders();');
-- ============================================================
