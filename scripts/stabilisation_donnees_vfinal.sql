-- ==========================================
-- SCRIPT DE STABILISATION FINALE - DOMTOM CONNECT
-- Objectif : Restaurer la visibilité totale des Experts et Missions
-- ==========================================

-- 1. Réparation des visibilités Experts (listed)
-- On passe à 'true' tous les experts qui n'ont pas explicitement demandé à être masqués
UPDATE profiles 
SET listed = true 
WHERE listed IS NULL 
AND role IN ('expert', 'prestataire');

-- 2. Nettoyage des rôles (Standardisation)
-- On s'assure que les rôles sont en minuscules pour éviter les erreurs de filtrage JS
UPDATE profiles 
SET role = LOWER(role);

-- 3. Réparation des visibilités Missions (is_active)
-- On active par défaut toutes les missions qui n'ont pas de statut défini
UPDATE job_offers 
SET is_active = true 
WHERE is_active IS NULL;

-- 4. Vérification de cohérence (Optionnel mais recommandé)
-- S'assurer que Loïc Kv et les autres experts sont bien dans la catégorie 'expert' ou 'prestataire'
-- Si un utilisateur a rempli un TJM ou des compétences, il devrait être considéré comme expert
UPDATE profiles
SET role = 'expert'
WHERE role = 'user' 
AND (tjm IS NOT NULL OR skills IS NOT NULL);

-- 5. Publication forcée (Sécurité de base)
UPDATE profiles SET listed = true WHERE full_name ILIKE '%Loïc Kv%';

-- FIN DU SCRIPT
