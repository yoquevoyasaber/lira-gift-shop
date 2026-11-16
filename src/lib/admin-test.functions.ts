import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { getProduct } from './products';
import { requireAdminTest } from './cart-rules';

export const createAdminTestOrder = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((value: unknown) => z.object({ items: z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(20), designId: z.string().uuid().optional() })).min(1).max(40) }).parse(value))
  .handler(async ({ data, context }) => {
    const { data: allowed, error: roleError } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (roleError) throw roleError;
    requireAdminTest(Boolean(allowed));
    const items = data.items.map(i => {
      const product = getProduct(i.id);
      if (!product) throw new Error('Combo no encontrado');
      return { ...i, product };
    });
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);
    const { data: order, error } = await supabaseAdmin.from('orders').insert({
      user_id: context.userId, total, full_name: 'Prueba de administración', phone: '0968718145',
      address: 'Prueba interna, sin entrega', notes: 'Simulación sin cobro; no contiene datos de tarjeta', status: 'paid_test', payment_method: 'admin_test',
    }).select('id').single();
    if (error) throw error;
    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(items.map(i => ({
      order_id: order.id, product_id: i.id, product_name: i.product.name, unit_price: i.product.price, qty: i.qty, design_id: i.designId,
    })));
    if (itemsError) { await supabaseAdmin.from('orders').delete().eq('id', order.id); throw itemsError; }
    return { id: order.id, total };
  });