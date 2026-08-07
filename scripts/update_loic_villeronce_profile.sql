-- Option 1 : Mettre une valeur numérique entière (ex: 450)
UPDATE profiles
SET 
    title = 'Chef de projet & développement business je structure et lance des projets multi-fronts, de l''idée au terrain',
    bio = 'Chef de projet spécialisé dans le lancement et la structuration de projets à plusieurs facettes. Je pilote actuellement plusieurs ventures en parallèle prospection B2B, construction d''un produit digital, logistique de proximité avec une approche pragmatique et orientée résultats. Mon point fort, c''est de transformer une idée floue en plan d''action concret et exécutable, en gérant les priorités sous contrainte de temps et de ressources. Disponible pour des missions de gestion de projet, structuration d''offre ou pilotage d''acquisition client.',
    tjm = 450,
    skills = 'Gestion de projet, Community management, Prospection B2B, Structuration d''offre, Pilotage multi-projets'
WHERE full_name ILIKE '%loic%' OR full_name ILIKE '%villeronce%';

-- Option 2 (Si vous souhaitez autoriser les tranches de prix comme '450 - 500') :
-- Décommenter les 2 lignes ci-dessous :
-- ALTER TABLE profiles ALTER COLUMN tjm TYPE text USING tjm::text;
-- UPDATE profiles SET tjm = '450 - 500' WHERE full_name ILIKE '%loic%' OR full_name ILIKE '%villeronce%';
