import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, ShoppingBag, User as UserIcon, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "@/components/auth-modal";
import { toast } from "sonner";

type Purchase = {
  id: string;
  product_id: string;
  product_name: string;
  plan_label: string;
  price: number;
  status: string;
  created_at: string;
};

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Purchase History — LSP Limited" },
      { name: "description", content: "View your LSP Limited account details and purchase request history." },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, loading, signOut } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user) {
      setBusy(false);
      return;
    }
    setBusy(true);
    supabase
      .from("purchases")
      .select("id, product_id, product_name, plan_label, price, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Load purchases failed:", error);
          toast.error("Could not load purchases. Please try again.");
        } else setPurchases((data as Purchase[]) ?? []);
        setBusy(false);
      });
  }, [user]);

  if (loading) {
    return (
      <SiteShell>
        <div className="py-24 grid place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </SiteShell>
    );
  }

  if (!user) {
    return (
      <SiteShell>
        <div className="py-24 text-center max-w-md mx-auto">
          <UserIcon className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-bold">Sign in to view your profile</h1>
          <p className="mt-2 text-muted-foreground">Track your purchase requests and activation status.</p>
          <SignInButton />
        </div>
      </SiteShell>
    );
  }

  const meta = user.user_metadata as { full_name?: string; name?: string };
  const displayName = meta?.full_name || meta?.name || user.email?.split("@")[0];

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground">
              {displayName?.[0]?.toUpperCase() ?? "U"}
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold">{displayName}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Purchase history
          </h2>
          <div className="mt-4">
            {busy ? (
              <div className="py-10 grid place-items-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : purchases.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center">
                <p className="text-muted-foreground">No purchase requests yet.</p>
                <Link to="/shop" className="mt-4 inline-block">
                  <Button>Browse the shop</Button>
                </Link>
              </div>
            ) : (
              <div className="glass rounded-2xl divide-y divide-border/50 overflow-hidden">
                {purchases.map((p) => (
                  <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <Link to="/product/$id" params={{ id: p.product_id }} className="font-display font-semibold hover:text-primary">
                        {p.product_name}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {p.plan_label} · {new Date(p.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gradient">₹{Number(p.price).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function SignInButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="mt-6" onClick={() => setOpen(true)}>Sign in</Button>
      <AuthModal open={open} onOpenChange={setOpen} />
    </>
  );
}