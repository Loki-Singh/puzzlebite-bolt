/*
  # Restore MCQ-based Puzzles

  1. Changes
    - Update puzzles table to support MCQ format
    - Add options column for multiple choice answers
    - Replace riddle content with MCQ content for all categories
  
  2. New Structure
    - Each puzzle has 4 options (A, B, C, D)
    - Correct answer is stored as the option letter
    - Questions are category-specific MCQs
*/

-- Add options column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'puzzles' AND column_name = 'options'
  ) THEN
    ALTER TABLE puzzles ADD COLUMN options jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Clear existing puzzles
DELETE FROM puzzles;

-- Insert MCQ puzzles for each category
INSERT INTO puzzles (category, type, question, answer, options, difficulty, hints, points) VALUES

-- IPL
('ipl', 'mcq', 'In which year was the first IPL tournament held?', 'B', '["A) 2007", "B) 2008", "C) 2009", "D) 2010"]'::jsonb, 'easy', '["It was held after the 2007 T20 World Cup", "It started in April", "BCCI organized it"]'::jsonb, 100),
('ipl', 'mcq', 'Who holds the record for the highest individual score in Test cricket by an Indian batsman?', 'C', '["A) Sachin Tendulkar", "B) Virender Sehwag", "C) Karun Nair", "D) Virat Kohli"]'::jsonb, 'medium', '["He scored a triple century", "It was 303 not out", "He plays for Karnataka"]'::jsonb, 150),
('ipl', 'mcq', 'Which team has won the most IPL titles?', 'A', '["A) Mumbai Indians", "B) Chennai Super Kings", "C) Kolkata Knight Riders", "D) Sunrisers Hyderabad"]'::jsonb, 'easy', '["They have won 5 titles", "Their captain is Rohit Sharma", "They play in blue and gold"]'::jsonb, 100),

-- FIFA
('fifa', 'mcq', 'Which country has won the most FIFA World Cups?', 'B', '["A) Germany", "B) Brazil", "C) Argentina", "D) Italy"]'::jsonb, 'easy', '["They have won 5 times", "They wear yellow jerseys", "Pele played for them"]'::jsonb, 100),
('fifa', 'mcq', 'Who won the FIFA World Cup in 2018?', 'D', '["A) Brazil", "B) Germany", "C) Argentina", "D) France"]'::jsonb, 'easy', '["Mbappe played for them", "They beat Croatia in the final", "Their coach was Deschamps"]'::jsonb, 100),
('fifa', 'mcq', 'Which player has won the most Ballon d''Or awards?', 'A', '["A) Lionel Messi", "B) Cristiano Ronaldo", "C) Michel Platini", "D) Johan Cruyff"]'::jsonb, 'medium', '["He has won 8 times", "He plays for Inter Miami", "He is from Argentina"]'::jsonb, 150),

-- Music
('music', 'mcq', 'Who is known as the "King of Pop"?', 'B', '["A) Elvis Presley", "B) Michael Jackson", "C) Prince", "D) Madonna"]'::jsonb, 'easy', '["He did the moonwalk", "He sang Thriller", "He wore one glove"]'::jsonb, 100),
('music', 'mcq', 'Which band released the album "Abbey Road"?', 'A', '["A) The Beatles", "B) The Rolling Stones", "C) Led Zeppelin", "D) Pink Floyd"]'::jsonb, 'medium', '["They are from Liverpool", "They broke up in 1970", "John Lennon was a member"]'::jsonb, 150),
('music', 'mcq', 'Who sang "Bohemian Rhapsody"?', 'C', '["A) David Bowie", "B) Elton John", "C) Queen", "D) The Who"]'::jsonb, 'easy', '["Freddie Mercury was the lead", "It is 6 minutes long", "Released in 1975"]'::jsonb, 100),

