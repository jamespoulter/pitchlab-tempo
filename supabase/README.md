# Supabase Setup for PitchHub Tempo

This directory contains the necessary SQL migrations to set up the Supabase database for the PitchHub Tempo application.

## Database Schema

The application uses the following tables:

1. `agency_profiles` - Stores agency profile information for each user

## Storage Buckets

The application uses the following storage buckets:

1. `agency-logos` - Stores agency logo images

## How to Apply Migrations

### Option 1: Using the Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

3. Apply the migrations:
   ```bash
   supabase db push
   ```

### Option 2: Manual SQL Execution

1. Navigate to the Supabase dashboard for your project
2. Go to the SQL Editor
3. Copy the contents of each migration file in the `migrations` directory
4. Execute the SQL in the SQL Editor

## Row Level Security (RLS)

The database uses Row Level Security to ensure that users can only access their own data. The following policies are applied:

- Users can only view, create, update, and delete their own agency profiles
- Users can only upload, update, and delete their own logo files

## Storage Policies

The storage buckets have the following policies:

- Public read access for agency logos
- Authenticated users can only upload, update, and delete their own logos (based on folder name matching user ID) 