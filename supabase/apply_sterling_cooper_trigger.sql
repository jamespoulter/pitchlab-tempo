-- Sterling Cooper Seed Trigger Manual Application
-- This file can be run in the Supabase SQL Editor to apply the Sterling Cooper seed trigger

-- First, create or replace the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert agency profile data
  INSERT INTO public.agency_profiles (
    id, user_id, name, email, phone, website, address, description, 
    founded, employees, industries, mission, vision, logo_url, 
    social_media, values
  ) VALUES (
    uuid_generate_v4(), 
    NEW.id,
    'Sterling Cooper',
    'info@sterlingcooper.com',
    '+1 212-555-1960',
    'https://www.sterlingcooper.com',
    '405 Madison Avenue, New York, NY 10017',
    'Sterling Cooper is a full-service advertising agency specializing in print, radio, and television campaigns. We pride ourselves on our creative approach to advertising and our ability to understand the consumer mindset.',
    '1923',
    '75+',
    ARRAY['Advertising', 'Marketing', 'Public Relations', 'Media Planning', 'Creative Services'],
    'To transform how America views products through innovative advertising that speaks to the modern consumer.',
    'To be the most influential advertising agency on Madison Avenue, setting the standard for creativity and effectiveness in the industry.',
    'https://example.com/sterling-cooper-logo.png',
    '{
      "instagram": "https://www.instagram.com/sterlingcooper",
      "linkedin": "https://www.linkedin.com/company/sterling-cooper",
      "twitter": "https://twitter.com/sterlingcooper"
    }',
    ARRAY['Creativity', 'Excellence', 'Tradition', 'Innovation', 'Client Service']
  );

  -- Insert agency branding data
  INSERT INTO public.agency_branding (
    id, user_id, colors, typography, logo_url, logo_dark_url, icon_url
  ) VALUES (
    uuid_generate_v4(),
    NEW.id,
    '[
      {"name": "Sterling Red", "hex": "#8B0000"},
      {"name": "Cooper Gold", "hex": "#D4AF37"},
      {"name": "Madison Blue", "hex": "#1A2B3C"},
      {"name": "Office White", "hex": "#F5F5F5"},
      {"name": "Whiskey Brown", "hex": "#7B3F00"}
    ]',
    '{
      "headings": "Garamond, serif",
      "body": "Times New Roman, serif"
    }',
    'https://example.com/sterling-cooper-logo.png',
    'https://example.com/sterling-cooper-logo-dark.png',
    'https://example.com/sterling-cooper-icon.png'
  );

  -- Insert agency credentials
  INSERT INTO public.agency_credentials (
    id, user_id, title, issuer, issue_date, description, credential_url, image_url
  ) VALUES
  (
    uuid_generate_v4(),
    NEW.id,
    'Advertising Age Agency of the Year',
    'Advertising Age',
    '1960-12-15',
    'Recognized for groundbreaking work with Lucky Strike and Bethlehem Steel campaigns',
    'https://example.com/adage-award',
    'https://example.com/adage-award.png'
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'CLIO Award Winner',
    'CLIO Awards',
    '1959-05-20',
    'Gold award for Belle Jolie Lipstick "Basket of Kisses" campaign',
    'https://example.com/clio-award',
    'https://example.com/clio-award.png'
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Madison Avenue Hall of Fame',
    'Madison Avenue Advertising Association',
    '1957-10-10',
    'Inducted for pioneering television advertising techniques',
    'https://example.com/hall-of-fame',
    'https://example.com/hall-of-fame.png'
  );

  -- Insert team members
  INSERT INTO public.team_members (
    id, user_id, name, role, email, phone, bio, avatar, skills
  ) VALUES
  (
    uuid_generate_v4(),
    NEW.id,
    'Don Draper',
    'Creative Director',
    'don.draper@sterlingcooper.com',
    '+1 212-555-1001',
    'Don is a creative genius with an uncanny ability to understand the consumer psyche. His campaigns have transformed numerous brands and set new standards in the industry.',
    'https://example.com/don-draper.jpg',
    ARRAY['Creative Direction', 'Copywriting', 'Pitching', 'Brand Strategy', 'Client Relations']
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Roger Sterling',
    'Senior Partner',
    'roger.sterling@sterlingcooper.com',
    '+1 212-555-1002',
    'Roger is a second-generation partner who excels at client relationships and business development. His charm and wit have secured many of the agency''s most prestigious accounts.',
    'https://example.com/roger-sterling.jpg',
    ARRAY['Account Management', 'Business Development', 'Client Relations', 'Negotiation', 'Leadership']
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Peggy Olson',
    'Senior Copywriter',
    'peggy.olson@sterlingcooper.com',
    '+1 212-555-1003',
    'Peggy has risen from secretary to become one of the agency''s most talented copywriters. Her fresh perspective and dedication to her craft have resulted in numerous successful campaigns.',
    'https://example.com/peggy-olson.jpg',
    ARRAY['Copywriting', 'Concept Development', 'Creative Thinking', 'Campaign Planning', 'Television Advertising']
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Joan Harris',
    'Office Manager',
    'joan.harris@sterlingcooper.com',
    '+1 212-555-1004',
    'Joan keeps the agency running smoothly with her exceptional organizational skills and understanding of office politics. She is an invaluable asset to the company''s operations.',
    'https://example.com/joan-harris.jpg',
    ARRAY['Office Management', 'Personnel Administration', 'Problem Solving', 'Client Relations', 'Organizational Leadership']
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Pete Campbell',
    'Account Executive',
    'pete.campbell@sterlingcooper.com',
    '+1 212-555-1005',
    'Pete is an ambitious account executive with a talent for identifying new business opportunities. His understanding of market trends has helped the agency stay ahead of the competition.',
    'https://example.com/pete-campbell.jpg',
    ARRAY['Account Management', 'New Business Development', 'Market Analysis', 'Client Presentations', 'Strategic Planning']
  );

  -- Insert services
  INSERT INTO public.services (
    id, user_id, name, description, features, priceRange, timeline, category, icon, deliverables, process, faq
  ) VALUES
  (
    uuid_generate_v4(),
    NEW.id,
    'Full-Service Advertising Campaigns',
    'Comprehensive advertising solutions that tell your brand''s story across multiple channels. Our campaigns are designed to capture attention, evoke emotion, and drive consumer action.',
    ARRAY['Market Research', 'Creative Concept Development', 'Media Planning & Buying', 'Campaign Production', 'Performance Analysis'],
    '$50,000 - $500,000',
    '8-16 weeks',
    'Advertising',
    'https://example.com/advertising-icon.png',
    ARRAY['Creative Brief', 'Campaign Strategy', 'Creative Assets', 'Media Plan', 'Performance Reports'],
    '[
      {"name": "Discovery", "description": "Understanding your brand, audience, and objectives through research and client interviews"},
      {"name": "Strategy", "description": "Developing a comprehensive campaign strategy based on consumer insights"},
      {"name": "Creative Development", "description": "Crafting compelling creative concepts that resonate with your target audience"},
      {"name": "Production", "description": "Producing high-quality campaign assets for all selected media channels"},
      {"name": "Implementation", "description": "Launching the campaign with ongoing optimization and reporting"}
    ]',
    '[
      {"question": "How do you measure campaign success?", "answer": "We establish clear metrics at the outset and provide detailed reports on reach, engagement, and sales impact."},
      {"question": "What makes your creative approach different?", "answer": "We focus on emotional storytelling that connects with consumers on a deeper level than our competitors."},
      {"question": "How do you stay current with changing media landscapes?", "answer": "Our media team constantly researches emerging channels and tests new approaches to ensure optimal campaign performance."}
    ]'
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Television Commercial Production',
    'From concept to screen, we create memorable television commercials that capture the essence of your brand and resonate with viewers. Our team handles every aspect of production to deliver polished, professional results.',
    ARRAY['Concept Development', 'Scriptwriting', 'Casting', 'Production Management', 'Post-Production'],
    '$25,000 - $200,000',
    '6-12 weeks',
    'Production',
    'https://example.com/tv-icon.png',
    ARRAY['Creative Concept', 'Production Script', 'Casting Recommendations', 'Final Commercial', 'Distribution Plan'],
    '[
      {"name": "Creative Brief", "description": "Establishing the commercial''s objectives, target audience, and key messages"},
      {"name": "Concept Development", "description": "Creating multiple creative concepts for client review and selection"},
      {"name": "Pre-Production", "description": "Planning all aspects of the shoot including casting, locations, and scheduling"},
      {"name": "Production", "description": "Managing the commercial shoot with our experienced production team"},
      {"name": "Post-Production", "description": "Editing, sound design, and finalizing the commercial for broadcast"}
    ]',
    '[
      {"question": "How long should my commercial be?", "answer": "We typically recommend 30-second spots for most campaigns, but can produce 15, 60, or custom length commercials based on your needs."},
      {"question": "Can you help with distribution to networks?", "answer": "Yes, our media team can handle all aspects of commercial placement and distribution."},
      {"question": "What if I need multiple versions of the same commercial?", "answer": "We can efficiently produce multiple cuts or variations during the same production to maximize your budget."}
    ]'
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Print Advertising Design',
    'Eye-catching print advertisements that stand out in magazines, newspapers, and billboards. Our designs combine striking visuals with compelling copy to create memorable brand impressions.',
    ARRAY['Concept Development', 'Copywriting', 'Graphic Design', 'Photography Direction', 'Print Production'],
    '$5,000 - $50,000',
    '2-6 weeks',
    'Design',
    'https://example.com/print-icon.png',
    ARRAY['Creative Concepts', 'Final Artwork', 'Production Files', 'Print Specifications', 'Placement Recommendations'],
    '[
      {"name": "Creative Brief", "description": "Defining the advertisement''s objectives, audience, and key messages"},
      {"name": "Concept Development", "description": "Creating multiple design concepts for client review"},
      {"name": "Design Refinement", "description": "Refining the selected concept with client feedback"},
      {"name": "Final Production", "description": "Preparing final artwork for various print specifications"},
      {"name": "Print Management", "description": "Coordinating with publishers and printers for optimal reproduction"}
    ]',
    '[
      {"question": "What print formats do you work with?", "answer": "We design for all print formats including magazine ads, newspaper insertions, billboards, posters, and direct mail."},
      {"question": "Do you handle the printing process?", "answer": "We can manage the entire printing process or provide print-ready files for your team to handle."},
      {"question": "How do you ensure color accuracy across different publications?", "answer": "We use industry-standard color management practices and can provide guidance for different printing conditions."}
    ]'
  );

  -- Insert case studies
  INSERT INTO public.case_studies (
    id, user_id, title, client, industry, date, image_url, tags, challenge, solution, results,
    testimonial_quote, testimonial_author, testimonial_title, team_members, technologies
  ) VALUES
  (
    uuid_generate_v4(),
    NEW.id,
    'Lucky Strike: "It''s Toasted" Campaign',
    'Lucky Strike',
    'Tobacco',
    '1960-03-15',
    'https://example.com/lucky-strike-case-study.jpg',
    ARRAY['Print Advertising', 'Radio', 'Brand Repositioning'],
    'Lucky Strike needed to differentiate itself in an increasingly competitive cigarette market while addressing growing health concerns among consumers.',
    'We created the iconic "It''s Toasted" campaign, shifting focus from health concerns to the unique toasting process that gives Lucky Strike its distinctive flavor. The campaign included print advertisements featuring sophisticated imagery and radio spots emphasizing the toasting process.',
    'The campaign resulted in a 30% increase in Lucky Strike sales within six months. Brand recognition increased by 45%, and Lucky Strike became the leading cigarette brand among urban professionals.',
    'Sterling Cooper''s innovative approach completely transformed our brand perception. The "It''s Toasted" campaign wasn''t just advertising—it was a complete reimagining of how consumers view our product.',
    'Lee Garner Jr.',
    'Vice President of Marketing, Lucky Strike',
    ARRAY['Don Draper', 'Peggy Olson'],
    ARRAY['Print Design', 'Radio Production', 'Photography']
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Bethlehem Steel: "Backbone of America" Campaign',
    'Bethlehem Steel',
    'Manufacturing',
    '1959-08-10',
    'https://example.com/bethlehem-steel-case-study.jpg',
    ARRAY['Television', 'Print Advertising', 'Corporate Identity'],
    'Bethlehem Steel was struggling with an outdated image and needed to position itself as an essential, modern component of America''s growing infrastructure.',
    'We developed the "Backbone of America" campaign, highlighting Bethlehem Steel''s crucial role in building the nation''s skyscrapers, bridges, and railways. The campaign included the company''s first television commercials, featuring dramatic footage of steel production and construction projects, alongside a series of double-page spreads in business publications.',
    'The campaign secured Bethlehem Steel''s position as the premier steel manufacturer for major construction projects. Contract bids increased by 25%, and the company reported a 15% increase in revenue the following fiscal year.',
    'Sterling Cooper understood exactly what we needed—not just advertising, but a complete repositioning that reminded America of our essential role in building this country. The results exceeded our expectations.',
    'Walter Veith',
    'CEO, Bethlehem Steel',
    ARRAY['Don Draper', 'Pete Campbell', 'Roger Sterling'],
    ARRAY['Television Production', 'Print Design', 'Industrial Photography']
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Belle Jolie: "Basket of Kisses" Campaign',
    'Belle Jolie',
    'Cosmetics',
    '1958-11-22',
    'https://example.com/belle-jolie-case-study.jpg',
    ARRAY['Print Advertising', 'Packaging Design', 'Consumer Research'],
    'Belle Jolie was losing market share to newer, more youthful cosmetic brands and needed to refresh its image to appeal to younger women while retaining its loyal customer base.',
    'Through innovative consumer research involving real women testing lipsticks, we discovered a compelling insight: women enjoyed the ritual of trying on lipstick and seeing their "kiss" on tissues. This led to the "Basket of Kisses" campaign, featuring elegant print advertisements showing colorful lipstick kisses and new packaging that emphasized the sensory experience of the product.',
    'Belle Jolie saw a 40% increase in sales among women aged 18-34 while maintaining its existing customer base. The campaign won a CLIO award for print advertising excellence, and the redesigned packaging became an industry standard.',
    'The research approach Sterling Cooper used revealed insights about our customers that we had never considered. The resulting campaign captured the essence of what makes lipstick special to women in a way that was both sophisticated and emotionally resonant.',
    'Eleanor Hayes',
    'Marketing Director, Belle Jolie',
    ARRAY['Peggy Olson', 'Don Draper', 'Joan Harris'],
    ARRAY['Consumer Research', 'Print Design', 'Packaging Design']
  );

  -- Insert testimonials
  INSERT INTO public.testimonials (
    id, user_id, client_name, client_company, client_role, content, rating, project_name, is_featured
  ) VALUES
  (
    uuid_generate_v4(),
    NEW.id,
    'Conrad Hilton',
    'Hilton Hotels',
    'President',
    'Sterling Cooper has transformed how we communicate with our guests. Their understanding of the international traveler''s mindset has helped us expand our brand globally with great success.',
    5,
    'Hilton International Launch Campaign',
    true
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Rachel Menken',
    'Menken''s Department Store',
    'Owner',
    'The team at Sterling Cooper brought fresh thinking to our traditional department store. Their campaign helped us attract a new generation of shoppers while honoring our heritage.',
    5,
    'Menken''s Rebranding Initiative',
    true
  ),
  (
    uuid_generate_v4(),
    NEW.id,
    'Jimmy Barrett',
    'Utz Potato Chips',
    'Brand Ambassador',
    'Working with Sterling Cooper on the Utz campaign was a blast! They knew exactly how to use my comedic persona to create advertisements that were funny and effective.',
    4,
    'Utz Celebrity Endorsement Campaign',
    false
  );
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the trigger exists and drop it if it does
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    EXECUTE 'DROP TRIGGER on_auth_user_created ON auth.users';
    RAISE NOTICE 'Existing trigger dropped.';
  END IF;
END
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add a comment to the function
COMMENT ON FUNCTION public.handle_new_user() IS 'This function seeds a new user''s profile with Sterling Cooper (Mad Men) agency data when they sign up. It populates agency_profiles, agency_branding, agency_credentials, team_members, services, case_studies, and testimonials tables.';

-- Test the trigger with a new user (uncomment to test)
-- INSERT INTO auth.users (id, email)
-- VALUES (gen_random_uuid(), 'test-user@example.com');

-- Check if data was created (uncomment to test)
-- SELECT * FROM public.agency_profiles ORDER BY created_at DESC LIMIT 1; 