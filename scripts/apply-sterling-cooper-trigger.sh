#!/bin/bash

# Script to apply the Sterling Cooper seed trigger to Supabase

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Applying Sterling Cooper Seed Trigger to Supabase...${NC}"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed.${NC}"
    echo "Please install it by following the instructions at: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if the migration file exists
if [ ! -f "supabase/migrations/20240310_sterling_cooper_seed_trigger.sql" ]; then
    echo -e "${RED}Error: Migration file not found.${NC}"
    echo "Make sure you're running this script from the project root directory."
    exit 1
fi

# Apply the migration and capture output
echo "Applying migration..."
output=$(supabase db push 2>&1)
exit_code=$?

# Check if the migration was successful
if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}Success! Sterling Cooper seed trigger has been applied.${NC}"
    echo ""
    echo "To test the trigger, create a new user in Supabase and check if the data is seeded."
    echo "You can also run the following SQL in the Supabase SQL Editor:"
    echo ""
    echo "-- Check if the function exists"
    echo "SELECT * FROM pg_proc WHERE proname = 'handle_new_user';"
    echo ""
    echo "-- Check if the trigger exists"
    echo "SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';"
    echo ""
    echo "-- To test the trigger with a new user, run:"
    echo "INSERT INTO auth.users (id, email) VALUES (gen_random_uuid(), 'test-user-$(date +%s)@example.com');"
    echo ""
    echo "-- Then check if data was created:"
    echo "SELECT * FROM public.agency_profiles ORDER BY created_at DESC LIMIT 1;"
    echo ""
else
    # Check if the error was due to the trigger already existing
    if [[ $output == *"trigger \"on_auth_user_created\" for relation \"users\" already exists"* ]]; then
        echo -e "${YELLOW}Note: The trigger 'on_auth_user_created' already exists.${NC}"
        echo "The function has been updated, but the existing trigger was preserved."
        echo ""
        echo "If you want to force update the trigger, you can run this SQL in the Supabase SQL Editor:"
        echo ""
        echo "DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;"
        echo "CREATE TRIGGER on_auth_user_created"
        echo "  AFTER INSERT ON auth.users"
        echo "  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();"
        echo ""
    else
        echo -e "${RED}Error: Failed to apply migration.${NC}"
        echo "Error details:"
        echo "$output"
        exit 1
    fi
fi

echo -e "${YELLOW}Done!${NC}" 