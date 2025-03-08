-- Seed file for House337 agency_profiles data

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert agency profile data
INSERT INTO agency_profiles (
  id, user_id, name, email, phone, website, address, description, 
  founded, employees, industries, mission, vision, logo_url, 
  social_media, values
) VALUES (
  uuid_generate_v4(), 
  user_uuid,
  'House 337',
  'info@house337.com',
  '+44 20 1234 5678',
  'https://www.house337.com',
  '60 Great Portland Street, London W1W 7RT',
  'House 337 is home to a diverse family of experts offering multi-disciplined solutions to Make Better. We focus on big transformative ideas fuelled by fierce curiosity and boundless empathy, creating positive change for some of the world''s largest brands.',
  '2022',
  '250+',
  ARRAY['Advertising', 'Fashion', 'Sport', 'AI', 'Government', 'Customer Experience', 'Not For Profit'],
  'To Make Better through transformative ideas that challenge the status quo, confront norms, and spark conversations.',
  'To be the home for diverse experts creating positive change for brands and society.',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64de46800fa67627c8c9b43d_DarkGrey%2BPink.svg',
  '{
    "instagram": "https://www.instagram.com/house337/",
    "linkedin": "https://uk.linkedin.com/company/house337",
    "youtube": "https://www.youtube.com/channel/UC1YXLKZ5U6ygNsM-aMjRUWg"
  }',
  ARRAY['Creativity', 'Diversity', 'Innovation', 'Empathy', 'Excellence']
);

END $$; 