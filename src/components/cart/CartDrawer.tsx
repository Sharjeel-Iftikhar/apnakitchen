"use client";

import { useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { selectSubtotal, useCart } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingProgress } from "./FreeShippingProgress";

export function CartDrawer() {
  const mounted = useMounted();
  const { items, isOpen, closeCart } = useCart();
  const subtotal = useCart(selectSubtotal);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="animate-fade-in absolute inset-0 bg-ink/40" onClick={closeCart} />
      <aside className="animate-slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-line px-5 md:h-20 md:px-6">
          <h2 className="text-2xl">Your cart</h2>
          <button type="button" onClick={closeCart} aria-label="Close cart" className="-mr-2 p-2">
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-10 text-muted" strokeWidth={1.2} />
            <p className="font-serif text-2xl">Your cart is empty</p>
            <p className="text-sm text-muted">Find something beautiful for your table.</p>
            <ButtonLink href="/shop" onClick={closeCart} className="mt-2">
              Start shopping
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-5 py-4 md:px-6">
              <FreeShippingProgress subtotal={subtotal} />
            </div>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5 md:px-6">
              {items.map((item) => (
                <CartLineItem key={item.productId} item={item} onNavigate={closeCart} />
              ))}
            </ul>
            <div className="border-t border-line bg-white px-5 py-5 md:px-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-lg font-semibold tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                Delivery calculated at checkout · Pay cash on delivery
              </p>
              <div className="mt-5 grid gap-2">
                <ButtonLink href="/checkout" onClick={closeCart} size="lg" fullWidth>
                  Checkout
                </ButtonLink>
                <ButtonLink href="/cart" onClick={closeCart} variant="ghost" size="md" fullWidth>
                  View cart
                </ButtonLink>
              </div>
              <p className="mt-3 text-center text-[11px] text-muted">
                We&apos;ll call you to confirm before dispatch · {siteConfig.shipping.deliveryEstimate}
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
