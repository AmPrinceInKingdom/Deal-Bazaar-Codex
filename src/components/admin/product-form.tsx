"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Category, Product } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function specsToText(specs: Record<string, string> = {}) {
  return Object.entries(specs)
    .map(([key, value]) => `${key}:${value}`)
    .join("\n");
}

function parseSpecs(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, line) => {
      const [key, ...rest] = line.split(":");
      if (!key || rest.length === 0) return acc;
      acc[key.trim()] = rest.join(":").trim();
      return acc;
    }, {});
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product | null;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [oldPrice, setOldPrice] = useState(String(product?.old_price ?? ""));
  const [stock, setStock] = useState(String(product?.stock_quantity ?? ""));
  const [sku, setSku] = useState(product?.sku ?? "");
  const [shortDescription, setShortDescription] = useState(
    product?.short_description ?? "",
  );
  const [fullDescription, setFullDescription] = useState(
    product?.full_description ?? "",
  );
  const [mainImage, setMainImage] = useState(product?.main_image ?? "");
  const [gallery, setGallery] = useState(
    product?.gallery_images.join("\n") ?? "",
  );
  const [videoUrl, setVideoUrl] = useState(product?.video_url ?? "");
  const [featured, setFeatured] = useState(Boolean(product?.featured));
  const [specifications, setSpecifications] = useState(
    specsToText(product?.specifications),
  );

  const stockStatus = useMemo(() => {
    const quantity = Number(stock);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return "out_of_stock";
    }
    if (quantity < 10) {
      return "low_stock";
    }
    return "in_stock";
  }, [stock]);

  const saveProduct = async () => {
    const payload = {
      name,
      slug,
      category_id: categoryId,
      price: Number(price),
      old_price: oldPrice ? Number(oldPrice) : null,
      stock_quantity: Number(stock),
      stock_status: stockStatus,
      sku,
      short_description: shortDescription,
      full_description: fullDescription,
      specifications: parseSpecs(specifications),
      main_image: mainImage,
      gallery_images: gallery
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 5),
      video_url: videoUrl || null,
      featured,
      related_product_ids: product?.related_product_ids ?? [],
    };

    setIsSaving(true);
    const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    setIsSaving(false);

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      toast.error(body.error ?? "Failed to save product.");
      return;
    }

    toast.success(product ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div className="surface p-6">
      <h2 className="text-xl font-bold">
        {product ? "Edit Product" : "Add New Product"}
      </h2>
      <div className="mt-4 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
          <Input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Old Price"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <Input
            placeholder="Video URL (optional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <Textarea
          placeholder="Short description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
        <Textarea
          rows={6}
          placeholder="Full description"
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
        />
        <Input
          placeholder="Main image URL"
          value={mainImage}
          onChange={(e) => setMainImage(e.target.value)}
        />
        <Textarea
          rows={5}
          placeholder="Gallery image URLs (one per line, max 5)"
          value={gallery}
          onChange={(e) => setGallery(e.target.value)}
        />
        <Textarea
          rows={5}
          placeholder="Specifications (format: Key:Value, one per line)"
          value={specifications}
          onChange={(e) => setSpecifications(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Mark as featured product
        </label>

        <Button onClick={saveProduct} disabled={isSaving}>
          {isSaving ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </div>
  );
}
