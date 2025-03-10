#!/usr/bin/env node

/**
 * This script helps check and update the Google OAuth configuration for local development.
 * 
 * Usage:
 * 1. Run `node scripts/check-oauth-config.js` to see the current configuration
 * 2. Follow the instructions to update the configuration in the Supabase dashboard
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

console.log('\n=== Google OAuth Configuration Helper ===\n');
console.log('To fix Google OAuth redirects for local development, you need to:');
console.log('\n1. Update your Google Cloud Console OAuth configuration:');
console.log('   - Go to https://console.cloud.google.com/apis/credentials');
console.log('   - Edit your OAuth 2.0 Client ID');
console.log('   - Add these Authorized JavaScript origins:');
console.log(`     * http://localhost:${port}`);
console.log(`     * http://127.0.0.1:${port}`);
console.log(`     * http://${localIp}:${port}`);
console.log('   - Add these Authorized redirect URIs:');
console.log(`     * http://localhost:${port}/auth/callback`);
console.log(`     * http://127.0.0.1:${port}/auth/callback`);
console.log(`     * http://${localIp}:${port}/auth/callback`);

console.log('\n2. Update your Supabase Auth configuration:');
console.log('   - Go to https://supabase.com/dashboard/project/_/auth/providers');
console.log('   - Edit the Google provider');
console.log('   - Make sure the Redirect URL is set to:');
console.log(`     * http://localhost:${port}/auth/callback`);

console.log('\n3. Restart your Next.js development server');
console.log('\nNote: You may need to clear your browser cookies if you still experience issues.\n'); 