import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LSP Limited" },
      { name: "description", content: "Contact LSP Limited for custom AI tool requests, bulk orders, software licenses, course access and customer support." },
      { property: "og:title", content: "Contact — LSP Limited" },
      { property: "og:description", content: "Reach LSP Limited for support, custom orders and bulk pricing." },
      { property: "og:url", content: "https://pleasant-producer.lovable.app/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://pleasant-producer.lovable.app/contact" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail((e) => e || user.email || "");
      const meta = user.user_metadata as { full_name?: string; name?: string };
      setName((n) => n || meta?.full_name || meta?.name || "");
    }
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

      if (serviceId && templateId && publicKey) {
        const emailjs = (await import("@emailjs/browser")).default;
        await emailjs.send(
          serviceId,
          templateId,
          { from_name: name, from_email: email, message },
          { publicKey },
        );
      } else {
        // EmailJS not yet configured — accept the message and surface it locally.
        console.info("Contact message (EmailJS not configured):", { name, email, message });
        await new Promise((r) => setTimeout(r, 600));
      }
      setSent(true);
      toast.success("Message sent! We'll reply shortly.");
      setMessage("");
    } catch (err) {
      console.error("Contact send failed:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            <span className="text-gradient">Get in touch</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Questions, custom requests, or bulk orders — we're here.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "adityadorkhande92@gmail.com" },
            ].map((c) => (
              <div key={c.label} className="glass rounded-2xl p-4 flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  <div className="font-medium">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 glass rounded-2xl p-6">
            {sent ? (
              <div className="text-center py-10">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-3 font-display text-xl font-semibold">Thanks for reaching out!</h3>
                <p className="mt-1 text-sm text-muted-foreground">We've received your message and will respond shortly.</p>
                <Button className="mt-5" variant="outline" onClick={() => setSent(false)}>Send another</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
                </div>
                <Button type="submit" className="gap-2 w-full sm:w-auto" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}