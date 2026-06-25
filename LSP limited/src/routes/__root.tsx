import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../hooks/use-auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LSP Limited — Affordable AI Tools, Software Licenses & Premium Courses" },
      { name: "description", content: "LSP Limited (Lowest Service Price): trusted digital marketplace for affordable AI tools, AI subscriptions, software licenses, premium courses, e-books and digital services with 15-minute activation." },
      { name: "author", content: "LSP Limited" },
      { name: "publisher", content: "LSP Limited" },
      { name: "application-name", content: "LSP Limited" },
      { name: "apple-mobile-web-app-title", content: "LSP Limited" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "theme-color", content: "#0b0b0f" },
      { name: "color-scheme", content: "dark light" },
      { name: "format-detection", content: "telephone=no" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
      { name: "googlebot", content: "index,follow" },
      { httpEquiv: "content-language", content: "en" },
      { property: "og:site_name", content: "LSP Limited" },
      { property: "og:title", content: "LSP Limited — Affordable AI Tools, Software Licenses & Premium Courses" },
      { property: "og:description", content: "LSP Limited (Lowest Service Price): trusted digital marketplace for affordable AI tools, AI subscriptions, software licenses, premium courses, e-books and digital services with 15-minute activation." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@LSPLimited" },
      { name: "twitter:title", content: "LSP Limited — Affordable AI Tools, Software Licenses & Premium Courses" },
      { name: "twitter:description", content: "LSP Limited (Lowest Service Price): trusted digital marketplace for affordable AI tools, AI subscriptions, software licenses, premium courses, e-books and digital services with 15-minute activation." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/602e9005-236a-4664-85eb-802582a6a428/id-preview-5834f3c3--97ef8df8-2894-4aeb-9667-cdb4e5f21174.lovable.app-1782360937341.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/602e9005-236a-4664-85eb-802582a6a428/id-preview-5834f3c3--97ef8df8-2894-4aeb-9667-cdb4e5f21174.lovable.app-1782360937341.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://pleasant-producer.lovable.app/#organization",
              name: "LSP Limited",
              alternateName: ["LSP", "LSPlimited", "Lowest Service Price"],
              url: "https://pleasant-producer.lovable.app/",
              description:
                "Trusted digital marketplace offering affordable AI tools, AI subscriptions, software licenses, premium courses, e-books and digital services.",
            },
            {
              "@type": "WebSite",
              "@id": "https://pleasant-producer.lovable.app/#website",
              url: "https://pleasant-producer.lovable.app/",
              name: "LSP Limited",
              publisher: { "@id": "https://pleasant-producer.lovable.app/#organization" },
              inLanguage: "en",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://pleasant-producer.lovable.app/shop?category={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
