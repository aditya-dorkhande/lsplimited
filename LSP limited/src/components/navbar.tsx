import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, Sparkles, User as UserIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "./auth-modal";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent glow-cyan">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              LSP<span className="text-gradient">limited</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`relative px-4 py-2 text-sm font-medium transition ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-primary to-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserIcon className="h-4 w-4" /> Profile
                </Button>
              </Link>
            ) : (
              <Button size="sm" onClick={() => setAuthOpen(true)} className="gap-2 hidden sm:flex">
                <UserIcon className="h-4 w-4" /> Sign in
              </Button>
            )}
            <Link to="/shop" className="hidden sm:block">
              <Button size="sm" variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" /> Shop
              </Button>
            </Link>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobile((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobile && (
          <div className="md:hidden border-t border-border/40 px-4 py-3 space-y-1 bg-background/90 backdrop-blur-xl">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobile(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            {!user && (
              <Button
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  setMobile(false);
                  setAuthOpen(true);
                }}
              >
                Sign in
              </Button>
            )}
          </div>
        )}
      </header>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}