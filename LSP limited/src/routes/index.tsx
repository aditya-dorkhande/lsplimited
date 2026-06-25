import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Zap, Clock, Globe2 } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { PRODUCTS, CATEGORIES } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LSP Limited — Affordable AI Tools, Software Licenses & Premium Courses" },
      { name: "description", content: "LSP Limited: lowest service price marketplace for AI tools, AI subscriptions, software licenses, premium courses, e-books and digital services. Activated in 15 minutes." },
      { name: "keywords", content: "LSP Limited, LSP, affordable AI tools, cheap AI tools, AI subscriptions, software licenses, premium courses, digital marketplace, digital products, e-books, learning resources" },
      { property: "og:title", content: "LSP Limited — Affordable AI Tools & Digital Marketplace" },
      { property: "og:description", content: "AI tools, software licenses, premium courses & digital services at the lowest service price." },
      { property: "og:url", content: "https://pleasant-producer.lovable.app/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://pleasant-producer.lovable.app/" },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = PRODUCTS.slice(0, 6);
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/3 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" /> Take whatever you want right now; who knows, we might not meet tomorrow.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05]"
          >
            Premium AI Tools<br />
            <span className="text-gradient">at a fraction of the price.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground"
          >
            Claude, ChatGPT, Higgsfield, ElevenLabs, HeyGen, OpenArt, Veo 3 and more — direct private accounts, activated on your email in ~15 minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link to="/shop">
              <Button size="lg" className="gap-2 glow-cyan">
                Browse all products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">Contact us</Button>
            </Link>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Clock, label: "~15 min activation" },
              { icon: ShieldCheck, label: "Private accounts" },
              { icon: Zap, label: "Direct logins" },
              { icon: Globe2, label: "Multi-device" },
            ].map((f) => (
              <div key={f.label} className="glass rounded-xl p-4 text-center">
                <f.icon className="mx-auto h-5 w-5 text-primary" />
                <div className="mt-2 text-xs font-medium">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c === "All" ? undefined : c }}
              className="rounded-full glass px-4 py-1.5 text-sm hover:text-primary transition"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Featured Products</h2>
            <p className="mt-1 text-muted-foreground text-sm">Top picks across AI, video, voice and image.</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <h2 className="relative font-display text-3xl md:text-4xl font-bold">Need something custom?</h2>
          <p className="relative mt-2 text-muted-foreground">Tell us what you need — we'll find it at the best rate.</p>
          <Link to="/contact" className="relative inline-block mt-6">
            <Button size="lg" className="gap-2">Talk to us <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
