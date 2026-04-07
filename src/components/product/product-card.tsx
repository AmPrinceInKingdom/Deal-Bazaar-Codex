"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import type { Product } from "@/types/domain";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        {product.discount ? <Badge variant="danger">-{product.discount}%</Badge> : null}
        {product.featured ? <Badge>Featured</Badge> : null}
      </div>

      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-3 space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.category?.name ?? "Category"}
        </p>
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-base font-bold">{product.name}</h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.short_description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold text-primary">
            {formatCurrency(product.price)}
          </span>
          {product.old_price ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.old_price)}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex-1" onClick={() => addToCart(product)}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        </div>
      </div>
    </article>
  );
}
