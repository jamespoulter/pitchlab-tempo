-- Seed file for House337 services data (part 4)

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert services (part 4)
INSERT INTO services (
  id, user_id, name, description, features, priceRange, timeline, category, icon, deliverables, process, faq
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Not For Profit Campaigns',
  'We combine smart strategic thinking with brilliant creativity to tackle important social issues, creating provocative, boundary-busting work for not-for-profit organizations.',
  ARRAY['Cause Marketing', 'Fundraising Campaigns', 'Awareness Initiatives', 'Behavior Change Programs', 'Stakeholder Engagement'],
  '£20,000 - £150,000',
  '6-12 weeks',
  'Not for profit',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/65019732e652d83dd84efa3e_Eye.svg',
  ARRAY['Campaign Strategy', 'Creative Assets', 'Digital Content', 'PR Toolkit', 'Measurement Framework'],
  '[
    {"name": "Issue Understanding", "description": "Deep dive into the social issue and stakeholder landscape"},
    {"name": "Strategy Development", "description": "Creating an effective approach to drive change"},
    {"name": "Creative Development", "description": "Developing provocative, attention-grabbing creative"},
    {"name": "Production", "description": "Producing high-impact campaign assets"},
    {"name": "Activation", "description": "Launching and amplifying the campaign"}
  ]',
  '[
    {"question": "How do you approach sensitive social issues?", "answer": "We combine thorough research with stakeholder consultation to ensure our approach is both impactful and respectful."},
    {"question": "Can you work with limited budgets?", "answer": "Yes, we''re experienced in creating high-impact campaigns with not-for-profit budgets, focusing resources where they''ll have the most effect."},
    {"question": "How do you measure campaign success for social issues?", "answer": "We establish clear objectives at the outset, whether awareness, attitude change, or behavior change, and track appropriate metrics."}
  ]'
);

END $$; 