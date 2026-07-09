-- Script Supabase pour supprimer TOUS les faux contenus (posts, stories, projets de test)

-- 1. Supprime le projet "Malopa" ou tout autre contenu contenant "test"
DELETE FROM public.showcase_items
WHERE title ILIKE '%test%' OR description ILIKE '%test%';

-- 2. Supprime également tous les anciens status/stories de test si vous le souhaitez
DELETE FROM public.showcase_items
WHERE category IN ('status', 'story');
