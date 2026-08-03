CREATE TABLE public.designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT ON public.designs TO anon;
GRANT SELECT, INSERT, UPDATE ON public.designs TO authenticated;
GRANT ALL ON public.designs TO service_role;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "designs are publicly viewable" ON public.designs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anyone can create a design" ON public.designs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "owners can update their design" ON public.designs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);