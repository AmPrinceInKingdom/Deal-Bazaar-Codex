import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { checkoutSchema } from "@/lib/validations/checkout";

function generateOrderNumber() {
  return `DB-${Date.now().toString().slice(-8)}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid checkout data." },
      { status: 400 },
    );
  }

  const auth = await requireApiUser();
  if (auth.error || !auth.user || !auth.supabase) {
    return auth.error;
  }

  if (parsed.data.payment_method === "cod") {
    return NextResponse.json(
      { error: "Cash on delivery is coming soon." },
      { status: 400 },
    );
  }

  const subtotal = parsed.data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal > 100 ? 0 : 12;
  const total = subtotal + shippingFee;

  const orderPayload = {
    user_id: auth.user.id,
    order_number: generateOrderNumber(),
    payment_method: parsed.data.payment_method,
    payment_status:
      parsed.data.payment_method === "bank_transfer" ? "under_review" : "pending",
    subtotal,
    shipping_fee: shippingFee,
    total,
    notes: parsed.data.notes || null,
    customer_name: parsed.data.customer_name,
    customer_phone: parsed.data.phone,
    customer_email: parsed.data.email,
    shipping_address: parsed.data.address,
  };

  const { data: order, error: orderError } = await auth.supabase
    .from("orders")
    .insert(orderPayload)
    .select("*")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message || "Unable to create order." },
      { status: 500 },
    );
  }

  const orderItems = parsed.data.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    product_slug: item.slug,
    product_image: item.main_image,
    unit_price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  const { error: itemError } = await auth.supabase.from("order_items").insert(orderItems);
  if (itemError) {
    return NextResponse.json({ error: itemError.message }, { status: 500 });
  }

  const { error: paymentError } = await auth.supabase.from("payments").insert({
    order_id: order.id,
    method: parsed.data.payment_method,
    status:
      parsed.data.payment_method === "bank_transfer" ? "under_review" : "pending",
    proof_url: parsed.data.payment_proof_url || null,
    instructions:
      parsed.data.payment_method === "bank_transfer"
        ? "Upload payment proof and wait for admin verification."
        : null,
  });

  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    orderNumber: order.order_number,
  });
}