-- Hollywood
('hollywood', 'mcq', 'Which movie won the Oscar for Best Picture in 1994?', 'B', '["A) Pulp Fiction", "B) Forrest Gump", "C) The Shawshank Redemption", "D) The Lion King"]'::jsonb, 'medium', '["Tom Hanks starred in it", "Life is like a box of chocolates", "It won 6 Oscars"]'::jsonb, 150),
('hollywood', 'mcq', 'Who directed "The Dark Knight"?', 'C', '["A) Steven Spielberg", "B) Quentin Tarantino", "C) Christopher Nolan", "D) Martin Scorsese"]'::jsonb, 'easy', '["He also directed Inception", "He is British", "He directed Oppenheimer"]'::jsonb, 100),
('hollywood', 'mcq', 'Which actor played Iron Man in the MCU?', 'A', '["A) Robert Downey Jr.", "B) Chris Evans", "C) Chris Hemsworth", "D) Mark Ruffalo"]'::jsonb, 'easy', '["He also played Sherlock Holmes", "He started the MCU", "He said I am Iron Man"]'::jsonb, 100),

-- Bollywood
('bollywood', 'mcq', 'Who is known as the "King of Bollywood"?', 'A', '["A) Shah Rukh Khan", "B) Amitabh Bachchan", "C) Salman Khan", "D) Aamir Khan"]'::jsonb, 'easy', '["He owns KKR", "He lives in Mannat", "He starred in DDLJ"]'::jsonb, 100),
('bollywood', 'mcq', 'Which movie won India''s first Oscar nomination?', 'C', '["A) Mughal-e-Azam", "B) Mother India", "C) Lagaan", "D) 3 Idiots"]'::jsonb, 'medium', '["It is about cricket", "Aamir Khan starred in it", "Released in 2001"]'::jsonb, 150),
('bollywood', 'mcq', 'Who directed the movie "3 Idiots"?', 'B', '["A) Karan Johar", "B) Rajkumar Hirani", "C) Sanjay Leela Bhansali", "D) Zoya Akhtar"]'::jsonb, 'medium', '["He also directed PK", "He directed Munna Bhai", "He worked with Aamir Khan"]'::jsonb, 150),

-- History
('history', 'mcq', 'In which year did India gain independence?', 'C', '["A) 1945", "B) 1946", "C) 1947", "D) 1948"]'::jsonb, 'easy', '["It was after World War 2", "Gandhi led the movement", "August 15th"]'::jsonb, 100),
('history', 'mcq', 'Who built the Taj Mahal?', 'B', '["A) Akbar", "B) Shah Jahan", "C) Aurangzeb", "D) Jahangir"]'::jsonb, 'easy', '["For his wife Mumtaz", "Mughal emperor", "In Agra"]'::jsonb, 100),
('history', 'mcq', 'Which ancient wonder is still standing today?', 'A', '["A) Great Pyramid of Giza", "B) Hanging Gardens of Babylon", "C) Colossus of Rhodes", "D) Lighthouse of Alexandria"]'::jsonb, 'medium', '["In Egypt", "Built for Pharaoh Khufu", "Over 4500 years old"]'::jsonb, 150),

-- Mythology
('mythology', 'mcq', 'Who is the king of Greek gods?', 'A', '["A) Zeus", "B) Poseidon", "C) Hades", "D) Apollo"]'::jsonb, 'easy', '["God of thunder", "Lives on Mount Olympus", "His Roman name is Jupiter"]'::jsonb, 100),
('mythology', 'mcq', 'Who is the Hindu god with an elephant head?', 'C', '["A) Hanuman", "B) Shiva", "C) Ganesha", "D) Vishnu"]'::jsonb, 'easy', '["Remover of obstacles", "His vehicle is a mouse", "Loves modaks"]'::jsonb, 100),
('mythology', 'mcq', 'In Hindu mythology, who is the preserver god?', 'B', '["A) Brahma", "B) Vishnu", "C) Shiva", "D) Indra"]'::jsonb, 'medium', '["Has 10 avatars", "Krishna is his avatar", "Rides on Garuda"]'::jsonb, 150),

-- Science
('science', 'mcq', 'What is the largest planet in our solar system?', 'C', '["A) Saturn", "B) Earth", "C) Jupiter", "D) Neptune"]'::jsonb, 'easy', '["It is a gas giant", "Has a Great Red Spot", "Has many moons"]'::jsonb, 100),
('science', 'mcq', 'Who developed the theory of relativity?', 'A', '["A) Albert Einstein", "B) Isaac Newton", "C) Stephen Hawking", "D) Nikola Tesla"]'::jsonb, 'easy', '["E=mc²", "Won Nobel Prize", "Had wild hair"]'::jsonb, 100),
('science', 'mcq', 'What is the speed of light?', 'B', '["A) 299,792 km/s", "B) 299,792,458 m/s", "C) 300,000 km/s", "D) 186,000 mph"]'::jsonb, 'hard', '["About 300,000 km/s", "Constant in vacuum", "Represented by c"]'::jsonb, 200),

