"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCart } from "@/contexts/cart-context";
import { BANK_DETAILS } from "@/lib/constants";
import { checkoutSchema, type CheckoutSchema } from "@/lib/validations/checkout";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function CheckoutForm() {
  const { items, subtotal, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      payment_method: "bank_transfer",
      payment_proof_url: "",
      items: [],
    },
  });

  const paymentMethod = form.watch("payment_method");

  const onSubmit = form.handleSubmit(async (values) => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      let paymentProofPath = "";

      if (values.payment_method === "bank_transfer" && proofFile) {
        const data = new FormData();
        data.append("file", proofFile);
        const uploadRes = await fetch("/api/upload/payment-proof", {
          method: "POST",
          body: data,
        });
        if (!uploadRes.ok) {
          throw new Error("Unable to upload payment proof.");
        }
        const uploaded = (await uploadRes.json()) as { path: string };
        paymentProofPath = uploaded.path;
      }

      const payload = {
        ...values,
        payment_proof_url: paymentProofPath,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          main_image: item.main_image,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Checkout failed.");
      }

      const body = (await response.json()) as { orderNumber: string };
      clearCart();
      router.push(`/order-success?order=${body.orderNumber}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="surface p-5">
          <h2 className="text-lg font-bold">Customer Details</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Full name</label>
              <Input {...form.register("customer_name")} />
              <p className="mt-1 text-xs text-danger">
                {form.formState.errors.customer_name?.message}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <Input {...form.register("phone")} />
              <p className="mt-1 text-xs text-danger">
                {form.formState.errors.phone?.message}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input type="email" {...form.register("email")} />
              <p className="mt-1 text-xs text-danger">
                {form.formState.errors.email?.message}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address</label>
              <Textarea rows={3} {...form.register("address")} />
              <p className="mt-1 text-xs text-danger">
                {form.formState.errors.address?.message}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Notes (optional)</label>
              <Textarea rows={3} {...form.register("notes")} />
            </div>
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="text-lg font-bold">Payment Method</h2>
          <div className="mt-4 space-y-3">
            <Select {...form.register("payment_method")}>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card Payment (UI only)</option>
              <option value="cod">Cash on Delivery (Coming Soon)</option>
            </Select>

            {paymentMethod === "bank_transfer" ? (
              <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm">
                <p className="font-semibold">Bank transfer instructions</p>
                <p className="mt-2 text-muted-foreground">
                  Complete transfer and upload proof. Orders remain under review
                  until admin verification.
                </p>
                <ul className="mt-3 space-y-1">
                  <li>Bank: {BANK_DETAILS.bankName}</li>
                  <li>Account Name: {BANK_DETAILS.accountName}</li>
                  <li>Account Number: {BANK_DETAILS.accountNumber}</li>
                  <li>SWIFT: {BANK_DETAILS.swiftCode}</li>
                  <li>Branch: {BANK_DETAILS.branch}</li>
                </ul>
                <div className="mt-3">
                  <label className="mb-1 block font-medium">Payment proof</label>
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      setProofFile(event.target.files?.[0] ?? null)
                    }
                  />
                </div>
              </div>
            ) : null}

            {paymentMethod === "card" ? (
              <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                Card payment UI is ready for gateway integration. Connect Stripe,
                PayHere, or your preferred processor in `/api/checkout`.
              </div>
            ) : null}

            {paymentMethod === "cod" ? (
              <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                Cash on delivery is coming soon and not available yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <aside className="surface h-fit p-5">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-2">
              <span className="line-clamp-1 text-muted-foreground">
                {item.name} x{item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{subtotal > 100 ? "Free" : formatCurrency(12)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
        <Button type="submit" className="mt-5 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4" />
              Placing order...
            </>
          ) : (
            "Place order"
          )}
        </Button>
      </aside>
    </form>
  );
}
