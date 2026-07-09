-- Ajout du motif de rejet pour la certification
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

COMMENT ON COLUMN projects.rejection_reason IS 'Motif du refus de certification par l''administrateur.';
