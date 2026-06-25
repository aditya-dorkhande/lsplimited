import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import type { Product } from "@/data/products";
import { BRAND_IMAGES } from "@/data/brand-images";
import { Button } from "@/components/ui/button";
import { BuyNowDialog } from "./buy-now-dialog";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [planIdx, setPlanIdx] = useState(0);
  const [buyOpen, setBuyOpen] = useState(false);
  const plan = product.plans[planIdx];
  const brandImage = BRAND_IMAGES[product.id];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        whileHover={{ y: -4 }}
        className="group glass rounded-2xl overflow-hidden flex flex-col"
      >
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start gap-4">
            <motion.div
              className={`relative shrink-0 h-16 w-16 rounded-full overflow-hidden ring-1 ring-border/40 ${brandImage ? "" : `bg-gradient-to-br ${product.gradient} grid place-items-center`}`}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.2 }}
            >
              {brandImage ? (
                <img
                  src={brandImage}
                  alt={`${product.name} logo`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl">{product.emoji}</span>
              )}
            </motion.div>
            <div className="min-w-0 flex-1">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-background/60 backdrop-blur text-foreground/80 border border-border/40">
                {product.category}
              </span>
              <Link to="/product/$id" params={{ id: product.id }} className="block hover:text-primary transition">
                <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{product.name}</h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.tagline}</p>
              {product.credits && (
                <p className="mt-1 text-xs text-primary/90 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> {product.credits}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {product.plans.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPlanIdx(i)}
                className={`rounded-lg border px-2 py-1.5 text-[11px] font-medium transition ${
                  planIdx === i
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-border"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{plan.label}</div>
              <div className="font-display text-2xl font-bold text-gradient">₹{plan.price.toLocaleString()}</div>
            </div>
            <Button size="sm" className="gap-1.5" onClick={() => setBuyOpen(true)}>
              Buy <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
      <BuyNowDialog open={buyOpen} onOpenChange={setBuyOpen} product={product} planIndex={planIdx} />
    </>
  );
}