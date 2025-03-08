# Agency Profile Functionality

This document explains how the agency profile functionality works in the PitchLab Tempo application.

## Overview

The agency profile functionality allows users to create and manage their agency's profile information, including:

- Basic information (name, email, phone, website, address)
- Agency description
- Founded year and team size
- Industries served
- Mission and vision statements
- Logo upload

Each user can only view, edit, and manage their own agency profile, enforced by Supabase Row Level Security (RLS) policies.

## Implementation Details

### Database Schema

The agency profile data is stored in the `agency_profiles` table in Supabase with the following structure:

- `id`: UUID (primary key)
- `user_id`: UUID (references auth.users)
- `name`: TEXT
- `email`: TEXT
- `phone`: TEXT
- `website`: TEXT
- `address`: TEXT
- `description`: TEXT
- `founded`: TEXT
- `employees`: TEXT
- `industries`: TEXT[]
- `mission`: TEXT
- `vision`: TEXT
- `logo_url`: TEXT
- `social_media`: JSONB
- `values`: TEXT[]
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Storage

Agency logos are stored in the `agency-logos` bucket in Supabase Storage. Each user's logos are stored in a folder named after their user ID to ensure proper access control.

### Components

1. **EditAgencyProfileModal**: A modal component for creating and editing agency profiles
2. **AgencyProfilePage**: A page component for displaying the agency profile

### Utilities

The `src/utils/agency.ts` file contains utility functions for interacting with the agency profile data:

- `getAgencyProfile()`: Fetches the agency profile for the current user
- `upsertAgencyProfile(profileData)`: Creates or updates an agency profile
- `updateAgencyLogo(logoUrl)`: Updates the agency logo URL

## Setup Instructions

1. Apply the Supabase migrations:
   - Navigate to the Supabase dashboard
   - Go to the SQL Editor
   - Copy and execute the contents of `supabase/migrations/20240308_agency_profiles.sql`
   - Copy and execute the contents of `supabase/migrations/20240308_agency_storage.sql`

2. Create the storage bucket:
   - In the Supabase dashboard, go to Storage
   - Create a new bucket named `agency-logos`
   - Set it to public (the RLS policies will handle access control)

3. Test the functionality:
   - Log in to the application
   - Navigate to the agency profile page
   - Create or edit your agency profile
   - Upload a logo

## Troubleshooting

If you encounter issues with the agency profile functionality:

1. Check the browser console for error messages
2. Verify that the Supabase migrations have been applied correctly
3. Ensure that the storage bucket has been created with the correct name
4. Check that the user is authenticated before attempting to access the agency profile

## Future Improvements

- Add validation for form fields
- Implement image cropping for logos
- Add support for multiple agency locations
- Enhance social media profile management 