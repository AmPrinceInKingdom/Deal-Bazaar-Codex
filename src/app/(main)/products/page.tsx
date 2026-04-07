import type { Metadata } from "next";
import { Pagination } from "@/components/product/pagination";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories } from "@/lib/services/categories";
import { getProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products on Deal Bazaar.",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categories = await getCategories();

  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const minPrice =
    typeof params.minPrice === "string" ? Number(params.minPrice) : undefined;
  const maxPrice =
    typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;
  const sort =
    typeof params.sort === "string"
      ? (params.sort as "latest" | "price_asc" | "price_desc" | "featured")
      : "latest";
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  const result = await getProducts({
    search: q,
    category,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    sort,
    page,
  });

  const urlSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    }
  });

  return (
    <div className="container-wrap py-8">
      <SectionHeading
        title="Products"
        subtitle="Search, filter, and discover products from every category."
      />

      <div className="mt-6">
        <ProductFilters categories={categories} />
      </div>

      <ProductGrid products={result.items} />

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        pathname="/products"
        searchParams={urlSearchParams}
      />
    </div>
  );
}
