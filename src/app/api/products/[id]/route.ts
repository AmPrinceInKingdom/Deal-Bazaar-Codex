import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { productSchema } from "@/lib/validations/product";

type Context = {
  params: Promise<{ id: string }>;
};

function resolveStockStatus(stockQuantity: number) {
  if (stockQuantity <= 0) return "out_of_stock";
  if (stockQuantity < 10) return "low_stock";
  return "in_stock";
}

export async function PATCH(request: Request, context: Context) {
  const auth = await requireApiAdmin();
  if (auth.error || !auth.supabase) {
    return auth.error;
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid product data." },
      { status: 400 },
    );
  }

  const values = parsed.data;
  const discount =
    values.old_price && values.old_price > values.price
      ? Math.round(((values.old_price - values.price) / values.old_price) * 100)
      : 0;

  const { data, error } = await auth.supabase
    .from("products")
    .update({
      ...values,
      discount,
      stock_status: resolveStockStatus(values.stock_quantity),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(_: Request, context: Context) {
  const auth = await requireApiAdmin();
  if (auth.error || !auth.supabase) {
    return auth.error;
  }

  const { id } = await context.params;

  const { error } = await auth.supabase.from("products").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
