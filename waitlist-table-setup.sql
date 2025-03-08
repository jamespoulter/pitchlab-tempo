-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  contacted BOOLEAN DEFAULT false NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all waitlist entries
CREATE POLICY "Authenticated users can read all waitlist entries" ON public.waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for anyone to insert into waitlist
CREATE POLICY "Anyone can join the waitlist" ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for authenticated users to update waitlist entries
CREATE POLICY "Authenticated users can update waitlist entries" ON public.waitlist
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist (email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON public.waitlist (created_at DESC);

-- Grant permissions
GRANT SELECT, INSERT ON public.waitlist TO anon;
GRANT SELECT, INSERT, UPDATE ON public.waitlist TO authenticated;