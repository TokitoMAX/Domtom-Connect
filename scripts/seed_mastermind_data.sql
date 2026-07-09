-- =============================================================
-- SEED DATA - Club Mastermind DTC
-- À exécuter dans le SQL Editor de Supabase
-- Peuple les tables 'events' et 'webinars' pour que le dashboard
-- Mastermind affiche de vraies données au lieu des données mock.
-- =============================================================

-- =============================================================
-- 0. MISE À JOUR DU SCHÉMA (colonnes manquantes sur 'webinars')
-- =============================================================
ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS replay_url TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- =============================================================
-- 1. ÉVÉNEMENTS PHYSIQUES (table 'events')
-- =============================================================

INSERT INTO public.events (user_id, title, event_date, location, description, image_url, ticket_url)
VALUES
  (
    (SELECT id FROM auth.users WHERE email = 'domtomconnect@gmail.com' LIMIT 1),
    'Afterwork B2B Networking - Martinique',
    'Vendredi 26 Juin 2026 à 19h00',
    'Fort-de-France, Martinique',
    'Soirée networking exclusive pour les décideurs et entrepreneurs de la Martinique. Venez échanger, nouer des partenariats et booster votre réseau B2B dans un cadre convivial.',
    'https://vlpzmxddgdjjtrpbtksd.supabase.co/storage/v1/object/public/events_flyers/afterwork-martinique.jpg',
    NULL
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'domtomconnect@gmail.com' LIMIT 1),
    'Meetup Co-Working & Cocktails - Guadeloupe',
    'Samedi 11 Juillet 2026 à 18h30',
    'Gosier, Guadeloupe',
    'Après-midi networking combinant session de co-travail collaboratif et cocktail de clôture. Idéal pour les porteurs de projets et freelances souhaitant créer des synergies.',
    'https://vlpzmxddgdjjtrpbtksd.supabase.co/storage/v1/object/public/events_flyers/meetup-guadeloupe.jpg',
    NULL
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'domtomconnect@gmail.com' LIMIT 1),
    'Sommet des Entrepreneurs - Guyane',
    'Samedi 20 Septembre 2026 à 14h00',
    'Cayenne, Guyane',
    'Grand rassemblement des acteurs économiques de Guyane. Conférences, pitchs et networking autour des opportunités d''investissement dans la région.',
    'https://vlpzmxddgdjjtrpbtksd.supabase.co/storage/v1/object/public/events_flyers/sommet-guyane.jpg',
    NULL
  )
ON CONFLICT DO NOTHING;

-- =============================================================
-- 2. REPLAYS DE MASTERCLASSES (table 'webinars')
-- Les webinars avec status='finished' apparaissent comme replays.
-- 'host_id' peut être NULL si aucun profil expert n'est disponible.
-- =============================================================

INSERT INTO public.webinars (title, description, scheduled_at, meeting_link, status, replay_url, is_published, host_id)
VALUES
  (
    'Lever des fonds en Guyane : Guide Complet',
    'Masterclass complète sur les mécanismes de financement disponibles pour les entrepreneurs de Guyane : BPI, fonds européens, investisseurs privés et business angels de la diaspora.',
    '2026-03-15 18:00:00+00',
    'https://meet.jit.si/DTC-Mastermind-replay-1',
    'finished',
    'https://www.youtube.com/watch?v=placeholder1',
    true,
    (SELECT id FROM public.profiles WHERE role = 'expert' LIMIT 1)
  ),
  (
    'Optimisation Fiscale Outre-Mer',
    'Tour d''horizon des dispositifs fiscaux spécifiques aux DOM-TOM : défiscalisation Girardin, loi Pinel outre-mer, exonérations de charges, et stratégies d''optimisation légales pour PME.',
    '2026-02-20 18:30:00+00',
    'https://meet.jit.si/DTC-Mastermind-replay-2',
    'finished',
    'https://www.youtube.com/watch?v=placeholder2',
    true,
    (SELECT id FROM public.profiles WHERE role = 'expert' LIMIT 1)
  ),
  (
    'Pitcher son projet devant des investisseurs',
    'Techniques avancées pour structurer un pitch deck percutant, gérer le stress, répondre aux objections et convaincre des investisseurs lors de sessions de due diligence.',
    '2026-01-18 19:00:00+00',
    'https://meet.jit.si/DTC-Mastermind-replay-3',
    'finished',
    'https://www.youtube.com/watch?v=placeholder3',
    true,
    (SELECT id FROM public.profiles WHERE role = 'expert' LIMIT 1)
  )
ON CONFLICT DO NOTHING;

-- =============================================================
-- VÉRIFICATION
-- =============================================================
SELECT 'EVENTS' as table_name, COUNT(*) as rows FROM public.events
UNION ALL
SELECT 'WEBINARS (finished)', COUNT(*) FROM public.webinars WHERE status = 'finished';
