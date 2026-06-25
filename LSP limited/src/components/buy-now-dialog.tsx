import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/data/products";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "./auth-modal";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { createPurchase } from "@/lib/purchases.functions";

export function BuyNowDialog({
  open,
  onOpenChange,
  product,
  planIndex,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product;
  planIndex: number;
}) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const plan = product.plans[planIndex];
  const submitPurchase = useServerFn(createPurchase);

  useEffect(() => {
    if (user) setEmail(user.email ?? "");
  }, [user]);

  // If opened while signed out, divert to auth modal
  useEffect(() => {
    if (open && !user) {
      onOpenChange(false);
      setAuthOpen(true);
    }
  }, [open, user, onOpenChange]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await submitPurchase({
        data: {
          productId: product.id,
          planLabel: plan.label,
          contactEmail: email,
          contactPhone: phone,
          notes,
        },
      });
      // Send email notification via EmailJS
      try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
        if (serviceId && templateId && publicKey) {
          const emailjs = (await import("@emailjs/browser")).default;
          await emailjs.send(
            serviceId,
            templateId,
            {
              from_name: user.user_metadata?.full_name || user.email || "Customer",
              from_email: email,
              message:
                `🛒 NEW PURCHASE REQUEST\n\n` +
                `Product: ${product.name}\n` +
                `Category: ${product.category}\n` +
                `Plan: ${plan.label}\n` +
                `Price: ₹${plan.price.toLocaleString()}\n\n` +
                `Customer: ${user.user_metadata?.full_name || "-"}\n` +
                `User ID: ${user.id}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone}\n` +
                `Notes: ${notes || "-"}`,
            },
            { publicKey },
          );
        }
      } catch (mailErr) {
        console.warn("EmailJS notification failed:", mailErr);
      }
      setSuccess(true);
      toast.success("Request received! We'll activate within ~15 minutes.");
    } catch (err) {
      console.error("Purchase request failed:", err);
      toast.error("Could not submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open && !!user}
        onOpenChange={(v) => {
          onOpenChange(v);
          if (!v) setSuccess(false);
        }}
      >
        <DialogContent className="glass border-border/50 sm:max-w-md">
          {success ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-3 font-display text-xl font-semibold">Request received</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your purchase request for <b>{product.name}</b> ({plan.label}) has been saved. You'll find it in your Profile under purchase history.
              </p>
              <Button className="mt-4 w-full" onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Request {product.name}</DialogTitle>
                <DialogDescription>
                  {plan.label} — <span className="text-gradient font-semibold">₹{plan.price.toLocaleString()}</span>
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div>
                  <Label htmlFor="bn-email">Activation email</Label>
                  <Input id="bn-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="bn-phone">WhatsApp / Phone</Label>
                  <Input id="bn-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" required />
                </div>
                <div>
                  <Label htmlFor="bn-notes">Notes (optional)</Label>
                  <Textarea id="bn-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Prepaid only. Please do not request "Payment After Activation". Activation in ~15 minutes after payment confirmation.
                </p>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit purchase request
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          setAuthOpen(false);
          onOpenChange(true);
        }}
      />
    </>
  );
}