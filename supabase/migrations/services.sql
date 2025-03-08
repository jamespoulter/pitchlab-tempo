-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  priceRange TEXT NOT NULL,
  timeline TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  process JSONB[] DEFAULT '{}',
  faq JSONB[] DEFAULT '{}',
  testimonials JSONB[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy for selecting services (users can only see their own services)
CREATE POLICY "Users can view their own services" 
  ON services 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for inserting services (users can only insert their own services)
CREATE POLICY "Users can insert their own services" 
  ON services 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating services (users can only update their own services)
CREATE POLICY "Users can update their own services" 
  ON services 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for deleting services (users can only delete their own services)
CREATE POLICY "Users can delete their own services" 
  ON services 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp if it doesn't already exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 