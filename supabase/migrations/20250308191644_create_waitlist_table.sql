-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  contacted BOOLEAN DEFAULT false NOT NULL
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read all waitlist entries
CREATE POLICY "Admins can read all waitlist entries" ON waitlist
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM users WHERE is_admin = true
  ));

-- Create policy for anyone to insert into waitlist
CREATE POLICY "Anyone can join the waitlist" ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist (created_at DESC);
