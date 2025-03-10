# Supabase Domain Update Guide

## Update Supabase Project Settings

1. **Log in to Supabase Dashboard**:
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Navigate to your project

2. **Update Authentication Settings**:
   - Go to "Authentication" > "URL Configuration"
   - Add the new site URL: `https://www.pitchhub.agency`
   - Add additional redirect URLs:
     - `https://www.pitchhub.agency/auth/callback`
     - `https://pitchhub.agency/auth/callback` (non-www version)
   - Save changes

3. **Update CORS Settings**:
   - Go to "API" > "Settings" > "CORS"
   - Add the following URLs to the allowed origins:
     - `https://www.pitchhub.agency`
     - `https://pitchhub.agency` (non-www version)
   - Save changes

## Update Edge Functions

If you're using Edge Functions, make sure to update the CORS settings for each function:

1. **Go to "Edge Functions"** in the Supabase Dashboard
2. **For each function**:
   - Update the CORS headers to include the new domain
   - Example code in your Edge Functions:
   ```typescript
   const corsHeaders = {
     'Access-Control-Allow-Origin': '*', // Or specifically: 'https://www.pitchhub.agency'
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-customer-email',
   };
   ```

## Update Environment Variables in Vercel

1. **Log in to Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"

2. **Add/Update the following variables**:
   - `NEXT_PUBLIC_SITE_URL=https://www.pitchhub.agency`
   - Ensure all callback URLs in any OAuth-related variables are updated

## Test Authentication Flow

After making these changes, test the authentication flow to ensure everything works correctly:

1. **Test Sign Up**: Try signing up a new user
2. **Test Sign In**: Try signing in with an existing user
3. **Test Google OAuth**: Try signing in with Google
4. **Test Password Reset**: Try the password reset flow

## Troubleshooting

If you encounter issues:

1. **Check Browser Console**: Look for CORS or authentication errors
2. **Check Network Requests**: Ensure redirects are going to the correct URLs
3. **Check Supabase Logs**: Look for authentication errors in the Supabase Dashboard
4. **Check Cookie Domain**: Ensure cookies are being set with the correct domain

## Additional Notes

- The middleware has been updated to handle redirects from non-www to www
- Cookie settings have been updated to work with the new domain
- Google OAuth has been configured to use the new domain 