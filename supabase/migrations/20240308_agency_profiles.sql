-- Create agency_profiles table
CREATE TABLE IF NOT EXISTS agency_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  description TEXT,
  founded TEXT,
  employees TEXT,
  industries TEXT[] DEFAULT '{}',
  mission TEXT,
  vision TEXT,
  logo_url TEXT,
  social_media JSONB DEFAULT '{}'::JSONB,
  values TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies to ensure users can only access their own data
ALTER TABLE agency_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for selecting (reading) agency profiles
CREATE POLICY "Users can view their own agency profile" 
  ON agency_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for inserting agency profiles
CREATE POLICY "Users can create their own agency profile" 
  ON agency_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating agency profiles
CREATE POLICY "Users can update their own agency profile" 
  ON agency_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for deleting agency profiles
CREATE POLICY "Users can delete their own agency profile" 
  ON agency_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_agency_profiles_updated_at
BEFORE UPDATE ON agency_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 