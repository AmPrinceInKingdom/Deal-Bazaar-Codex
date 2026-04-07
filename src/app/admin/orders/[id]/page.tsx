import Image from "next/image";
import { notFound } from "next/navigation";
import { OrderStatusActions } from "@/components/admin/order-status-actions";
import { PaymentStatusActions } from "@/components/admin/payment-status-actions";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrderById } from "@/lib/services/orders";
import { formatCurrency } from "@/lib/utils";

type AdminOrderDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
  const { id } = await params;
  const [order, supabase] = await Promise.all([
    getOrderById(id),
    createSupabaseServerClient(),
  ]);

  if (!order) {
    notFound();
  }

  const payments = supabase
    ? await supabase
        .from("payments")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const payment = payments.data?.[0];
  let proofUrl: string | null = null;

  if (supabase && payment?.proof_url) {
    const signed = await supabase.storage
      .from("payment-proofs")
      .createSignedUrl(payment.proof_url, 60 * 60);
    proofUrl = signed.data?.signedUrl ?? null;
  }

  return (
    <div className="space-y-6">
      <section className="surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{order.order_number}</h2>
            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{order.status}</Badge>
            <Badge variant="secondary">{order.payment_status}</Badge>
          </div>
        </div>
        <p className="mt-2 text-sm">Total: {formatCurrency(order.total)}</p>
      </section>

      <section className="surface p-6">
        <h3 className="text-lg font-bold">Order Status</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Update fulfillment status as shipment progresses.
        </p>
        <div className="mt-3">
          <OrderStatusActions orderId={order.id} currentStatus={order.status} />
        </div>
      </section>

      <section className="surface p-6">
        <h3 className="text-lg font-bold">Payment Verification</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Method: {order.payment_method}
        </p>
        {proofUrl ? (
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold">Uploaded payment proof</p>
            <div className="relative h-72 overflow-hidden rounded-xl border border-border">
              <Image
                src={proofUrl}
                alt="Payment proof"
                fill
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No payment proof uploaded.
          </p>
        )}
        <div className="mt-4">
          <PaymentStatusActions orderId={order.id} />
        </div>
      </section>

      <section className="surface p-6">
        <h3 className="text-lg font-bold">Order Items</h3>
        <div className="mt-3 space-y-2">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
            >
              <span>{item.product_name}</span>
              <span>
                {item.quantity} x {formatCurrency(item.unit_price)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
