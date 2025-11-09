/*
  # Create Puzzles Content System

  1. New Tables
    - `puzzles`
      - `id` (uuid, primary key)
      - `category` (text) - category identifier (ipl, fifa, music, etc.)
      - `type` (text) - puzzle type (riddle, trivia, word_puzzle, etc.)
      - `question` (text) - the puzzle question or riddle
      - `answer` (text) - the correct answer
      - `difficulty` (text) - easy, medium, hard
      - `hints` (jsonb) - array of hints
      - `points` (integer) - points awarded for solving
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `puzzles` table
    - Add policy for public read access to puzzles
  
  3. Sample Data
    - Insert sample puzzles for each category
*/

CREATE TABLE IF NOT EXISTS puzzles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  type text NOT NULL DEFAULT 'riddle',
  question text NOT NULL,
  answer text NOT NULL,
  difficulty text NOT NULL DEFAULT 'easy',
  hints jsonb DEFAULT '[]'::jsonb,
  points integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read puzzles"
  ON puzzles
  FOR SELECT
  TO public
  USING (true);

-- Insert sample puzzles for each category
INSERT INTO puzzles (category, type, question, answer, difficulty, hints, points) VALUES
-- IPL
('ipl', 'riddle', 'I am known as Captain Cool. I have led CSK to multiple IPL titles and am famous for my helicopter shot. Who am I?', 'MS Dhoni', 'easy', '["I am a wicket-keeper", "I wear jersey number 7", "I retired from international cricket in 2020"]'::jsonb, 100),
('ipl', 'riddle', 'This franchise is owned by Bollywood star Shah Rukh Khan and has won the IPL title twice. Which team am I?', 'Kolkata Knight Riders', 'easy', '["We wear purple and gold", "Our home ground is Eden Gardens", "Our theme song is Korbo Lorbo Jeetbo"]'::jsonb, 100),
('ipl', 'riddle', 'I hold the record for the fastest fifty in IPL history, scored in just 15 balls. Who am I?', 'KL Rahul', 'medium', '["I am a wicket-keeper batsman", "I have captained Punjab Kings", "I now play for Lucknow Super Giants"]'::jsonb, 150),

-- FIFA
('fifa', 'riddle', 'I won the FIFA World Cup 5 times, more than any other nation. I am known for samba football and the color yellow. Which country am I?', 'Brazil', 'easy', '["Pele played for me", "My flag is green and yellow", "I have the Amazon rainforest"]'::jsonb, 100),
('fifa', 'riddle', 'I am the all-time top scorer in World Cup history with 16 goals. I played for Germany and scored in 4 different World Cups. Who am I?', 'Miroslav Klose', 'hard', '["I was born in Poland", "I won the World Cup in 2014", "I am a striker"]'::jsonb, 200),
('fifa', 'riddle', 'This country has appeared in every FIFA World Cup tournament since 1930. Which nation am I?', 'Brazil', 'medium', '["I have won 5 World Cups", "My colors are yellow and blue", "I am in South America"]'::jsonb, 150),

-- Music
('music', 'riddle', 'I am known as the King of Pop. I moonwalked my way into history and sang "Thriller" and "Billie Jean". Who am I?', 'Michael Jackson', 'easy', '["I had a pet chimp named Bubbles", "I wore one white glove", "My sister is Janet"]'::jsonb, 100),
('music', 'riddle', 'This band from Liverpool changed music forever. They sang "Hey Jude", "Let It Be", and "Yesterday". Who are we?', 'The Beatles', 'easy', '["We had four members", "We broke up in 1970", "John and Paul wrote most songs"]'::jsonb, 100),
('music', 'riddle', 'I am a singer who can hit the highest notes. I am known for "Emotions" and "Hero". I have a five-octave vocal range. Who am I?', 'Mariah Carey', 'medium', '["I am famous for Christmas music", "All I Want for Christmas Is You", "I was married to Nick Cannon"]'::jsonb, 150),

