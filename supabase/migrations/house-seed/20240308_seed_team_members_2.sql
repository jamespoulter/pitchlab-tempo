-- Seed file for additional House337 team_members data

-- Set the user_id to the provided UUID
DO $$
DECLARE
  user_uuid UUID := '1a737665-e3bd-47f7-8cd2-c5d2937a9689';
BEGIN

-- Insert additional team members
INSERT INTO team_members (
  id, user_id, name, role, email, phone, bio, avatar, skills
) VALUES
(
  uuid_generate_v4(),
  user_uuid,
  'Di Gracie',
  'Government Lead',
  'di.gracie@house337.com',
  '+44 20 1234 5005',
  'Di leads our Government practice, delivering successful behavior change campaigns for government departments and bodies in the UK and internationally.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f9ba1af096159d713f4fdb_Diane%20Gracie.jpg',
  ARRAY['Government Communications', 'Behavior Change', 'Public Sector', 'Campaign Strategy']
),
(
  uuid_generate_v4(),
  user_uuid,
  'James Thornett',
  'Customer Experience Lead',
  'james.thornett@house337.com',
  '+44 20 1234 5006',
  'James leads our Customer Experience team, making brand interactions better and easier across multiple channels, touchpoints and technologies.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f9963df7226b7257dd2f8c_James-Thornett.jpg',
  ARRAY['Customer Experience', 'Digital Strategy', 'UX/UI Design', 'Service Design']
),
(
  uuid_generate_v4(),
  user_uuid,
  'Georgie Murray Burton',
  'Not For Profit Lead',
  'georgie.murray-burton@house337.com',
  '+44 20 1234 5007',
  'Georgie leads our Not For Profit work, combining smart strategic thinking with brilliant creativity to tackle important social issues.',
  'https://cdn.prod.website-files.com/64db2e348dd02f394be49b5e/64f9ba03ded0ae78181acdee_Georgie%20Murry-Burton.jpg',
  ARRAY['Social Impact', 'Cause Marketing', 'Non-profit Strategy', 'Purpose-driven Campaigns']
);

END $$; 