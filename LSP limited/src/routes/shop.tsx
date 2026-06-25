import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import { z } from "zod";
import { SiteShell } from "@/components/site-shell";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS, CATEGORIES } from "@/data/products";

const searchSchema = z.object({ category: z.string().optional() });

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop AI Tools, Software & Courses — LSP Limited" },
      { name: "description", content: "Browse and compare AI tool subscriptions, software licenses, premium courses and digital services at the lowest prices on LSP Limited." },
      { property: "og:title", content: "Shop — LSP Limited" },
      { property: "og:description", content: "Browse AI tools, subscriptions, software licenses and premium courses." },
      { property: "og:url", content: "https://pleasant-producer.lovable.app/shop" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://pleasant-producer.lovable.app/shop" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Shop — LSP Limited",
          url: "https://pleasant-producer.lovable.app/shop",
          isPartOf: { "@id": "https://pleasant-producer.lovable.app/#website" },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pleasant-producer.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Shop", item: "https://pleasant-producer.lovable.app/shop" },
            ],
          },
        }),
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const [cat, setCat] = useState<string>(category ?? "All");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => (cat === "All" ? true : p.category === cat));
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(t) || p.tagline.toLowerCase().includes(t),
      );
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [cat, q]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="mb-6 text-center text-sm md:text-base font-medium text-primary animate-fade-in pulse">
          If you need anything else at the lowest price, just talk to me.
        </p>
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            <span className="text-gradient">Shop</span> the Marketplace
          </h1>
          <p className="mt-2 text-muted-foreground">All products. All categories. Special rates today.</p>
        </div>

        <div className="mt-8 glass rounded-2xl p-4 flex flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 bg-background/40 border-border/50"
            />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger
              className="h-10 w-10 p-0 justify-center bg-background/40 border-border/50 rounded-md [&>svg:last-child]:hidden"
              aria-label="Filter by category"
            >
              <Filter className="h-4 w-4 text-muted-foreground" />
            </SelectTrigger>
            <SelectContent align="end">
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No products match your search.</p>
        )}
      </section>
    </SiteShell>
  );
}