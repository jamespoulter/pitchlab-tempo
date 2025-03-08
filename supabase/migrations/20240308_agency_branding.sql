-- Create agency_branding table
CREATE TABLE IF NOT EXISTS agency_branding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  colors JSONB DEFAULT '[]'::JSONB,
  typography JSONB DEFAULT '{}'::JSONB,
  logo_url TEXT,
  logo_dark_url TEXT,
  icon_url TEXT,
  assets TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies to ensure users can only access their own data
ALTER TABLE agency_branding ENABLE ROW LEVEL SECURITY;

-- Policy for selecting (reading) agency branding
CREATE POLICY "Users can view their own agency branding" 
  ON agency_branding 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for inserting agency branding
CREATE POLICY "Users can create their own agency branding" 
  ON agency_branding 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating agency branding
CREATE POLICY "Users can update their own agency branding" 
  ON agency_branding 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for deleting agency branding
CREATE POLICY "Users can delete their own agency branding" 
  ON agency_branding 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_agency_branding_updated_at
BEFORE UPDATE ON agency_branding
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 