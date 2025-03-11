#!/usr/bin/env node

/**
 * This script helps identify files that need to be updated to fix Supabase imports.
 * It lists all files that import from supabase-client.ts and suggests how to fix them.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all files that import from supabase-client.ts
try {
  const result = execSync('grep -r "import.*supabase-client" --include="*.tsx" --include="*.ts" src/').toString();
  
  console.log('\n=== Files that need to be updated ===\n');
  
  const lines = result.split('\n').filter(Boolean);
  const clientComponentFiles = [];
  const serverComponentFiles = [];
  
  lines.forEach(line => {
    const [filePath, importStatement] = line.split(':');
    
    // Check if the file is a client component
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const isClientComponent = fileContent.includes('"use client"') || fileContent.includes("'use client'");
    
    if (isClientComponent) {
      clientComponentFiles.push({ filePath, importStatement });
    } else {
      serverComponentFiles.push({ filePath, importStatement });
    }
  });
  
  console.log('Client Components (Update to use supabase-browser.ts):');
  clientComponentFiles.forEach(({ filePath, importStatement }) => {
    console.log(`- ${filePath}`);
    console.log(`  Current: ${importStatement.trim()}`);
    console.log(`  Update to: import { ... } from "@/utils/supabase-browser"`);
    console.log();
  });
  
  console.log('Server Components (Update to use supabase-server.ts):');
  serverComponentFiles.forEach(({ filePath, importStatement }) => {
    console.log(`- ${filePath}`);
    console.log(`  Current: ${importStatement.trim()}`);
    console.log(`  Update to: import { ... } from "@/utils/supabase-server"`);
    console.log();
  });
  
  console.log('\nInstructions:');
  console.log('1. For client components, update imports to use supabase-browser.ts');
  console.log('2. For server components, update imports to use supabase-server.ts');
  console.log('3. Make sure function names match between files');
  console.log('4. Client components should use createClient() directly');
  console.log('5. Server components should use await createServerSupabaseClient()');
  
} catch (error) {
  console.error('Error running grep command:', error.message);
} 