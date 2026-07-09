-- Script: trigger_auto_post_event.sql
-- Description: Déclencheur automatique pour publier chaque nouvel événement dans le flux DTC (showcase_items).

-- 1. Fonction appelée par le Trigger
CREATE OR REPLACE FUNCTION public.auto_post_event_to_feed()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertion dans le feed (showcase_items)
    INSERT INTO public.showcase_items (
        user_id,
        category,
        item_type,
        title,
        description,
        image_url,
        meta_info
    ) VALUES (
        NEW.user_id,
        'status',
        'opportunite',
        'opportunite', -- Titre spécial utilisé par le front pour le badge
        'ANNONCE ÉVÉNEMENT : ' || NEW.title || CHR(10) || CHR(10) ||
        'La billetterie est officiellement ouverte. Ne manquez pas cette opportunité et sécurisez votre accès dès maintenant en cliquant sur le lien sécurisé ci-dessous.' ||
        CASE 
            WHEN NEW.description IS NOT NULL AND TRIM(NEW.description) <> '' 
            THEN CHR(10) || CHR(10) || 'Détails : ' || NEW.description 
            ELSE '' 
        END,
        NEW.image_url,
        '{"cta":"https://domtomconnect.com/marketplace/evenement-details.html?id=' || NEW.id || '"}'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Création du Trigger
DROP TRIGGER IF EXISTS trg_auto_post_event_to_feed ON public.events;
CREATE TRIGGER trg_auto_post_event_to_feed
AFTER INSERT ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.auto_post_event_to_feed();
