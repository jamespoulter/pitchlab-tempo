-- Seed file for House337 services data (part 3)

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert services (part 3)
INSERT INTO services (
  id, user_id, name, description, features, priceRange, timeline, category, icon, deliverables, process, faq
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Government Communications',
  'We deliver successful behavior change campaigns for government departments and bodies in the UK and internationally, with over a decade of significant experience.',
  ARRAY['Behavior Change Campaigns', 'Public Information Strategies', 'Digital Service Design', 'Stakeholder Engagement', 'Policy Communication'],
  '£50,000 - £500,000+',
  '12-24 weeks',
  'Government',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/650197528cbc0c9efaea4520_4-rotation4.svg',
  ARRAY['Communication Strategy', 'Campaign Assets', 'Digital Services', 'Measurement Framework', 'Stakeholder Toolkit'],
  '[
    {"name": "Research & Insight", "description": "Gathering deep insights into target audiences and behaviors"},
    {"name": "Strategy Development", "description": "Creating evidence-based communication strategies"},
    {"name": "Creative Development", "description": "Developing clear, impactful creative approaches"},
    {"name": "Implementation", "description": "Executing campaigns across appropriate channels"},
    {"name": "Evaluation", "description": "Measuring behavior change and campaign effectiveness"}
  ]',
  '[
    {"question": "How do you reach hard-to-access audiences?", "answer": "We work with specialist partners and use targeted approaches to connect with distinct audiences that are typically difficult to reach."},
    {"question": "How do you measure behavior change?", "answer": "We use a combination of attitudinal tracking, behavioral metrics, and outcome measures to evaluate real-world impact."},
    {"question": "Can you work within government procurement frameworks?", "answer": "Yes, we have extensive experience working within various government procurement frameworks and compliance requirements."}
  ]'
),
(
  uuid_generate_v4(),
  user_uuid,
  'Customer Experience Design',
  'We make customer interactions better and easier across multiple channels, touchpoints and technologies, helping your brand and its customers get closer.',
  ARRAY['Experience Strategy', 'Service Design', 'Digital Product Development', 'CX Measurement', 'Loyalty Program Design'],
  '£40,000 - £300,000',
  '8-20 weeks',
  'Experience',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/65019716d5d3076461632264_Bubble.svg',
  ARRAY['Experience Strategy', 'Service Blueprints', 'Digital Products', 'CX Measurement Framework', 'Implementation Roadmap'],
  '[
    {"name": "Discovery", "description": "Understanding customer needs, pain points, and business objectives"},
    {"name": "Experience Mapping", "description": "Mapping current and ideal customer journeys"},
    {"name": "Concept Development", "description": "Creating concepts for improved experiences"},
    {"name": "Prototyping & Testing", "description": "Building and testing experience prototypes with real users"},
    {"name": "Implementation", "description": "Delivering and optimizing new customer experiences"}
  ]',
  '[
    {"question": "How do you balance customer needs with business objectives?", "answer": "We focus on finding the sweet spot where improved customer experiences drive business results, creating win-win solutions."},
    {"question": "Can you work with our existing technology stack?", "answer": "Yes, we design solutions that work with your current systems while planning for future evolution."},
    {"question": "How do you measure CX improvements?", "answer": "We establish baseline metrics and track improvements across satisfaction, effort, loyalty, and business outcomes."}
  ]'
);

END $$; 