-- Script: trigger_auto_delete_event.sql
-- Description: Déclencheur automatique pour supprimer la publication d'un événement dans le flux DTC quand l'événement est supprimé.

-- 1. Fonction appelée par le Trigger
CREATE OR REPLACE FUNCTION public.auto_delete_event_from_feed()
RETURNS TRIGGER AS $$
BEGIN
    -- Suppression de la publication associée dans le feed (showcase_items)
    -- On cherche la publication de type 'opportunite' qui a le même ID d'événement dans son meta_info
    DELETE FROM public.showcase_items 
    WHERE item_type = 'opportunite' 
    AND meta_info LIKE '%"cta":"https://domtomconnect.com/marketplace/evenement-details.html?id=' || OLD.id || '"%';

    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Création du Trigger
DROP TRIGGER IF EXISTS trg_auto_delete_event_from_feed ON public.events;
CREATE TRIGGER trg_auto_delete_event_from_feed
AFTER DELETE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.auto_delete_event_from_feed();
