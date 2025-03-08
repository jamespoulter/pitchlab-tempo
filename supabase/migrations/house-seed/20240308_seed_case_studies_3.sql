-- Seed file for House337 case_studies data (part 3)

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert case studies (part 3)
INSERT INTO case_studies (
  id, user_id, title, client, industry, date, image_url, tags, challenge, solution, results,
  testimonial_quote, testimonial_author, testimonial_title, awards, key_features
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Made in the Royal Navy',
  'Royal Navy',
  'Government',
  '2022-09-15',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/650add181a33c7709fedb0fd_Navy_hero_1440px_2.webp',
  ARRAY['Recruitment', 'Brand Campaign', 'Government'],
  'The Royal Navy needed to attract a new generation of recruits by showcasing the unique opportunities and personal development offered by a naval career.',
  E'We developed the "Made in the Royal Navy" campaign, which focused on the transformative journey of naval personnel. Through authentic storytelling, the campaign highlighted how the Royal Navy shapes ordinary people into extraordinary individuals with valuable skills and experiences.',
  'The campaign led to a significant increase in recruitment applications, particularly among the target demographic of 16-24 year olds. It successfully shifted perceptions of naval careers and highlighted the personal growth opportunities available.',
  'This campaign captured the essence of what makes a career in the Royal Navy so special. It showed potential recruits not just what they would do, but who they could become.',
  'Captain John Smith',
  'Head of Recruitment, Royal Navy',
  ARRAY['Recruitment Campaign of the Year', 'Government Communication Excellence'],
  ARRAY['Personal transformation narrative', 'Authentic testimonials', 'Diverse representation', 'Clear career pathways']
);

END $$; 