"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import type { Product } from "@/types/domain";

const WISHLIST_STORAGE_KEY = "deal-bazaar-wishlist";

type WishlistContextValue = {
  items: Product[];
  itemIds: Set<string>;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Product[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggleWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast.success("Removed from wishlist");
        return prev.filter((item) => item.id !== product.id);
      }
      toast.success("Added to wishlist");
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const itemIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);

  const value = useMemo(
    () => ({
      items,
      itemIds,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist: (id: string) => itemIds.has(id),
    }),
    [items, itemIds, toggleWishlist, removeFromWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
}
