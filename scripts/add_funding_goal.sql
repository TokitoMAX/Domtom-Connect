-- Add funding_goal column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS funding_goal NUMERIC DEFAULT 1000;
