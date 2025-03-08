-- Seed file for case studies
-- This file adds three sample case studies to the database

-- Function to get the current authenticated user ID (for development purposes)
CREATE OR REPLACE FUNCTION get_test_user_id()
RETURNS UUID AS $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Try to get a user ID from the auth.users table
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  -- If no user exists, return a default UUID
  IF test_user_id IS NULL THEN
    test_user_id := '1a737665-e3bd-47f7-8cd2-c5d2937a9689'::UUID;
  END IF;
  
  RETURN test_user_id;
END;
$$ LANGUAGE plpgsql;

-- Case Study 1: E-commerce Redesign
INSERT INTO case_studies (
  user_id,
  title,
  client,
  industry,
  date,
  image_url,
  tags,
  challenge,
  solution,
  results,
  testimonial_quote,
  testimonial_author,
  testimonial_title,
  team_members,
  technologies,
  timeline,
  start_date,
  end_date,
  awards,
  project_url,
  budget,
  client_logo_url,
  key_features,
  metrics,
  video_url
) VALUES (
  get_test_user_id(),
  'E-commerce Redesign Boosts Conversion by 45%',
  'Fashion Retailer',
  'E-commerce',
  '2023-09-15',
  'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80',
  ARRAY['Web Design', 'UX/UI', 'Conversion Optimization'],
  'The client, a well-established fashion retailer, was experiencing a high cart abandonment rate of 78% and a conversion rate of only 1.2% on their e-commerce platform. Their existing website had an outdated design, slow loading times, and a complicated checkout process that frustrated users. Mobile users, who accounted for 65% of their traffic, had an even worse experience with a non-responsive design.',
  'Our team conducted extensive user research and competitive analysis to identify pain points in the customer journey. We redesigned the entire e-commerce experience with a focus on mobile-first design, simplified navigation, and an optimized checkout process. Key improvements included:

1. Streamlined product categorization and filtering
2. Enhanced product pages with better imagery and clearer information
3. Simplified 3-step checkout process
4. Improved site performance with 40% faster loading times
5. Personalized product recommendations
6. Responsive design optimized for all devices',
  'Within three months of launching the redesigned e-commerce platform, the client experienced:

• 45% increase in conversion rate (from 1.2% to 1.74%)
• 32% reduction in cart abandonment
• 28% increase in average order value
• 52% increase in mobile conversions
• 18% increase in time spent on site
• 40% decrease in page load time',
  'The redesign completely transformed our online business. Not only did we see immediate improvements in our conversion rates, but the enhanced user experience has led to increased customer satisfaction and loyalty.',
  'Sarah Johnson',
  'E-commerce Director, Fashion Retailer',
  ARRAY['Alex Chen - Lead UX Designer', 'Maria Rodriguez - UI Designer', 'James Wilson - Frontend Developer', 'Priya Patel - Backend Developer', 'David Kim - Project Manager'],
  ARRAY['React', 'Node.js', 'MongoDB', 'AWS', 'Figma', 'Google Analytics', 'Hotjar'],
  '12 weeks (June - September 2023)',
  '2023-06-01',
  '2023-09-15',
  ARRAY['Best E-commerce Design 2023 - WebAwards', 'UX Design Excellence - Commerce Awards'],
  'https://fashionretailer-example.com',
  '$75,000 - $100,000',
  'https://images.unsplash.com/photo-1583744946564-b52d01a7f418?w=200&q=80',
  ARRAY['Mobile-first responsive design', 'Streamlined checkout process', 'Advanced product filtering', 'Personalized recommendations', 'Real-time inventory updates'],
  '{"Conversion Rate": "45% increase", "Cart Abandonment": "32% reduction", "Mobile Conversions": "52% increase", "Page Load Time": "40% decrease", "Average Order Value": "28% increase"}',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
);

