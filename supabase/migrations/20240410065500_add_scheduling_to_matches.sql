-- Add scheduling columns to single_elimination_matches
ALTER TABLE single_elimination_matches 
ADD COLUMN IF NOT EXISTS scheduled_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ground TEXT;
