import { notFound } from "next/navigation";
import { Pagination } from "@/components/product/pagination";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategoryBySlug, getCategories } from "@/lib/services/categories";
import { getProducts } from "@/lib/services/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const minPrice =
    typeof query.minPrice === "string" ? Number(query.minPrice) : undefined;
  const maxPrice =
    typeof query.maxPrice === "string" ? Number(query.maxPrice) : undefined;
  const sort =
    typeof query.sort === "string"
      ? (query.sort as "latest" | "price_asc" | "price_desc" | "featured")
      : "latest";
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  const q = typeof query.q === "string" ? query.q : "";

  const categories = await getCategories();
  const result = await getProducts({
    search: q,
    category: slug,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    sort,
    page,
  });

  const urlSearchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    }
  });

  return (
    <div className="container-wrap py-8">
      <SectionHeading
        title={category.name}
        subtitle={category.description ?? "Browse category products"}
      />

      <div className="mt-6">
        <ProductFilters categories={categories} hideCategory />
      </div>

      <ProductGrid products={result.items} />
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        pathname={`/category/${slug}`}
        searchParams={urlSearchParams}
      />
    </div>
  );
}
