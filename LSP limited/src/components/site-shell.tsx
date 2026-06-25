import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Toaster } from "@/components/ui/sonner";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster theme="dark" position="top-right" />
    </div>
  );
}