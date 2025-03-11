#!/usr/bin/env node

/**
 * This script helps check and update the Google OAuth configuration for local development.
 * Based on Supabase's recommendations: https://supabase.com/docs/guides/auth/social-login/auth-google
 * 
 * Usage:
 * 1. Run `node scripts/check-oauth-config.js` to see the current configuration
 * 2. Follow the instructions to update the configuration in the Supabase dashboard and Google Cloud Console
 */

const os = require('os');
const { execSync } = require('child_process');

// Get the local IP address for network testing
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (loopback) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// Get the port from the next.js dev command or default to 3000
function getNextDevPort() {
  try {
    // Try to get the port from the running Next.js process
    const nextProcess = execSync('ps aux | grep "next dev" | grep -v grep').toString();
    const portMatch = nextProcess.match(/-p\s+(\d+)/);
    if (portMatch && portMatch[1]) {
      return portMatch[1];
    }
  } catch (error) {
    // If we can't find the process or there's an error, fall back to default
  }
  
  // Check if any ports are in use
  try {
    const ports = execSync('lsof -i -P -n | grep LISTEN | grep node').toString();
    const portMatches = ports.match(/:(\d+)/g);
    if (portMatches && portMatches.length > 0) {
      // Return the first port found
      return portMatches[0].replace(':', '');
    }
  } catch (error) {
    // If we can't find any ports, fall back to default
  }
  
  return '3000';
}

const localIp = getLocalIpAddress();
const port = getNextDevPort();
const prodDomain = 'pitchhub.agency';
const prodUrl = `https://www.${prodDomain}`;

console.log('\n=== Google OAuth Configuration Helper ===\n');
console.log('Based on Supabase\'s recommendations: https://supabase.com/docs/guides/auth/social-login/auth-google');
console.log('\nTo fix Google OAuth redirects for local development, follow these steps:');

console.log('\n1. Google Cloud Console Configuration:');
console.log('   a) Go to https://console.cloud.google.com/apis/credentials');
console.log('   b) Make sure you have configured the OAuth consent screen:');
console.log('      - Add your app name, user support email, and developer contact information');
console.log('      - Add your production domain to "Authorized domains":');
console.log(`        * ${prodDomain}`);
console.log('   c) Edit your OAuth 2.0 Client ID or create a new one for Web application');
console.log('   d) Add these Authorized JavaScript origins:');
console.log('      For development:');
console.log(`        * http://localhost:${port}`);
console.log(`        * http://127.0.0.1:${port}`);
console.log(`        * http://${localIp}:${port}`);
console.log('      For production:');
console.log(`        * ${prodUrl}`);
console.log('   e) Add these Authorized redirect URIs:');
console.log('      For development:');
console.log(`        * http://localhost:${port}/auth/callback`);
console.log(`        * http://127.0.0.1:${port}/auth/callback`);
console.log(`        * http://${localIp}:${port}/auth/callback`);
console.log('      For production:');
console.log(`        * ${prodUrl}/auth/callback`);
console.log('   f) Save the changes and note your Client ID and Client Secret');

console.log('\n2. Supabase Auth Configuration:');
console.log('   a) Go to https://supabase.com/dashboard/project/_/auth/providers');
console.log('   b) Enable and edit the Google provider');
console.log('   c) Enter your Client ID and Client Secret from Google Cloud Console');
console.log('   d) Set the Redirect URL to match your environment:');
console.log('      For development:');
console.log(`        * http://localhost:${port}/auth/callback`);
console.log('      For production:');
console.log(`        * ${prodUrl}/auth/callback`);
console.log('   e) Save the changes');

console.log('\n3. Verify your auth callback route:');
console.log('   Make sure you have a route handler for /auth/callback that:');
console.log('   - Exchanges the code for a session');
console.log('   - Redirects to the appropriate page after authentication');
console.log('   - Handles the redirect_to parameter if present');

console.log('\n4. Restart your Next.js development server');
console.log('\nNote: You may need to clear your browser cookies if you still experience issues.\n'); 