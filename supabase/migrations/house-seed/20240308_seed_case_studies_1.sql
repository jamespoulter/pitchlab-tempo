-- Seed file for House337 case_studies data (part 1)

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert case studies (part 1)
INSERT INTO case_studies (
  id, user_id, title, client, industry, date, image_url, tags, challenge, solution, results,
  testimonial_quote, testimonial_author, testimonial_title, awards, key_features
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Creating a conversation about domestic abuse',
  'Women''s Aid',
  'Not For Profit',
  '2023-06-15',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f72f7f13955bc879b78950_WomensAid_hero_2600px.webp',
  ARRAY['Social Impact', 'Behavior Change', 'Awareness Campaign'],
  'Domestic abuse increases during major sporting events, but this issue often goes unaddressed. Women''s Aid needed to raise awareness of this connection in a way that would cut through during the World Cup.',
  E'We created the powerful "He\'s Coming Home" campaign, which used the familiar football anthem to highlight the fear many women feel when their partners return home after matches. The campaign featured stark imagery and messaging that contrasted sharply with typical World Cup celebrations.',
  'The campaign generated significant media coverage and public conversation about domestic abuse during the World Cup. It reached millions of people across social media and traditional news outlets, raising awareness of Women''s Aid''s support services.',
  'This campaign bravely confronted an uncomfortable truth and started vital conversations about domestic abuse during a time when many victims are at increased risk.',
  'Teresa Parker',
  'Head of Communications, Women''s Aid',
  ARRAY['Cannes Lions Bronze', 'Creative Circle Gold', 'British Arrows Silver'],
  ARRAY['Powerful message timing', 'Cultural relevance', 'Bold creative approach', 'Wide media coverage']
),
(
  uuid_generate_v4(),
  user_uuid,
  'Social-first content production',
  'THE OUT',
  'Automotive',
  '2023-04-20',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f72f6202774a2b3250a2f7_out2.webp',
  ARRAY['Social Media', 'Content Strategy', 'Brand Awareness'],
  'THE OUT, a premium car rental service, needed to build brand awareness and drive bookings through social media, standing out in a competitive market with a limited budget.',
  'We developed a social-first content strategy that showcased the premium experience of THE OUT while highlighting the freedom and adventure their service enables. The content featured aspirational destinations and experiences made possible with their luxury vehicles.',
  'The campaign significantly increased THE OUT''s social media following and engagement rates, leading to a substantial rise in bookings and app downloads. The content strategy established a distinctive brand voice in the rental market.',
  'House 337 understood exactly how to position our premium service in the social space, creating content that resonated with our target audience and drove real business results.',
  'Tom Fawcett',
  'Marketing Director, THE OUT',
  ARRAY['Social Media Marketing Award'],
  ARRAY['Premium positioning', 'Aspirational content', 'Clear call-to-action', 'Platform-specific optimization']
);

END $$; 