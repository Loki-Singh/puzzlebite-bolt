/*
  # Mascot Preferences System

  1. New Tables
    - `mascot_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `selected_mascot` (text) - The personality type selected
      - `mascot_name` (text) - Custom name for the mascot
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `mascot_preferences` table
    - Add policy for authenticated users to read their own preferences
    - Add policy for authenticated users to insert their own preferences
    - Add policy for authenticated users to update their own preferences
*/

CREATE TABLE IF NOT EXISTS mascot_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_mascot text NOT NULL DEFAULT 'playful_puppy',
  mascot_name text DEFAULT 'Buddy',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE mascot_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mascot preferences"
  ON mascot_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mascot preferences"
  ON mascot_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mascot preferences"
  ON mascot_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_mascot_preferences_user_id ON mascot_preferences(user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mascot_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mascot_preferences_updated_at
  BEFORE UPDATE ON mascot_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_mascot_preferences_updated_at();