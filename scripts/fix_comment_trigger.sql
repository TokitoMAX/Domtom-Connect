-- fix_comment_trigger.sql
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
    SELECT si.user_id, p.full_name, au.email
    INTO   post_owner_id, post_owner_name, post_owner_email
    FROM   public.showcase_items si
    JOIN   public.profiles p ON p.id = si.user_id
    JOIN   auth.users au     ON au.id = si.user_id
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
