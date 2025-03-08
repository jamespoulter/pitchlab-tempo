-- Seed file for House337 case_studies data (part 2)

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert case studies (part 2)
INSERT INTO case_studies (
  id, user_id, title, client, industry, date, image_url, tags, challenge, solution, results,
  testimonial_quote, testimonial_author, testimonial_title, awards, key_features
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Sky Net Zero by 2030',
  'Sky',
  'Media & Entertainment',
  '2022-11-10',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/6501935f987ff646a32bbad2_SkyZero_Hero_2600.webp',
  ARRAY['Sustainability', 'Brand Purpose', 'Corporate Responsibility'],
  'Sky needed to communicate their ambitious commitment to become net zero carbon by 2030 in a way that would resonate with consumers and inspire action.',
  E'We created the "Sky Zero" campaign featuring actress Lily James, which dramatized the urgency of climate action through powerful visuals and storytelling. The campaign highlighted Sky\'s concrete commitments while encouraging viewers to join the journey toward a more sustainable future.',
  'The campaign successfully positioned Sky as a leader in corporate sustainability, increasing positive brand perception and awareness of their environmental commitments. It also drove engagement with Sky''s sustainability initiatives.',
  'This campaign perfectly captured our determination to make a real difference in the fight against climate change, communicating our commitments in a way that was both emotionally resonant and credible.',
  'Fiona Ball',
  'Group Director of Bigger Picture, Sky',
  ARRAY['Environmental Campaign Award', 'Corporate Responsibility Excellence'],
  ARRAY['Celebrity ambassador', 'Emotional storytelling', 'Clear commitments', 'Call to collective action']
),
(
  uuid_generate_v4(),
  user_uuid,
  'Making fashion fit for all',
  'Simply Be',
  'Fashion',
  '2023-03-08',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f72edf8427d6b4bb0b4fdc_Simply-be_hero_2600px.webp',
  ARRAY['Fashion', 'Inclusivity', 'Body Positivity'],
  'Simply Be needed to strengthen their position as champions of inclusive fashion in a market increasingly claiming to cater to all body types, while driving sales and brand preference.',
  E'We created the "We Are All The Same Size" campaign, which challenged the fashion industry\'s approach to sizing and celebrated body diversity. The campaign featured real women of various body types and highlighted Simply Be\'s commitment to designing clothes that fit and flatter all women.',
  'The campaign drove significant engagement on social media, with thousands of women sharing their own experiences with fashion sizing. It led to increased website traffic, higher conversion rates, and strengthened Simply Be''s position as a leader in inclusive fashion.',
  'This campaign perfectly captured our brand ethos and resonated deeply with our audience. It wasn''t just about selling clothes, but about creating a movement that empowers women of all sizes.',
  'Nicola Tibbs',
  'Brand Director, Simply Be',
  ARRAY['Fashion Marketing Award', 'Inclusive Advertising Excellence'],
  ARRAY['Body positivity message', 'Authentic representation', 'Social movement creation', 'Product integration']
);

END $$; 