# Setting Up Google OAuth with Supabase

This guide explains how to set up Google OAuth for your Supabase project.

## Prerequisites

1. A Google Cloud Platform account
2. A Supabase project

## Step 1: Create OAuth Credentials in Google Cloud Platform

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
8. Add authorized redirect URIs:
   - For development: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`
9. Click "Create"
10. Note down the Client ID and Client Secret

## Step 2: Configure Supabase Auth Settings

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list of providers and click "Edit"
4. Enable the provider by toggling the switch
5. Enter the Client ID and Client Secret from Google Cloud Platform
6. Save the changes

## Step 3: Test the Integration

1. Go to your application's sign-in page
2. Click the "Sign in with Google" button
3. You should be redirected to Google's authentication page
4. After authenticating, you should be redirected back to your application

## Troubleshooting

- If you encounter redirect URI mismatch errors, make sure the redirect URIs in Google Cloud Platform match exactly with what Supabase is expecting.
- Check that your site URL is correctly set in Supabase Auth settings.
- Ensure that the Google OAuth API is enabled in your Google Cloud Platform project.

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2) 