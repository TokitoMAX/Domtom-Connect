-- Script pour publier l'événement manuellement dans le fil d'actualité DTC Moments
-- À exécuter dans le SQL Editor de Supabase

DO $$
DECLARE
    v_event_id UUID := 'f419bee1-0f78-48f4-a935-1ac9c8ce4d31';
    v_event_image TEXT;
    v_user_id UUID;
BEGIN
    -- 1. Récupérer les infos de l'événement (image et créateur)
    SELECT image_url, user_id
    INTO v_event_image, v_user_id
    FROM public.events
    WHERE id = v_event_id;

    -- Si l'événement existe bien
    IF FOUND THEN
        -- 2. Insérer le post EXACTEMENT comme demandé
        INSERT INTO public.showcase_items (
            user_id,
            category,
            item_type,
            title,
            description,
            image_url,
            meta_info
        ) VALUES (
            v_user_id,
            'status',
            'opportunite',
            'opportunite', -- Utilisé par le frontend pour afficher le badge vert OPPORTUNITÉ
            'Je vous invite à notre prochain événement : Masterclass : Présentation de la plateforme (Heure de Paris).' || CHR(10) || CHR(10) || 'Nous verrons en détail comment utiliser la plateforme pour développer vos opportunités et votre réseau. Les places sont limitées pour nous permettre de bien échanger.',
            v_event_image,
            '{"cta":"https://domtomconnect.com/marketplace/evenement-details?id=' || v_event_id || '"}'
        );
        
        RAISE NOTICE 'Événement publié avec succès dans le DTC Feed !';
    ELSE
        RAISE EXCEPTION 'Événement introuvable.';
    END IF;
END $$;
