-- Seed file for House337 team_members data

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert team members
INSERT INTO team_members (
  id, user_id, name, role, email, phone, bio, avatar, skills
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Josh Green',
  'Advertising and Communication Lead',
  'josh.green@house337.com',
  '+44 20 1234 5001',
  'Josh leads our Advertising and Communication practice, focusing on creating big transformative ideas that challenge the status quo and spark conversations.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f982076f892cd6cce340aa_Josh%20Green.jpg',
  ARRAY['Advertising', 'Brand Strategy', 'Creative Direction', 'Campaign Management']
),
(
  uuid_generate_v4(),
  user_uuid,
  'Louise Canham',
  'Fashion and Lifestyle Lead',
  'louise.canham@house337.com',
  '+44 20 1234 5002',
  'Louise heads our Fashion and Lifestyle division, helping brands become desirable in today''s culture by creating a center of gravity that draws people in.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/6759c7f0721780bca69ee46d_louu.png',
  ARRAY['Fashion Marketing', 'Lifestyle Branding', 'Cultural Trends', 'Brand Positioning']
),
(
  uuid_generate_v4(),
  user_uuid,
  'Lauren Estwick',
  'Sport Lead',
  'lauren.estwick@house337.com',
  '+44 20 1234 5003',
  'Lauren leads our Sport practice, combining creativity, commercial expertise and social responsibility to create positive impact for sports brands, sponsors and rights-holders.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f9ba102fa2163b5b9ca019_Lauren-Estwick.jpg',
  ARRAY['Sports Marketing', 'Partnership Strategy', 'Sponsorship Activation', 'Commercial Strategy']
),
(
  uuid_generate_v4(),
  user_uuid,
  'James Poulter',
  'AI Lead',
  'james.poulter@house337.com',
  '+44 20 1234 5004',
  'James heads our AI innovation program, helping clients understand and plan for the impact of AI through workshops, guided play and ongoing education.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/665dced1b13a33711758d937_jp.png',
  ARRAY['AI Strategy', 'Conversational AI', 'Voice Interfaces', 'Innovation Programs']
);

END $$; 