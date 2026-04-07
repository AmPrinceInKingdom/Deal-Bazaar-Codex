"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Global Deals, Local Trust",
    subtitle:
      "Discover curated products from trusted suppliers with secure checkout and fast support.",
    cta: "Shop now",
    href: "/products",
  },
  {
    title: "Flash Deals Up To 45% Off",
    subtitle:
      "Limited-time offers on trending gadgets, lifestyle essentials, and top-rated picks.",
    cta: "View flash deals",
    href: "/products?sort=featured",
  },
  {
    title: "Built For Smart Shopping",
    subtitle:
      "Compare categories, filter by budget, and buy with confidence on Deal Bazaar.",
    cta: "Browse categories",
    href: "/products",
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const slide = slides[active];

  return (
    <section className="animated-reveal">
      <div className="gradient-banner overflow-hidden rounded-3xl p-8 text-white sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Deal Bazaar Marketplace
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/90 sm:text-lg">
              {slide.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={slide.href}>
                <Button
                  size="lg"
                  className="bg-white text-[#570e0e] hover:bg-white/90"
                >
                  {slide.cta}
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white">
                  Contact sales
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
            <h2 className="text-lg font-bold">Why customers choose us</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              <li>Verified product listings and quality checks</li>
              <li>Secure payments with upload-based verification</li>
              <li>Transparent order tracking and status updates</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {slides.map((item, idx) => (
            <button
              key={item.title}
              className={`h-2 rounded-full transition ${
                idx === active ? "w-8 bg-white" : "w-3 bg-white/45"
              }`}
              onClick={() => setActive(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
