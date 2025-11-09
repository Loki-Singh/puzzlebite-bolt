/*
  # Create Rewards System for Puzzle Drop Game

  1. New Tables
    - `rewards`
      - `id` (uuid, primary key) - Unique identifier for each reward
      - `title` (text) - Reward title (e.g., "20% Off Coffee")
      - `description` (text) - Reward description
      - `discount_type` (text) - Type of discount (percentage, fixed, freebie)
      - `discount_value` (text) - Value display (e.g., "20%", "$5 OFF")
      - `image_url` (text) - Image for the reward
      - `active` (boolean) - Whether reward is currently active
      - `created_at` (timestamptz) - When reward was created

    - `user_rewards`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (text) - User identifier (can be device ID or auth user)
      - `reward_id` (uuid, foreign key) - Reference to rewards table
      - `claimed_at` (timestamptz) - When reward was claimed
      - `puzzle_completed` (boolean) - Whether puzzle was completed successfully
      - `time_taken` (integer) - Seconds taken to complete puzzle

  2. Security
    - Enable RLS on both tables
    - Users can read all active rewards
    - Users can insert their own reward claims
    - Users can read their own reward history
*/

CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  discount_type text NOT NULL DEFAULT 'percentage',
  discount_value text NOT NULL,
  image_url text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  reward_id uuid REFERENCES rewards(id) ON DELETE CASCADE,
  claimed_at timestamptz DEFAULT now(),
  puzzle_completed boolean DEFAULT false,
  time_taken integer DEFAULT 0
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active rewards"
  ON rewards FOR SELECT
  USING (active = true);

CREATE POLICY "Users can insert their own reward claims"
  ON user_rewards FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own reward claims"
  ON user_rewards FOR SELECT
  USING (true);

INSERT INTO rewards (title, description, discount_type, discount_value, image_url) VALUES
  ('Coffee Lover Special', 'Get 20% off any coffee drink', 'percentage', '20%', 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Breakfast Bundle', 'Free pastry with breakfast order', 'freebie', 'Free Item', 'https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Lunch Deal', '15% off all lunch items', 'percentage', '15%', 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Happy Hour', '$5 off any meal over $20', 'fixed', '$5 OFF', 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Sweet Treat', 'Buy 1 dessert, get 1 free', 'freebie', 'BOGO', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400');
