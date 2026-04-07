import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://deal-bazaar.com"),
  title: {
    default: "Deal Bazaar | Global Marketplace",
    template: "%s | Deal Bazaar",
  },
  description:
    "Deal Bazaar is a modern global dropshipping marketplace with verified products, secure payments, and fast order tracking.",
  keywords: [
    "Deal Bazaar",
    "e-commerce",
    "marketplace",
    "dropshipping",
    "online shopping",
    "global delivery",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
