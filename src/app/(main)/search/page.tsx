import { Pagination } from "@/components/product/pagination";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories } from "@/lib/services/categories";
import { getProducts } from "@/lib/services/products";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q : "";
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const sort =
    typeof query.sort === "string"
      ? (query.sort as "latest" | "price_asc" | "price_desc" | "featured")
      : "latest";
  const minPrice =
    typeof query.minPrice === "string" ? Number(query.minPrice) : undefined;
  const maxPrice =
    typeof query.maxPrice === "string" ? Number(query.maxPrice) : undefined;
  const category = typeof query.category === "string" ? query.category : "";

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({
      search: q,
      page,
      sort,
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
      category,
    }),
  ]);

  const urlSearchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    }
  });

  return (
    <div className="container-wrap py-8">
      <SectionHeading
        title={q ? `Search results for "${q}"` : "Search products"}
        subtitle={`${result.total} product(s) found`}
      />
      <div className="mt-6">
        <ProductFilters categories={categories} />
      </div>
      <ProductGrid products={result.items} />
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        pathname="/search"
        searchParams={urlSearchParams}
      />
    </div>
  );
}
