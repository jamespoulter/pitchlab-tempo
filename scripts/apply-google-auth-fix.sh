#!/bin/bash

# Script to apply the Google OAuth fix migration to Supabase

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Applying Google OAuth Fix to Supabase...${NC}"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed.${NC}"
    echo "Please install it by following the instructions at: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if the migration file exists
if [ ! -f "supabase/migrations/20240310_fix_google_auth.sql" ]; then
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
    echo -e "${GREEN}Success! Google OAuth fix has been applied.${NC}"
    echo ""
    echo "The handle_new_user function has been updated to better handle Google OAuth users."
    echo ""
    echo "You can now try signing up with Google again."
else
    echo -e "${RED}Error: Failed to apply migration.${NC}"
    echo "Error details:"
    echo "$output"
    exit 1
fi

echo -e "${YELLOW}Done!${NC}" 