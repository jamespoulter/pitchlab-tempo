// Script to run SQL migrations against the production Supabase database
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to run SQL file
async function runSqlFile(filePath) {
  try {
    // Read SQL file
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Running SQL file: ${filePath}`);
    
    // Split SQL into statements (simple approach, may need refinement for complex SQL)
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing statement: ${statement.substring(0, 100)}...`);
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error executing statement: ${error.message}`);
        } else {
          console.log('Statement executed successfully');
        }
      }
    }
    
    console.log('SQL file execution completed');
  } catch (error) {
    console.error(`Error running SQL file: ${error.message}`);
  }
}

// Get file path from command line arguments
const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide a SQL file path');
  process.exit(1);
}

// Run the SQL file
runSqlFile(path.resolve(filePath)); 