-- Hollywood
('hollywood', 'riddle', 'I played Iron Man in the Marvel Cinematic Universe. I started the Avengers journey and said "I am Iron Man". Who am I?', 'Robert Downey Jr.', 'easy', '["I also played Sherlock Holmes", "I had personal struggles before MCU", "I was in Chaplin"]'::jsonb, 100),
('hollywood', 'riddle', 'This movie won 11 Oscars in 1998, tying the record. It starred Leonardo DiCaprio and Kate Winslet. What movie am I?', 'Titanic', 'easy', '["I am about a ship disaster", "My love story is iconic", "My song is My Heart Will Go On"]'::jsonb, 100),
('hollywood', 'riddle', 'I directed movies like Inception, The Dark Knight, and Interstellar. I am known for mind-bending plots. Who am I?', 'Christopher Nolan', 'medium', '["I am British", "I avoid using CGI when possible", "I directed Oppenheimer"]'::jsonb, 150),

-- Bollywood
('bollywood', 'riddle', 'I am the King Khan of Bollywood. I have spread my arms in DDLJ, and danced in "Chaiyya Chaiyya". Who am I?', 'Shah Rukh Khan', 'easy', '["I own Kolkata Knight Riders", "My wife is Gauri", "I live in Mannat"]'::jsonb, 100),
('bollywood', 'riddle', 'This 2001 film by Ashutosh Gowariker starred Aamir Khan as a cricket captain during British rule. What movie am I?', 'Lagaan', 'easy', '["I was nominated for Oscar", "I have a famous song Mitwa", "I am about cricket"]'::jsonb, 100),
('bollywood', 'riddle', 'I am known as the Shahenshah of Bollywood. My deep voice and towering personality made me legendary. Who am I?', 'Amitabh Bachchan', 'easy', '["I hosted KBC", "I was in Sholay", "My son is Abhishek"]'::jsonb, 100),

-- History
('history', 'riddle', 'I built the Taj Mahal in memory of my beloved wife Mumtaz Mahal. I was a Mughal emperor. Who am I?', 'Shah Jahan', 'easy', '["My son imprisoned me", "I ruled in the 1600s", "I am buried in the Taj Mahal"]'::jsonb, 100),
('history', 'riddle', 'This ancient wonder is the only one still standing. I am located in Egypt and was built for Pharaoh Khufu. What am I?', 'The Great Pyramid of Giza', 'easy', '["I am made of limestone", "The Sphinx is nearby", "I am over 4500 years old"]'::jsonb, 100),
('history', 'riddle', 'I led India to independence through non-violence. I organized the Salt March and fasted for peace. Who am I?', 'Mahatma Gandhi', 'easy', '["My birthday is October 2", "I was assassinated in 1948", "I am called Bapu"]'::jsonb, 100),

-- Mythology
('mythology', 'riddle', 'I am the Hindu god with an elephant head. I am the remover of obstacles and the god of beginnings. Who am I?', 'Ganesha', 'easy', '["My vehicle is a mouse", "I love modaks", "My father is Shiva"]'::jsonb, 100),
('mythology', 'riddle', 'I am the king of Greek gods. I rule from Mount Olympus and control thunder and lightning. Who am I?', 'Zeus', 'easy', '["My Roman name is Jupiter", "My weapon is a thunderbolt", "My wife is Hera"]'::jsonb, 100),
('mythology', 'riddle', 'In Hindu mythology, I am the avatar of Vishnu who lifted a mountain on my little finger. Who am I?', 'Krishna', 'easy', '["I spoke the Bhagavad Gita", "I played the flute", "Radha loved me"]'::jsonb, 100),

