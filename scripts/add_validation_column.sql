-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- This adds the necessary column to track when a ticket was validated.

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP WITH TIME ZONE;

-- Add verification comment
COMMENT ON COLUMN tickets.validated_at IS 'Timestamp of when the ticket was scanned and validated at the event entrance.';
