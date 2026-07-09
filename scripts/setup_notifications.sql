-- ============================================================
-- setup_notifications.sql – Domtom Connect
-- Table des notifications in-app (la cloche dans le dashboard)
-- ============================================================

-- 1. Créer la table notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL, -- 'comment', 'follower', 'project_approved', 'contribution', 'job_offer', 'mastermind'
    title       TEXT NOT NULL,
    message     TEXT NOT NULL,
    link        TEXT,          -- URL de destination (ex: #moments, #success-engine)
    is_read     BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index de performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread  ON public.notifications(user_id, is_read) WHERE is_read = false;

-- 3. RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see their own notifications" ON public.notifications;
CREATE POLICY "Users can see their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark their notifications as read" ON public.notifications;
CREATE POLICY "Users can mark their notifications as read"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

-- 4. Activer le realtime pour les notifications en direct
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- ============================================================
-- Mettre à jour les triggers existants pour AUSSI insérer
-- une notification in-app en plus de l'email
-- ============================================================

-- Nouveau commentaire : notifier l'auteur du post
CREATE OR REPLACE FUNCTION public.notify_on_new_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    post_owner_id    UUID;
    post_owner_name  TEXT;
    post_owner_email TEXT;
    commenter_name   TEXT;
    post_title       TEXT;
    email_subject    TEXT;
    email_body       TEXT;
BEGIN
    SELECT si.owner_id, p.full_name, au.email
    INTO   post_owner_id, post_owner_name, post_owner_email
    FROM   public.showcase_items si
    JOIN   public.profiles p ON p.id = si.owner_id
    JOIN   auth.users au     ON au.id = si.owner_id
    WHERE  si.id = NEW.post_id;

    SELECT full_name INTO commenter_name FROM public.profiles WHERE id = NEW.user_id;

    IF post_owner_id = NEW.user_id THEN RETURN NEW; END IF;

    SELECT COALESCE(title, 'votre publication') INTO post_title
    FROM   public.showcase_items WHERE id = NEW.post_id;

    -- Notification in-app
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
        post_owner_id,
        'comment',
        'Nouveau commentaire',
        COALESCE(commenter_name, 'Un membre') || ' a commenté votre publication "' || post_title || '"',
        '#moments'
    );

    -- Email (inchangé)
    email_subject := 'Nouveau commentaire sur votre publication – Domtom Connect';
    email_body    := '<p>Bonjour ' || COALESCE(post_owner_name, '') || ',<br>' || COALESCE(commenter_name, 'Un membre') || ' a réagi à votre publication.</p><a href="https://domtomconnect.com/mon-espace.html#moments">Voir le commentaire</a>';
    PERFORM public.send_brevo_email(post_owner_email, COALESCE(post_owner_name, ''), email_subject, email_body);

    RETURN NEW;
END;
$$;

-- Nouveau follower : notifier le propriétaire de la chaîne
CREATE OR REPLACE FUNCTION public.notify_on_new_follower()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    channel_owner_name  TEXT;
    channel_owner_email TEXT;
    follower_name       TEXT;
BEGIN
    SELECT p.full_name, au.email
    INTO   channel_owner_name, channel_owner_email
    FROM   public.profiles p JOIN auth.users au ON au.id = p.id
    WHERE  p.id = NEW.following_id;

    SELECT full_name INTO follower_name FROM public.profiles WHERE id = NEW.follower_id;

    -- Notification in-app
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
        NEW.following_id,
        'follower',
        'Nouvel abonné',
        COALESCE(follower_name, 'Un membre') || ' s''est abonné à votre Chaîne',
        '#channel'
    );

    -- Email
    PERFORM public.send_brevo_email(
        channel_owner_email, COALESCE(channel_owner_name, ''),
        'Nouveau membre dans votre réseau – Domtom Connect',
        '<p>Bonjour, <strong>' || COALESCE(follower_name, 'Un membre') || '</strong> s''est abonné à votre Chaîne.</p><a href="https://domtomconnect.com/mon-espace.html#channel">Voir ma Chaîne</a>'
    );
    RETURN NEW;
END;
$$;

-- Épopée approuvée : notifier le porteur
CREATE OR REPLACE FUNCTION public.notify_project_approved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    owner_email TEXT; owner_name TEXT; project_title TEXT;
BEGIN
    IF OLD.status = NEW.status OR NEW.status != 'approved' THEN RETURN NEW; END IF;
    SELECT au.email, p.full_name INTO owner_email, owner_name
    FROM auth.users au JOIN public.profiles p ON p.id = au.id WHERE au.id = NEW.owner_id;
    project_title := COALESCE(NEW.title, NEW.name, 'votre Épopée');

    -- Notification in-app
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
        NEW.owner_id, 'project_approved',
        'Épopée approuvée !',
        'Votre Épopée "' || project_title || '" a été validée. Elle est maintenant visible publiquement.',
        '#success-engine'
    );

    -- Email
    PERFORM public.send_brevo_email(owner_email, COALESCE(owner_name, ''),
        'Votre Épopée a été approuvée – Domtom Connect',
        '<p>Bonjour, votre Épopée <strong>"' || project_title || '"</strong> a été approuvée.</p><a href="https://domtomconnect.com/mon-espace.html#success-engine">Accéder à mon tableau de bord</a>'
    );
    RETURN NEW;
END;
$$;

-- Contribution reçue : notifier le porteur
CREATE OR REPLACE FUNCTION public.notify_contribution_received()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    owner_id UUID; owner_email TEXT; owner_name TEXT;
    project_title TEXT; amount_str TEXT; donor_str TEXT;
BEGIN
    IF NEW.status != 'completed' THEN RETURN NEW; END IF;
    IF TG_OP = 'UPDATE' AND OLD.status = 'completed' THEN RETURN NEW; END IF;

    SELECT pr.owner_id, au.email, p.full_name
    INTO   owner_id, owner_email, owner_name
    FROM   public.projects pr
    JOIN   auth.users au ON au.id = pr.owner_id
    JOIN   public.profiles p ON p.id = pr.owner_id
    WHERE  pr.id = NEW.project_id;

    project_title := COALESCE((SELECT title FROM public.projects WHERE id = NEW.project_id), 'votre projet');
    amount_str    := to_char(NEW.amount, 'FM999 999 999') || ' ' || COALESCE(NEW.currency, 'EUR');
    donor_str     := COALESCE(NEW.donor_name, 'Un membre de la communauté');

    -- Notification in-app
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
        owner_id, 'contribution',
        'Nouveau soutien reçu',
        donor_str || ' a soutenu "' || project_title || '" à hauteur de ' || amount_str,
        '#success-engine'
    );

    -- Email
    PERFORM public.send_brevo_email(owner_email, COALESCE(owner_name, ''),
        'Nouveau soutien reçu – Domtom Connect',
        '<p>Bonjour, <strong>' || donor_str || '</strong> vient de soutenir votre projet à hauteur de <strong>' || amount_str || '</strong>.</p>'
    );
    RETURN NEW;
END;
$$;
