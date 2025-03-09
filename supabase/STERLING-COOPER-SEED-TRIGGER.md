# Sterling Cooper Seed Trigger

This database trigger automatically seeds a new user's profile with data based on the fictional Sterling Cooper advertising agency from the TV show Mad Men. When a new user signs up in Supabase, the trigger populates all relevant tables with Sterling Cooper-themed data.

## Tables Populated

The trigger populates the following tables:

1. `agency_profiles` - Basic agency information
2. `agency_branding` - Brand colors, typography, and logos
3. `agency_credentials` - Awards and recognitions
4. `team_members` - Key staff members (Don Draper, Roger Sterling, etc.)
5. `services` - Agency service offerings
6. `case_studies` - Notable client campaigns
7. `testimonials` - Client testimonials

## How It Works

The trigger is set up to execute after a new user is inserted into the `auth.users` table. It calls the `handle_new_user()` function, which inserts the Sterling Cooper data into all the relevant tables, associating each record with the new user's ID.

## Implementation Details

The implementation consists of:

1. A PostgreSQL function `public.handle_new_user()` that contains all the seed data
2. A trigger `on_auth_user_created` that executes the function after a new user is created

## How to Apply

### Using the Migration File

The migration file is designed to check if the trigger already exists before creating it. If the trigger exists, it will log a notice and continue without error.

```bash
# Run from the project root directory
./scripts/apply-sterling-cooper-trigger.sh
```

### Using the SQL Editor

If you encounter the "trigger already exists" error when applying the migration, you can use the SQL file to manually apply the trigger:

1. Open the Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of `supabase/apply_sterling_cooper_trigger.sql`
4. Paste into the SQL Editor and run

This SQL file will:
- Create or replace the `handle_new_user()` function
- Drop the existing trigger if it exists
- Create a new trigger

## How to Test

You can test the trigger by creating a new user in Supabase. Here are the steps:

1. Sign up a new user through your application
2. Or create a user directly in the Supabase dashboard
3. Check the tables to verify that the Sterling Cooper data has been created for the new user

### Testing via SQL

You can also test the trigger by manually inserting a user and checking the results:

```sql
-- First, create a test user in auth.users
INSERT INTO auth.users (id, email)
VALUES (gen_random_uuid(), 'test-user@example.com');

-- Then check if data was created in the agency_profiles table
SELECT * FROM public.agency_profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test-user@example.com');

-- Check other tables as well
SELECT * FROM public.team_members
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test-user@example.com');
```

## Troubleshooting

### Trigger Already Exists Error

If you encounter the error `ERROR: 42710: trigger "on_auth_user_created" for relation "users" already exists`, it means there's already a trigger with the same name on the `auth.users` table.

You have two options:

1. **Use the updated migration file**: The updated migration file checks if the trigger exists before creating it.

2. **Manually drop and recreate the trigger**: Run the following SQL in the Supabase SQL Editor:

```sql
-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Customization

To customize the seed data:

1. Edit the `handle_new_user()` function in `supabase/migrations/20240310_sterling_cooper_seed_trigger.sql`
2. Modify the INSERT statements with your desired data
3. Apply the changes to your Supabase instance

## Notes

- The trigger uses the `SECURITY DEFINER` option to ensure it has the necessary permissions to insert data
- All inserted records are associated with the new user's ID via the `user_id` column
- The trigger respects the Row Level Security (RLS) policies already in place for these tables 