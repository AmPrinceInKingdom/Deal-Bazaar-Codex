import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types/domain";

export function ProductSection({
  title,
  subtitle,
  products,
  href = "/products",
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
}) {
  return (
    <section className="mt-14 space-y-6">
      <SectionHeading
        title={title}
        subtitle={subtitle}
        action={
          <Link href={href}>
            <Button variant="outline">View all</Button>
          </Link>
        }
      />
      <ProductGrid products={products} />
    </section>
  );
}
