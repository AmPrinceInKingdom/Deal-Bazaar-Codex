import { CategoryGrid } from "@/components/home/category-grid";
import { HeroSlider } from "@/components/home/hero-slider";
import { Newsletter } from "@/components/home/newsletter";
import { ProductSection } from "@/components/home/product-section";
import { PromoBanners } from "@/components/home/promo-banners";
import { TrustBadges } from "@/components/home/trust-badges";
import { getCategories } from "@/lib/services/categories";
import {
  getFeaturedProducts,
  getFlashDealProducts,
  getTrendingProducts,
} from "@/lib/services/products";

export default async function HomePage() {
  const [categories, featured, trending, flashDeals] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getTrendingProducts(),
    getFlashDealProducts(),
  ]);

  return (
    <div className="container-wrap py-8 sm:py-10">
      <HeroSlider />
      <CategoryGrid categories={categories} />
      <ProductSection
        title="Featured Products"
        subtitle="Handpicked inventory promoted by the Deal Bazaar admin team."
        products={featured}
        href="/products?sort=featured"
      />
      <ProductSection
        title="Trending Products"
        subtitle="Top-selling and most viewed products this week."
        products={trending}
      />
      <ProductSection
        title="Flash Deals"
        subtitle="Limited-time discounts. Prices can change anytime."
        products={flashDeals}
      />
      <PromoBanners />
      <TrustBadges />
      <Newsletter />
    </div>
  );
}
