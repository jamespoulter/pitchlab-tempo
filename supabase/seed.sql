-- House337 Seed Data
-- This file combines all seed data for House337 agency

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

-- Insert agency branding data
INSERT INTO agency_branding (
  id, user_id, colors, typography, logo_url, logo_dark_url, icon_url
) VALUES (
  uuid_generate_v4(),
  user_uuid,
  '[
    {"name": "Primary Pink", "hex": "#FF3366"},
    {"name": "Dark Grey", "hex": "#333333"},
    {"name": "Light Grey", "hex": "#F5F5F5"},
    {"name": "White", "hex": "#FFFFFF"}
  ]',
  '{
    "headings": "Montserrat, sans-serif",
    "body": "Roboto, sans-serif"
  }',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64de46800fa67627c8c9b43d_DarkGrey%2BPink.svg',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64df2e37cc50773e850896eb_White%2BPink.svg',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/65019716d5d3076461632264_Bubble.svg'
);

-- Insert agency credentials
INSERT INTO agency_credentials (
  id, user_id, title, issuer, issue_date, description, credential_url, image_url
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Cannes Lions Award Winner',
  'Cannes Lions International Festival of Creativity',
  '2023-06-22',
  'Awarded 1 Titanium, 1 Gold, 2 Silver, and 4 Bronze Lions for creative excellence',
  'https://www.canneslions.com/',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64de1ed9bdc6608fe06e8376_White.svg'
),
(
  uuid_generate_v4(),
  user_uuid,
  'Creative Circle Award Winner',
  'Creative Circle',
  '2023-05-15',
  'Named Most Creative Company with 22 Gold, 9 Silver, and 10 Bronze awards',
  'https://www.creativecircle.co.uk/',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64de1ee92c3d66ea6133963f_Black.svg'
),
(
  uuid_generate_v4(),
  user_uuid,
  'British Arrows Award Winner',
  'British Arrows',
  '2023-03-10',
  'Received 1 Special, 4 Gold, 3 Silver, and 4 Bronze awards',
  'https://www.britisharrows.com/',
  'https://cdn.prod.website-files.com/64d0bd7f558d601cbfa0fd3a/64f9d838ec1468911af77c03_British-arrows.svg'
);

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
),
(
  uuid_generate_v4(),
  user_uuid,
  'Di Gracie',
  'Government Lead',
  'di.gracie@house337.com',
  '+44 20 1234 5005',
  'Di leads our Government practice, delivering successful behavior change campaigns for government departments and bodies in the UK and internationally.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f9ba1af096159d713f4fdb_Diane%20Gracie.jpg',
  ARRAY['Government Communications', 'Behavior Change', 'Public Sector', 'Campaign Strategy']
),
(
  uuid_generate_v4(),
  user_uuid,
  'James Thornett',
  'Customer Experience Lead',
  'james.thornett@house337.com',
  '+44 20 1234 5006',
  'James leads our Customer Experience team, making brand interactions better and easier across multiple channels, touchpoints and technologies.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f9963df7226b7257dd2f8c_James-Thornett.jpg',
  ARRAY['Customer Experience', 'Digital Strategy', 'UX/UI Design', 'Service Design']
),
(
  uuid_generate_v4(),
  user_uuid,
  'Georgie Murray Burton',
  'Not For Profit Lead',
  'georgie.murray-burton@house337.com',
  '+44 20 1234 5007',
  'Georgie leads our Not For Profit work, combining smart strategic thinking with brilliant creativity to tackle important social issues.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f9ba03ded0ae78181acdee_Georgie%20Murry-Burton.jpg',
  ARRAY['Social Impact', 'Cause Marketing', 'Non-profit Strategy', 'Purpose-driven Campaigns']
);

-- Insert services
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

-- Insert more services
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

-- Insert final services
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

-- Insert case studies with proper quote escaping
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