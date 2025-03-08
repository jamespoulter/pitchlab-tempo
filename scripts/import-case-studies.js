// Import case studies for the current user
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse environment variables
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey ? "Found (not showing for security)" : "Not found");

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importCaseStudies() {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return;
    }
    
    console.log("Current user ID:", user.id);
    
    // Case study data
    const caseStudies = [
      {
        user_id: user.id,
        title: 'E-commerce Redesign Boosts Conversion by 45%',
        client: 'Fashion Retailer',
        industry: 'E-commerce',
        date: '2023-09-15',
        image_url: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80',
        tags: ['Web Design', 'UX/UI', 'Conversion Optimization'],
        challenge: 'The client, a well-established fashion retailer, was experiencing a high cart abandonment rate of 78% and a conversion rate of only 1.2% on their e-commerce platform. Their existing website had an outdated design, slow loading times, and a complicated checkout process that frustrated users. Mobile users, who accounted for 65% of their traffic, had an even worse experience with a non-responsive design.',
        solution: 'Our team conducted extensive user research and competitive analysis to identify pain points in the customer journey. We redesigned the entire e-commerce experience with a focus on mobile-first design, simplified navigation, and an optimized checkout process. Key improvements included:\n\n1. Streamlined product categorization and filtering\n2. Enhanced product pages with better imagery and clearer information\n3. Simplified 3-step checkout process\n4. Improved site performance with 40% faster loading times\n5. Personalized product recommendations\n6. Responsive design optimized for all devices',
        results: 'Within three months of launching the redesigned e-commerce platform, the client experienced:\n\n• 45% increase in conversion rate (from 1.2% to 1.74%)\n• 32% reduction in cart abandonment\n• 28% increase in average order value\n• 52% increase in mobile conversions\n• 18% increase in time spent on site\n• 40% decrease in page load time',
        testimonial_quote: 'The redesign completely transformed our online business. Not only did we see immediate improvements in our conversion rates, but the enhanced user experience has led to increased customer satisfaction and loyalty.',
        testimonial_author: 'Sarah Johnson',
        testimonial_title: 'E-commerce Director, Fashion Retailer',
        team_members: ['Alex Chen - Lead UX Designer', 'Maria Rodriguez - UI Designer', 'James Wilson - Frontend Developer', 'Priya Patel - Backend Developer', 'David Kim - Project Manager'],
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Figma', 'Google Analytics', 'Hotjar'],
        timeline: '12 weeks (June - September 2023)',
        start_date: '2023-06-01',
        end_date: '2023-09-15',
        awards: ['Best E-commerce Design 2023 - WebAwards', 'UX Design Excellence - Commerce Awards'],
        project_url: 'https://fashionretailer-example.com',
        budget: '$75,000 - $100,000',
        client_logo_url: 'https://images.unsplash.com/photo-1583744946564-b52d01a7f418?w=200&q=80',
        key_features: ['Mobile-first responsive design', 'Streamlined checkout process', 'Advanced product filtering', 'Personalized recommendations', 'Real-time inventory updates'],
        metrics: {
          'Conversion Rate': '45% increase',
          'Cart Abandonment': '32% reduction',
          'Mobile Conversions': '52% increase',
          'Page Load Time': '40% decrease',
          'Average Order Value': '28% increase'
        },
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        user_id: user.id,
        title: 'Social Media Campaign Increases Engagement by 78%',
        client: 'Beverage Brand',
        industry: 'Food & Beverage',
        date: '2023-08-22',
        image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
        tags: ['Social Media', 'Content Strategy', 'Brand Awareness'],
        challenge: 'The client, a premium beverage brand, was struggling to connect with younger demographics (18-34) and saw declining engagement rates across their social media channels. Their content was perceived as outdated and failed to resonate with their target audience, resulting in low brand awareness among potential new customers.',
        solution: 'We developed a comprehensive social media strategy focused on authentic storytelling and user-generated content. Our approach included:\n\n1. Creating a cohesive visual identity across all platforms\n2. Developing a content calendar with platform-specific strategies\n3. Launching an influencer partnership program with 25 micro-influencers\n4. Implementing interactive content formats (polls, quizzes, AR filters)\n5. Establishing a community management framework for consistent engagement\n6. Running targeted paid campaigns to amplify organic content',
        results: 'The three-month campaign delivered exceptional results:\n\n• 78% increase in overall social media engagement\n• 156% growth in Instagram followers\n• 43% increase in website traffic from social channels\n• 22% improvement in brand sentiment metrics\n• 35% increase in user-generated content\n• 18% uplift in direct sales attributed to social media',
        testimonial_quote: 'The campaign completely transformed our brand perception among younger audiences. The creative approach and strategic execution delivered results far beyond our expectations, establishing our brand as relevant and engaging in a crowded market.',
        testimonial_author: 'Michael Thompson',
        testimonial_title: 'Marketing Director, Beverage Brand',
        team_members: ['Emily Wong - Social Media Strategist', 'Carlos Mendez - Content Creator', 'Zoe Chen - Influencer Manager', 'Thomas Wright - Paid Media Specialist', 'Aisha Johnson - Community Manager'],
        technologies: ['Sprout Social', 'Canva', 'Adobe Creative Suite', 'Meta Business Suite', 'TikTok Ads Manager', 'Influencer Management Platform'],
        timeline: '3 months (May - August 2023)',
        start_date: '2023-05-15',
        end_date: '2023-08-22',
        awards: ['Best Social Media Campaign - Beverage Industry Awards', 'Creative Excellence Award - Social Media Week'],
        project_url: 'https://beveragebrand-campaign-example.com',
        budget: '$50,000 - $75,000',
        client_logo_url: 'https://images.unsplash.com/photo-1581873372796-635b67ca2008?w=200&q=80',
        key_features: ['Custom AR filters', 'Interactive Instagram Stories', 'Influencer content series', 'User-generated content hub', 'Social media contests'],
        metrics: {
          'Engagement Rate': '78% increase',
          'Follower Growth': '156% increase',
          'Website Traffic': '43% increase',
          'Brand Sentiment': '22% improvement',
          'Sales Attribution': '18% uplift'
        },
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ];
    
    // Insert case studies
    for (const caseStudy of caseStudies) {
      const { data, error } = await supabase
        .from('case_studies')
        .insert(caseStudy)
        .select();
      
      if (error) {
        console.error("Error inserting case study:", error);
      } else {
        console.log("Case study inserted:", data);
      }
    }
    
    console.log("Case studies import completed");
  } catch (error) {
    console.error("Error importing case studies:", error);
  }
}

importCaseStudies(); 