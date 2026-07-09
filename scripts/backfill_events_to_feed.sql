-- Script: backfill_events_to_feed.sql
-- Description: Ce script va publier tous les événements DEJA EXISTANTS dans la table events vers le feed DTC (showcase_items),
-- en évitant les doublons (on vérifie que l'événement n'a pas déjà été publié via son URL dans meta_info).

INSERT INTO public.showcase_items (
    user_id,
    category,
    item_type,
    title,
    description,
    image_url,
    meta_info
)
SELECT 
    e.user_id,
    'status',
    'opportunite',
    'opportunite',
    'ANNONCE ÉVÉNEMENT : ' || e.title || CHR(10) || CHR(10) ||
    'La billetterie est officiellement ouverte. Ne manquez pas cette opportunité et sécurisez votre accès dès maintenant en cliquant sur le lien sécurisé ci-dessous.' ||
    CASE 
        WHEN e.description IS NOT NULL AND TRIM(e.description) <> '' 
        THEN CHR(10) || CHR(10) || 'Détails : ' || e.description 
        ELSE '' 
    END,
    e.image_url,
    '{"cta":"https://domtomconnect.com/marketplace/evenement-details.html?id=' || e.id || '"}'
FROM public.events e
WHERE NOT EXISTS (
    -- On vérifie que cet événement n'a pas déjà été publié dans le feed pour éviter de le poster en double
    SELECT 1 
    FROM public.showcase_items s 
    WHERE s.meta_info LIKE '%evenement-details.html?id=' || e.id || '%'
);
