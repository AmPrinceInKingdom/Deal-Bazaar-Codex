import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAllProducts } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";

export async function getAdminDashboardStats() {
  const supabase = await createSupabaseServerClient();
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  if (!supabase) {
    return {
      products: products.length,
      categories: categories.length,
      totalOrders: 0,
      pendingPayments: 0,
      customers: 0,
    };
  }

  const [{ count: orderCount }, { count: pendingPayments }, { count: customers }] =
    await Promise.all([
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .neq("payment_status", "approved"),
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "customer"),
    ]);

  return {
    products: products.length,
    categories: categories.length,
    totalOrders: orderCount ?? 0,
    pendingPayments: pendingPayments ?? 0,
    customers: customers ?? 0,
  };
}
