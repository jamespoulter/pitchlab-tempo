-- Enable the wrappers extension
CREATE EXTENSION IF NOT EXISTS wrappers WITH SCHEMA extensions;

-- Create the Stripe foreign data wrapper
CREATE FOREIGN DATA WRAPPER stripe_wrapper
  HANDLER stripe_fdw_handler
  VALIDATOR stripe_fdw_validator;

-- Create a server for Stripe
-- Note: You'll need to replace 'YOUR_STRIPE_API_KEY' with your actual Stripe API key
-- For production, it's recommended to use Vault to store your API key securely
CREATE SERVER stripe_server
  FOREIGN DATA WRAPPER stripe_wrapper
  OPTIONS (
    api_key 'YOUR_STRIPE_API_KEY' -- Replace with your Stripe API key
  );

-- Create a user mapping for the postgres user
CREATE USER MAPPING FOR postgres
  SERVER stripe_server
  OPTIONS (
    user 'postgres'
  );

-- Create a schema for Stripe
CREATE SCHEMA IF NOT EXISTS stripe;

-- Import Stripe tables
IMPORT FOREIGN SCHEMA stripe_schema
  FROM SERVER stripe_server
  INTO stripe;

-- Grant usage on the Stripe schema to authenticated users
GRANT USAGE ON SCHEMA stripe TO authenticated;

-- Grant select on all tables in the Stripe schema to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA stripe TO authenticated; 