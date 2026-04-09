-- SQL script to ensure the correct schema for tournamentUsers and related tables
-- You can run this in your Supabase SQL Editor

-- 1. Ensure tournamentUsers has created_at
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tournamentUsers' AND column_name = 'created_at'
    ) THEN 
        ALTER TABLE "tournamentUsers" ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 2. Ensure foreign keys are properly set for joining tournaments
-- This helps Supabase understand the relationship 'tournaments' in selects
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tournamentUsers_tournament_id_fkey'
    ) THEN
        ALTER TABLE "tournamentUsers" 
        ADD CONSTRAINT "tournamentUsers_tournament_id_fkey" 
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Ensure analytics table exists if referenced elsewhere
CREATE TABLE IF NOT EXISTS "analytics" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "tournament_id" UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    "view_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Ensure accessRequests table exists
CREATE TABLE IF NOT EXISTS "accessRequests" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "tournament_id" UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "status" TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Ensure notifications table exists and has necessary columns
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "related_id" UUID,
    "message" TEXT,
    "read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
