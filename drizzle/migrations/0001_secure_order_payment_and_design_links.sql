ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS design_id uuid;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS checkout_url text;
CREATE OR REPLACE FUNCTION public.guard_order_payment() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN
IF current_user IN ('postgres','service_role') OR coalesce(auth.role(),'') = 'service_role' THEN RETURN NEW; END IF;
IF public.has_role(auth.uid(),'admin') THEN RETURN NEW; END IF;
IF TG_OP = 'INSERT' AND NEW.status <> 'pending_payment' THEN RAISE EXCEPTION 'Payment must be verified'; END IF;
IF TG_OP = 'UPDATE' AND (NEW.status IS DISTINCT FROM OLD.status OR NEW.total IS DISTINCT FROM OLD.total OR NEW.payment_method IS DISTINCT FROM OLD.payment_method) THEN RAISE EXCEPTION 'Only verified payment processing can change this order'; END IF;
RETURN NEW; END $$;
CREATE TRIGGER protect_order_payment BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.guard_order_payment();