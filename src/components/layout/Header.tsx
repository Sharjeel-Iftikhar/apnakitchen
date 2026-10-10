"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { HEADER_CATEGORY_LIMIT, siteConfig, type NavItem } from "@/config/site";
import { selectCount, useCart } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

export function Header({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = useCart(selectCount);
  const openCart = useCart((s) => s.openCart);
  const mounted = useMounted();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-cream/95 backdrop-blur transition-colors",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 md:h-20">
        {/* Mobile menu toggle */}
        <button
          type="button"
          className="-ml-2 p-2 xl:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-5" />
        </button>

        {/* Logo */}
        <Link href="/" className="font-serif text-2xl leading-none font-semibold tracking-tight md:text-[28px]">
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden flex-1 justify-center xl:flex">
          <ul className="flex items-center gap-7">
            {nav.slice(0, HEADER_CATEGORY_LIMIT + 1).map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative py-2 text-[13px] font-medium tracking-wide transition-colors hover:text-terracotta",
                      active && "text-terracotta",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href="/contact" className="hidden px-3 text-[13px] font-medium hover:text-terracotta md:block xl:hidden">
            Contact
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative -mr-2 p-2"
            aria-label={`Open cart${mounted && count ? `, ${count} items` : ""}`}
          >
            <ShoppingBag className="size-5" strokeWidth={1.6} />
            {mounted && count > 0 && (
              <span className="absolute top-0.5 right-0 flex size-4.5 items-center justify-center rounded-full bg-terracotta text-[10px] font-semibold text-cream tabular-nums">
                {count}
              </span>
            )}
          </button>
        </div>
      </Container>
    </header>

      {/* Mobile drawer — rendered outside <header>: its backdrop-blur would
          otherwise trap this fixed overlay inside the header's box. */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="animate-fade-in absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
          <div className="animate-fade-in absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-cream">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <span className="font-serif text-2xl font-semibold">{siteConfig.name}</span>
              <button type="button" className="p-2" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="flex flex-col">
                {nav.map((item) => (
                  <li key={item.href} className="border-b border-line">
                    <Link href={item.href} className="block py-4 font-serif text-2xl">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-8 flex flex-col gap-3 text-sm text-muted">
                <li><Link href="/about">About us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </nav>
            <div className="border-t border-line px-4 py-5 text-xs text-muted">
              Questions? Call {siteConfig.contact.phone}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
