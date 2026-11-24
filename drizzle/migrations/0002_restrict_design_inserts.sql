DROP POLICY IF EXISTS "anyone can create a design" ON public.designs;
CREATE POLICY "signed-in users create own designs" ON public.designs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "guests create unowned designs" ON public.designs FOR INSERT TO anon WITH CHECK (user_id IS NULL);