-- Case Study 2: Social Media Campaign
INSERT INTO case_studies (
  user_id,
  title,
  client,
  industry,
  date,
  image_url,
  tags,
  challenge,
  solution,
  results,
  testimonial_quote,
  testimonial_author,
  testimonial_title,
  team_members,
  technologies,
  timeline,
  start_date,
  end_date,
  awards,
  project_url,
  budget,
  client_logo_url,
  key_features,
  metrics,
  video_url
) VALUES (
  get_test_user_id(),
  'Social Media Campaign Increases Engagement by 78%',
  'Beverage Brand',
  'Food & Beverage',
  '2023-08-22',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
  ARRAY['Social Media', 'Content Strategy', 'Brand Awareness'],
  'The client, a premium beverage brand, was struggling to connect with younger demographics (18-34) and saw declining engagement rates across their social media channels. Their content was perceived as outdated and failed to resonate with their target audience, resulting in low brand awareness among potential new customers.',
  'We developed a comprehensive social media strategy focused on authentic storytelling and user-generated content. Our approach included:

1. Creating a cohesive visual identity across all platforms
2. Developing a content calendar with platform-specific strategies
3. Launching an influencer partnership program with 25 micro-influencers
4. Implementing interactive content formats (polls, quizzes, AR filters)
5. Establishing a community management framework for consistent engagement
6. Running targeted paid campaigns to amplify organic content',
  'The three-month campaign delivered exceptional results:

• 78% increase in overall social media engagement
• 156% growth in Instagram followers
• 43% increase in website traffic from social channels
• 22% improvement in brand sentiment metrics
• 35% increase in user-generated content
• 18% uplift in direct sales attributed to social media',
  'The campaign completely transformed our brand perception among younger audiences. The creative approach and strategic execution delivered results far beyond our expectations, establishing our brand as relevant and engaging in a crowded market.',
  'Michael Thompson',
  'Marketing Director, Beverage Brand',
  ARRAY['Emily Wong - Social Media Strategist', 'Carlos Mendez - Content Creator', 'Zoe Chen - Influencer Manager', 'Thomas Wright - Paid Media Specialist', 'Aisha Johnson - Community Manager'],
  ARRAY['Sprout Social', 'Canva', 'Adobe Creative Suite', 'Meta Business Suite', 'TikTok Ads Manager', 'Influencer Management Platform'],
  '3 months (May - August 2023)',
  '2023-05-15',
  '2023-08-22',
  ARRAY['Best Social Media Campaign - Beverage Industry Awards', 'Creative Excellence Award - Social Media Week'],
  'https://beveragebrand-campaign-example.com',
  '$50,000 - $75,000',
  'https://images.unsplash.com/photo-1581873372796-635b67ca2008?w=200&q=80',
  ARRAY['Custom AR filters', 'Interactive Instagram Stories', 'Influencer content series', 'User-generated content hub', 'Social media contests'],
  '{"Engagement Rate": "78% increase", "Follower Growth": "156% increase", "Website Traffic": "43% increase", "Brand Sentiment": "22% improvement", "Sales Attribution": "18% uplift"}',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
);

-- Case Study 3: SEO Strategy
INSERT INTO case_studies (
  user_id,
  title,
  client,
  industry,
  date,
  image_url,
  tags,
  challenge,
  solution,
  results,
  testimonial_quote,
  testimonial_author,
  testimonial_title,
  team_members,
  technologies,
  timeline,
  start_date,
  end_date,
  awards,
  project_url,
  budget,
  client_logo_url,
  key_features,
  metrics,
  video_url
) VALUES (
  get_test_user_id(),
  'SEO Strategy Drives 112% Increase in Organic Traffic',
  'Legal Services Firm',
  'Legal',
  '2023-07-10',
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800&q=80',
  ARRAY['SEO', 'Content Marketing', 'Analytics'],
  'The client, a mid-sized legal services firm specializing in corporate law, was struggling to generate leads through their website. Despite having quality content, they ranked poorly for key industry terms, had technical SEO issues affecting crawlability, and lacked a structured content strategy to target relevant keywords. Their organic traffic had plateaued for over a year.',
  'We implemented a comprehensive SEO strategy focused on technical optimization, content enhancement, and authority building:

1. Conducted a full technical SEO audit and fixed critical issues
2. Developed a keyword strategy targeting high-intent search terms
3. Created a content calendar with optimized practice area pages
4. Implemented schema markup for rich snippets
5. Built a backlink strategy focusing on legal directories and publications
6. Established a regular content publishing schedule with optimized blog posts
7. Set up advanced analytics tracking for lead attribution',
  'The six-month SEO campaign delivered transformative results:

• 112% increase in organic search traffic
• 87% improvement in keyword rankings for target terms
• 94% increase in organic lead generation
• 45% reduction in bounce rate
• 67% increase in pages per session
• 23% improvement in page load speed
• 5 featured snippets secured for high-value keywords',
  'The SEO strategy completely transformed our digital presence. We\'re now ranking for keywords we never thought possible, and more importantly, we\'re seeing a significant increase in qualified leads coming through our website. The ROI has been exceptional.',
  'Robert Chen',
  'Managing Partner, Legal Services Firm',
  ARRAY['Samantha Lee - SEO Strategist', 'Daniel Johnson - Content Strategist', 'Olivia Martinez - Technical SEO Specialist', 'Nathan Kim - Analytics Expert', 'Rachel Wong - Content Writer'],
  ARRAY['SEMrush', 'Ahrefs', 'Google Search Console', 'Google Analytics', 'Screaming Frog', 'WordPress', 'Yoast SEO'],
  '6 months (January - July 2023)',
  '2023-01-15',
  '2023-07-10',
  ARRAY['Best SEO Campaign - Legal Marketing Awards', 'Search Excellence Award - Digital Marketing Association'],
  'https://legalfirm-example.com',
  '$60,000 - $85,000',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&q=80',
  ARRAY['Technical SEO optimization', 'Content gap analysis', 'Schema markup implementation', 'Local SEO strategy', 'Competitor backlink analysis'],
  '{"Organic Traffic": "112% increase", "Keyword Rankings": "87% improvement", "Lead Generation": "94% increase", "Bounce Rate": "45% reduction", "Pages Per Session": "67% increase"}',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
);

-- Clean up the temporary function
DROP FUNCTION IF EXISTS get_test_user_id(); 