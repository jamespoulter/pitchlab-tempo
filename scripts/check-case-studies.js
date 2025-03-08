// Check case studies in the database
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
    let value = match[2].trim();
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }
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

async function checkCaseStudies() {
  try {
    // Get all case studies
    const { data: caseStudies, error } = await supabase
      .from('case_studies')
      .select('*');
    
    if (error) {
      console.error("Error fetching case studies:", error);
      return;
    }
    
    console.log(`Found ${caseStudies.length} case studies in the database`);
    
    // Group by user_id
    const userGroups = {};
    caseStudies.forEach(study => {
      if (!userGroups[study.user_id]) {
        userGroups[study.user_id] = [];
      }
      userGroups[study.user_id].push(study);
    });
    
    console.log("Case studies by user ID:");
    for (const userId in userGroups) {
      console.log(`User ID: ${userId} - ${userGroups[userId].length} case studies`);
    }
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Error fetching current user:", userError);
      return;
    }
    
    console.log("\nCurrent authenticated user ID:", user.id);
    
    // Check if the current user has case studies
    if (userGroups[user.id]) {
      console.log(`Current user has ${userGroups[user.id].length} case studies`);
    } else {
      console.log("Current user has no case studies");
    }
    
  } catch (error) {
    console.error("Error checking case studies:", error);
  }
}

checkCaseStudies(); 