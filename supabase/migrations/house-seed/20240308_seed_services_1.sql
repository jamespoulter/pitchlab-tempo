-- Seed file for House337 services data (part 1)

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert services (part 1)
INSERT INTO services (
  id, user_id, name, description, features, priceRange, timeline, category, icon, deliverables, process, faq
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Advertising & Communications',
  'We create big transformative ideas that challenge the status quo, confront norms, and spark conversations. Our work creates positive change for some of the world''s largest brands.',
  ARRAY['Brand Strategy Development', 'Creative Campaign Ideation', 'Integrated Media Planning', 'Content Production', 'Performance Measurement'],
  '£50,000 - £500,000+',
  '8-16 weeks',
  'Advertising',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/65019732e652d83dd84efa3e_Eye.svg',
  ARRAY['Brand Strategy Document', 'Creative Campaign Assets', 'Media Plan', 'Content Calendar', 'Performance Analytics Dashboard'],
  '[
    {"name": "Discovery", "description": "Understanding your brand, audience, and objectives through workshops and research"},
    {"name": "Strategy", "description": "Developing a comprehensive brand and communications strategy"},
    {"name": "Creative Development", "description": "Ideating and refining creative concepts that align with strategy"},
    {"name": "Production", "description": "Producing high-quality campaign assets across required channels"},
    {"name": "Implementation", "description": "Launching the campaign with ongoing optimization"}
  ]',
  '[
    {"question": "How do you measure campaign success?", "answer": "We establish clear KPIs at the outset and use a combination of brand metrics, engagement data, and conversion tracking to measure performance."},
    {"question": "What makes your creative approach different?", "answer": "We focus on transformative ideas that challenge norms while creating positive change, holding our work to the highest standards."},
    {"question": "How do you ensure campaigns reach the right audience?", "answer": "We combine deep audience insights with strategic media planning to ensure campaigns connect with the right people at the right time."}
  ]'
),
(
  uuid_generate_v4(),
  user_uuid,
  'Fashion & Lifestyle Brand Development',
  'We make brands desirable in the culture of today. In an industry experiencing seismic change, we help brands create a center of gravity that draws people in and authentically inject themselves into the cultural zeitgeist.',
  ARRAY['Brand Positioning', 'Cultural Trend Analysis', 'Visual Identity Development', 'Content Strategy', 'Influencer Partnerships'],
  '£40,000 - £300,000',
  '6-12 weeks',
  'Fashion',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/6501973f4883643ade2d2dc4_4-rotation5.svg',
  ARRAY['Brand Strategy', 'Visual Identity System', 'Content Playbook', 'Campaign Assets', 'Launch Plan'],
  '[
    {"name": "Cultural Immersion", "description": "Deep dive into relevant cultural trends and audience behaviors"},
    {"name": "Brand Positioning", "description": "Defining a distinctive and relevant position in the market"},
    {"name": "Identity Creation", "description": "Developing visual and verbal identity elements"},
    {"name": "Content Strategy", "description": "Creating a framework for ongoing content creation"},
    {"name": "Activation", "description": "Launching the brand into culture with impact"}
  ]',
  '[
    {"question": "How do you stay on top of rapidly changing fashion trends?", "answer": "We have dedicated trend researchers and cultural analysts who constantly monitor shifts in the fashion landscape."},
    {"question": "Can you work with both established and emerging brands?", "answer": "Yes, we tailor our approach based on brand maturity, working with both heritage brands needing rejuvenation and new brands seeking to establish themselves."},
    {"question": "How do you approach sustainability in fashion branding?", "answer": "We integrate sustainable thinking throughout our process, helping brands authentically communicate their values while avoiding greenwashing."}
  ]'
);

END $$; 