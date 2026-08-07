-- Add created_by to class_sessions
-- Run in Supabase SQL Editor
ALTER TABLE class_sessions 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
