import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold">
              LSP<span className="text-gradient">limited</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            A premium digital marketplace for AI tools, software licenses, courses and creative services — activated in minutes.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/shop" className="hover:text-foreground">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Notice</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Prepaid service only. Please do not request "Payment After Activation". Special rates valid for today only.
          </p>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LSPlimited. All rights reserved.
      </div>
    </footer>
  );
}