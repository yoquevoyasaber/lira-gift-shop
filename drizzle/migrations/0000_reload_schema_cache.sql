GRANT SELECT, INSERT ON public.designs TO anon;
GRANT SELECT, INSERT, UPDATE ON public.designs TO authenticated;
GRANT ALL ON public.designs TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
NOTIFY pgrst, 'reload schema';