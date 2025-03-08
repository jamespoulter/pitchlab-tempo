# PitchHub Admin Panel

## Security Overview

The PitchHub Admin Panel is secured using UUID-based authentication. Only users with the specific admin UUID can access the admin panel and its features.

## Security Implementation

1. **UUID-Based Authentication**: 
   - The admin panel checks the user's UUID against a hardcoded admin UUID
   - Current admin UUID: `1a737665-e3bd-47f7-8cd2-c5d2937a9689`

2. **Multiple Security Layers**:
   - Admin layout (`/src/app/admin/layout.tsx`) - Redirects non-admin users
   - Admin navbar (`/src/components/admin-navbar.tsx`) - Only renders for admin users
   - Individual admin pages - Additional checks for admin status

3. **Access Control**:
   - Non-admin users are automatically redirected to the home page
   - Admin links are only visible to admin users in the dashboard

## Admin Features

1. **Waitlist Management**:
   - View and manage waitlist entries
   - Mark entries as contacted
   - Export waitlist data to CSV

2. **Future Admin Features** (Coming Soon):
   - User management
   - Platform analytics
   - Global settings

## How to Access

1. Log in with the admin account
2. Access the admin panel via:
   - Direct URL: `/admin`
   - Admin button in the dashboard navbar (only visible to admin)
   - Admin link in the user dropdown menu (only visible to admin)

## Adding Additional Admins

To add additional admin users:

1. Get the UUID of the user from Supabase Auth
2. Update the `ADMIN_UUID` constant in:
   - `/src/app/admin/layout.tsx`
   - `/src/app/admin/waitlist/page.tsx`
   - `/src/components/admin-navbar.tsx`
   - `/src/components/dashboard-navbar.tsx`

Alternatively, modify the code to support multiple admin UUIDs:

```typescript
const ADMIN_UUIDS = [
  "1a737665-e3bd-47f7-8cd2-c5d2937a9689", // James
  "another-admin-uuid-here"               // Another admin
];

// Then check if the user's UUID is in the list
const isUserAdmin = user && ADMIN_UUIDS.includes(user.id);
``` 