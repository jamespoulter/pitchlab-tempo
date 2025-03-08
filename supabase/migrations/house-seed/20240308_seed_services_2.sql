-- Seed file for House337 services data (part 2)

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert services (part 2)
INSERT INTO services (
  id, user_id, name, description, features, priceRange, timeline, category, icon, deliverables, process, faq
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Sports Marketing & Partnerships',
  'Our dedicated sports practice combines creativity, commercial expertise and social responsibility to create positive impact for sports brands, sponsors and rights-holders.',
  ARRAY['Partnership Strategy', 'Sponsorship Activation', 'Fan Engagement', 'Athlete Representation', 'Event Marketing'],
  '£30,000 - £250,000',
  '4-12 weeks',
  'Sport',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/6501973ae3d1f441fe0c2ca8_Bubble-2x2-rotation.svg',
  ARRAY['Partnership Strategy', 'Activation Playbook', 'Campaign Assets', 'Measurement Framework', 'Event Concepts'],
  '[
    {"name": "Opportunity Assessment", "description": "Evaluating partnership opportunities against brand objectives"},
    {"name": "Strategy Development", "description": "Creating a comprehensive partnership strategy"},
    {"name": "Creative Activation", "description": "Developing creative concepts to bring partnerships to life"},
    {"name": "Implementation", "description": "Executing activation plans across channels"},
    {"name": "Measurement", "description": "Tracking performance against KPIs"}
  ]',
  '[
    {"question": "How do you ensure authentic connections between brands and sports properties?", "answer": "We focus on finding genuine shared values and audience overlap to create partnerships that feel natural and credible."},
    {"question": "Can you help with both short-term activations and long-term partnerships?", "answer": "Yes, we develop strategies for both tactical activations and strategic long-term partnerships based on client objectives."},
    {"question": "How do you approach social responsibility in sports marketing?", "answer": "We believe sports has unique power to drive positive change, so we integrate purpose-driven elements into our partnership strategies."}
  ]'
),
(
  uuid_generate_v4(),
  user_uuid,
  'AI Innovation & Implementation',
  'We help you understand and plan for the impact of AI through workshops, guided play and ongoing education. We also provide specialist design and development of conversational AI interfaces.',
  ARRAY['AI Strategy Development', 'Conversational AI Design', 'Voice Interface Creation', 'Chatbot Development', 'AI Implementation Roadmap'],
  '£25,000 - £200,000',
  '4-16 weeks',
  'AI',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/6501974e0d632ff1b5a27ed8_4-rotation3.svg',
  ARRAY['AI Strategy Document', 'Conversational Design Specifications', 'Voice Interface Prototypes', 'Implementation Roadmap', 'Training Materials'],
  '[
    {"name": "Discovery & Education", "description": "Understanding your business needs and educating stakeholders on AI capabilities"},
    {"name": "Strategy Development", "description": "Creating a tailored AI strategy aligned with business objectives"},
    {"name": "Design & Prototyping", "description": "Designing and prototyping AI solutions"},
    {"name": "Development & Implementation", "description": "Building and implementing AI solutions"},
    {"name": "Optimization & Scaling", "description": "Continuously improving AI performance and expanding capabilities"}
  ]',
  '[
    {"question": "Do we need technical expertise to implement your AI solutions?", "answer": "No, we guide you through the entire process and can provide implementation support tailored to your technical capabilities."},
    {"question": "How do you ensure ethical AI implementation?", "answer": "We follow strict ethical guidelines for AI development, focusing on transparency, fairness, and user privacy."},
    {"question": "Can you integrate with our existing systems?", "answer": "Yes, we design solutions that integrate with your current technology stack, minimizing disruption."}
  ]'
);

END $$; 