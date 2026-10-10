import "@/app/globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getCategories } from "@/lib/api";
import { shopAllLink, type NavItem } from "@/config/site";

// Storefront chrome + styles. Lives here (not in the root layout) so the
// embedded Sanity Studio at /studio renders without the shop's header,
// footer or Tailwind base styles.
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const categories = await getCategories().catch((err) => {
    console.error("[nav] couldn't load categories", err);
    return [];
  });
  const nav: NavItem[] = [shopAllLink, ...categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` }))];

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <AnnouncementBar />
      <Header nav={nav} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer nav={nav} />
      <CartDrawer />
    </div>
  );
}
