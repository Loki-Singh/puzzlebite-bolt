/*
  # Wordle Words Table

  1. New Tables
    - `wordle_words`
      - `id` (uuid, primary key) - Unique identifier
      - `word` (text, not null) - The 5-letter word
      - `length` (integer, not null) - Word length (always 5 for standard Wordle)
      - `difficulty` (text) - Optional difficulty level (easy, medium, hard)
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `wordle_words` table
    - Add policy for all authenticated users to read words

  3. Initial Data
    - Insert sample 5-letter words for gameplay
*/

-- Create wordle_words table
CREATE TABLE IF NOT EXISTS wordle_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  length integer NOT NULL DEFAULT 5,
  difficulty text DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

-- Add index for faster word lookups
CREATE INDEX IF NOT EXISTS idx_wordle_words_length ON wordle_words(length);

-- Enable RLS
ALTER TABLE wordle_words ENABLE ROW LEVEL SECURITY;

-- Policy: All users can read words (needed for gameplay)
CREATE POLICY "Anyone can read wordle words"
  ON wordle_words
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample 5-letter words
INSERT INTO wordle_words (word, length, difficulty) VALUES
  ('APPLE', 5, 'easy'),
  ('BREAD', 5, 'easy'),
  ('CHAIR', 5, 'easy'),
  ('DANCE', 5, 'easy'),
  ('EARTH', 5, 'medium'),
  ('FLAME', 5, 'medium'),
  ('GHOST', 5, 'medium'),
  ('HAPPY', 5, 'easy'),
  ('IVORY', 5, 'hard'),
  ('JUMPS', 5, 'medium'),
  ('KNIFE', 5, 'medium'),
  ('LIGHT', 5, 'easy'),
  ('MUSIC', 5, 'easy'),
  ('NIGHT', 5, 'easy'),
  ('OCEAN', 5, 'medium'),
  ('PIANO', 5, 'medium'),
  ('QUEEN', 5, 'medium'),
  ('RIVER', 5, 'easy'),
  ('STONE', 5, 'easy'),
  ('TIGER', 5, 'easy'),
  ('UNDER', 5, 'medium'),
  ('VOICE', 5, 'medium'),
  ('WATER', 5, 'easy'),
  ('YOUTH', 5, 'hard'),
  ('ZEBRA', 5, 'hard'),
  ('BEACH', 5, 'easy'),
  ('CLOUD', 5, 'easy'),
  ('DREAM', 5, 'easy'),
  ('FIELD', 5, 'medium'),
  ('GRAPE', 5, 'easy'),
  ('HOUSE', 5, 'easy'),
  ('MAGIC', 5, 'medium'),
  ('PLANT', 5, 'easy'),
  ('QUICK', 5, 'hard'),
  ('SMILE', 5, 'easy'),
  ('TRAIN', 5, 'easy'),
  ('WORLD', 5, 'easy'),
  ('YOUNG', 5, 'easy'),
  ('BRAVE', 5, 'medium'),
  ('CLEAN', 5, 'easy'),
  ('FRESH', 5, 'medium'),
  ('GREAT', 5, 'easy'),
  ('HEART', 5, 'easy'),
  ('JOLLY', 5, 'medium'),
  ('LEMON', 5, 'easy'),
  ('MANGO', 5, 'easy'),
  ('NOBLE', 5, 'hard'),
  ('PEACE', 5, 'easy'),
  ('READY', 5, 'easy'),
  ('SWEET', 5, 'easy')
ON CONFLICT DO NOTHING;
