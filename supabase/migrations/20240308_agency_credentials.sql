-- Create agency_credentials table
CREATE TABLE IF NOT EXISTS agency_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  description TEXT,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE agency_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own credentials
CREATE POLICY select_own_credentials ON agency_credentials
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own credentials
CREATE POLICY insert_own_credentials ON agency_credentials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own credentials
CREATE POLICY update_own_credentials ON agency_credentials
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own credentials
CREATE POLICY delete_own_credentials ON agency_credentials
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update the updated_at column
CREATE TRIGGER update_agency_credentials_updated_at
BEFORE UPDATE ON agency_credentials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 