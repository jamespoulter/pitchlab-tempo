-- Create agency_assets table
CREATE TABLE IF NOT EXISTS agency_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- e.g., 'image', 'document', 'video'
  file_size INTEGER, -- in bytes
  mime_type TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies to ensure users can only access their own data
ALTER TABLE agency_assets ENABLE ROW LEVEL SECURITY;

-- Policy for selecting (reading) agency assets
CREATE POLICY "Users can view their own agency assets" 
  ON agency_assets 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for inserting agency assets
CREATE POLICY "Users can create their own agency assets" 
  ON agency_assets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating agency assets
CREATE POLICY "Users can update their own agency assets" 
  ON agency_assets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for deleting agency assets
CREATE POLICY "Users can delete their own agency assets" 
  ON agency_assets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_agency_assets_updated_at
BEFORE UPDATE ON agency_assets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 