-- Science
('science', 'riddle', 'I developed the theory of relativity and won the Nobel Prize in Physics. My most famous equation is E=mc². Who am I?', 'Albert Einstein', 'easy', '["I had wild hair", "I was born in Germany", "My tongue photo is famous"]'::jsonb, 100),
('science', 'riddle', 'I am the largest planet in our solar system. I have a Great Red Spot and many moons. What planet am I?', 'Jupiter', 'easy', '["I am a gas giant", "I have at least 79 moons", "My red spot is a storm"]'::jsonb, 100),
('science', 'riddle', 'I discovered penicillin by accident in 1928, revolutionizing medicine. Who am I?', 'Alexander Fleming', 'medium', '["I am Scottish", "I noticed mold killing bacteria", "I won a Nobel Prize"]'::jsonb, 150),

-- Anime
('anime', 'riddle', 'I want to become Hokage someday! I have a nine-tailed fox sealed inside me and I love ramen. Who am I?', 'Naruto Uzumaki', 'easy', '["I wear an orange jumpsuit", "Believe it is my catchphrase", "Sasuke is my rival"]'::jsonb, 100),
('anime', 'riddle', 'This anime is about a boy who can stretch like rubber after eating a Devil Fruit. He wants to find the One Piece. What anime am I?', 'One Piece', 'easy', '["Luffy is the main character", "The Straw Hat Pirates", "Going Merry is a ship"]'::jsonb, 100),
('anime', 'riddle', 'I can kill anyone by writing their name in my Death Note. I want to create a new world. Who am I?', 'Light Yagami', 'medium', '["I am a genius student", "L is my rival", "Ryuk is a Shinigami"]'::jsonb, 150),

-- Cartoon
('cartoon', 'riddle', 'I live in a pineapple under the sea. I work at the Krusty Krab and love jellyfishing. Who am I?', 'SpongeBob SquarePants', 'easy', '["My best friend is Patrick", "I make Krabby Patties", "I live in Bikini Bottom"]'::jsonb, 100),
('cartoon', 'riddle', 'We are four teenage turtles named after Renaissance artists. We love pizza and fight crime. Who are we?', 'Teenage Mutant Ninja Turtles', 'easy', '["Our master is Splinter", "We fight Shredder", "We live in sewers"]'::jsonb, 100),
('cartoon', 'riddle', 'I am a genius mouse who tries to take over the world every night with my dimwitted friend. Who am I?', 'Pinky and the Brain', 'medium', '["We are laboratory mice", "Are you pondering what Im pondering?", "One is a genius, the other insane"]'::jsonb, 150),

-- Geography
('geography', 'riddle', 'I am the longest river in the world. I flow through Egypt and empty into the Mediterranean Sea. What river am I?', 'Nile River', 'easy', '["I am in Africa", "Ancient Egyptians depended on me", "I am over 4000 miles long"]'::jsonb, 100),
('geography', 'riddle', 'I am the largest country in the world by land area. I span 11 time zones. Which country am I?', 'Russia', 'easy', '["My capital is Moscow", "I was part of the Soviet Union", "I border both Europe and Asia"]'::jsonb, 100),
('geography', 'riddle', 'This mountain is the tallest in the world at 29,032 feet. Climbers risk their lives to reach my peak. What am I?', 'Mount Everest', 'easy', '["I am in the Himalayas", "I am on the Nepal-Tibet border", "Edmund Hillary climbed me first"]'::jsonb, 100),

-- Technology
('technology', 'riddle', 'I co-founded Apple and introduced the iPhone to the world. I gave presentations in black turtlenecks. Who am I?', 'Steve Jobs', 'easy', '["I was adopted", "I dropped out of college", "I returned to save Apple in 1997"]'::jsonb, 100),
('technology', 'riddle', 'I am a search engine that became a verb. My founders Larry and Sergey started me in a garage. What company am I?', 'Google', 'easy', '["My logo has 4 colors", "I own YouTube", "My parent company is Alphabet"]'::jsonb, 100),
('technology', 'riddle', 'I am the richest person in the world and founded Amazon. My rocket company is Blue Origin. Who am I?', 'Jeff Bezos', 'medium', '["I stepped down as Amazon CEO", "I own The Washington Post", "I started Amazon selling books"]'::jsonb, 150);
