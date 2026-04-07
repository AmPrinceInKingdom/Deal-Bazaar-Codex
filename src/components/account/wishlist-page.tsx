"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useWishlist } from "@/contexts/wishlist-context";

export function WishlistPageContent() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Save products here to revisit before checkout."
        action={
          <Link href="/products">
            <Button>Browse products</Button>
          </Link>
        }
      />
    );
  }

  return <ProductGrid products={items} />;
}
