import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Zap } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { BuyNowDialog } from "@/components/buy-now-dialog";
import { getProduct, SERVICE_FEATURES, PRODUCTS, type Product } from "@/data/products";
import { BRAND_IMAGES } from "@/data/brand-images";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Lowest Price on LSP Limited` },
          { name: "description", content: `${loaderData.product.name}: ${loaderData.product.tagline} Available on LSP Limited at the lowest service price with 15-minute activation.` },
          { property: "og:title", content: `${loaderData.product.name} — LSP Limited` },
          { property: "og:description", content: loaderData.product.tagline },
          { property: "og:type", content: "product" },
          { property: "og:url", content: `https://pleasant-producer.lovable.app/product/${loaderData.product.id}` },
          { property: "product:category", content: loaderData.product.category },
        ]
      : [],
    links: loaderData
      ? [{ rel: "canonical", href: `https://pleasant-producer.lovable.app/product/${loaderData.product.id}` }]
      : [],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: loaderData.product.name,
              description: loaderData.product.tagline,
              category: loaderData.product.category,
              brand: { "@type": "Brand", name: "LSP Limited" },
              url: `https://pleasant-producer.lovable.app/product/${loaderData.product.id}`,
              offers: loaderData.product.plans.map((p) => ({
                "@type": "Offer",
                name: p.label,
                price: p.price,
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: `https://pleasant-producer.lovable.app/product/${loaderData.product.id}`,
                seller: { "@type": "Organization", name: "LSP Limited" },
              })),
            }),
          },
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pleasant-producer.lovable.app/" },
                { "@type": "ListItem", position: 2, name: "Shop", item: "https://pleasant-producer.lovable.app/shop" },
                { "@type": "ListItem", position: 3, name: loaderData.product.name, item: `https://pleasant-producer.lovable.app/product/${loaderData.product.id}` },
              ],
            }),
          },
        ]
      : [],
  }),
  notFoundComponent: NotFound,
  errorComponent: ({ error }) => {
    console.error("Product route error:", error);
    return (
      <SiteShell>
        <div className="py-24 text-center text-muted-foreground">Failed to load product. Please try again.</div>
      </SiteShell>
    );
  },
  component: ProductPage,
});

function NotFound() {
  return (
    <SiteShell>
      <div className="py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">Back to shop</Link>
      </div>
    </SiteShell>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [planIdx, setPlanIdx] = useState(0);
  const [buyOpen, setBuyOpen] = useState(false);
  const plan = product.plans[planIdx];
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const brandImage = BRAND_IMAGES[product.id];

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="mt-6 grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-2 glass rounded-3xl p-10 bg-gradient-to-br ${product.gradient} grid place-items-center min-h-[320px] relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_60%)]" />
            {brandImage ? (
              <div className="relative h-48 w-48 rounded-full overflow-hidden ring-1 ring-border/40 bg-background/20">
                <img src={brandImage} alt={`${product.name} logo`} className="h-full w-full object-cover" />
              </div>
            ) : (
              <span className="text-9xl">{product.emoji}</span>
            )}
          </motion.div>

          <div className="lg:col-span-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{product.category}</span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">{product.name}</h1>
            <p className="mt-3 text-muted-foreground">{product.tagline}</p>
            {product.credits && (
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-primary">
                <Zap className="h-4 w-4" /> {product.credits}
              </p>
            )}

            <div className="mt-6 glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Choose your plan</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {product.plans.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => setPlanIdx(i)}
                    className={`rounded-xl border p-3 text-left transition ${
                      planIdx === i
                        ? "border-primary bg-primary/10 glow-cyan"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="text-xs text-muted-foreground">{p.label}</div>
                    <div className="font-display text-xl font-bold">₹{p.price.toLocaleString()}</div>
                  </button>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Selected · {plan.label}</div>
                  <div className="font-display text-3xl font-bold text-gradient">₹{plan.price.toLocaleString()}</div>
                </div>
                <Button size="lg" className="glow-cyan" onClick={() => setBuyOpen(true)}>
                  Buy Now
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold">Service Features</h2>
              <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                {SERVICE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-primary flex-none" /> {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                ⚠ Please do not request "Payment After Activation". Take whatever you want right now; who knows, we might not meet tomorrow.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">Related products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => {
                const relImg = BRAND_IMAGES[p.id];
                return (
                <Link
                  key={p.id}
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="glass rounded-2xl p-5 hover:border-primary/50 transition flex items-center gap-4"
                >
                  {relImg ? (
                    <div className={`h-12 w-12 rounded-full overflow-hidden ring-1 ring-border/40 bg-gradient-to-br ${p.gradient}`}>
                      <img src={relImg} alt={`${p.name} logo`} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <span className="text-4xl">{p.emoji}</span>
                  )}
                  <div>
                    <div className="font-display font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{p.tagline}</div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <BuyNowDialog open={buyOpen} onOpenChange={setBuyOpen} product={product} planIndex={planIdx} />
    </SiteShell>
  );
}