-- Anime
('anime', 'mcq', 'Who wants to become Hokage?', 'A', '["A) Naruto Uzumaki", "B) Sasuke Uchiha", "C) Sakura Haruno", "D) Kakashi Hatake"]'::jsonb, 'easy', '["Has nine-tailed fox", "Loves ramen", "Wears orange"]'::jsonb, 100),
('anime', 'mcq', 'What is Luffy''s goal in One Piece?', 'C', '["A) Become a Marine", "B) Defeat all pirates", "C) Find the One Piece", "D) Rule the world"]'::jsonb, 'easy', '["He wants to be Pirate King", "He has a straw hat", "Ate a Devil Fruit"]'::jsonb, 100),
('anime', 'mcq', 'What is Light Yagami''s weapon in Death Note?', 'B', '["A) Sword", "B) Death Note", "C) Gun", "D) Magic"]'::jsonb, 'easy', '["A notebook", "Write names to kill", "Ryuk is a Shinigami"]'::jsonb, 100),

-- Cartoon
('cartoon', 'mcq', 'Where does SpongeBob SquarePants live?', 'B', '["A) Under a rock", "B) In a pineapple", "C) In a shell", "D) In a boat"]'::jsonb, 'easy', '["Under the sea", "In Bikini Bottom", "Works at Krusty Krab"]'::jsonb, 100),
('cartoon', 'mcq', 'What are the Teenage Mutant Ninja Turtles named after?', 'A', '["A) Renaissance artists", "B) Greek gods", "C) Planets", "D) Colors"]'::jsonb, 'medium', '["Leonardo, Raphael, etc", "Italian artists", "Their master is Splinter"]'::jsonb, 150),
('cartoon', 'mcq', 'Who is Mickey Mouse''s girlfriend?', 'C', '["A) Daisy Duck", "B) Clarabelle", "C) Minnie Mouse", "D) Pluto"]'::jsonb, 'easy', '["Also a mouse", "Wears a bow", "Created by Disney"]'::jsonb, 100),

-- Geography
('geography', 'mcq', 'What is the longest river in the world?', 'A', '["A) Nile River", "B) Amazon River", "C) Yangtze River", "D) Mississippi River"]'::jsonb, 'easy', '["In Africa", "Flows through Egypt", "Over 4000 miles"]'::jsonb, 100),
('geography', 'mcq', 'Which is the largest country by land area?', 'A', '["A) Russia", "B) Canada", "C) China", "D) United States"]'::jsonb, 'easy', '["Spans 11 time zones", "Capital is Moscow", "In Europe and Asia"]'::jsonb, 100),
('geography', 'mcq', 'What is the tallest mountain in the world?', 'B', '["A) K2", "B) Mount Everest", "C) Kangchenjunga", "D) Lhotse"]'::jsonb, 'easy', '["In the Himalayas", "29,032 feet tall", "Nepal-Tibet border"]'::jsonb, 100),

-- Technology
('technology', 'mcq', 'Who founded Apple Inc.?', 'A', '["A) Steve Jobs", "B) Bill Gates", "C) Elon Musk", "D) Mark Zuckerberg"]'::jsonb, 'easy', '["Wore black turtleneck", "Introduced iPhone", "Co-founded with Wozniak"]'::jsonb, 100),
('technology', 'mcq', 'What does "AI" stand for?', 'B', '["A) Advanced Internet", "B) Artificial Intelligence", "C) Automated Information", "D) Algorithmic Integration"]'::jsonb, 'easy', '["Related to machines", "Learning and reasoning", "Used in ChatGPT"]'::jsonb, 100),
('technology', 'mcq', 'Which company developed the Android operating system?', 'C', '["A) Apple", "B) Microsoft", "C) Google", "D) Samsung"]'::jsonb, 'medium', '["Search engine company", "Bought it in 2005", "Owns YouTube"]'::jsonb, 150);
