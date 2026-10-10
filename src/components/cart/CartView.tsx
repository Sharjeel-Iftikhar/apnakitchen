"use client";

import { ShoppingBag } from "lucide-react";
import { selectSubtotal, useCart } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { ButtonLink } from "@/components/ui/Button";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingProgress } from "./FreeShippingProgress";
import { OrderTotals } from "./OrderTotals";

export function CartView() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);

  if (!mounted) return <div className="h-96" aria-busy />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="size-12 text-muted" strokeWidth={1.2} />
        <p className="font-serif text-3xl">Your cart is empty</p>
        <p className="text-sm text-muted">Looks like you haven&apos;t added anything yet.</p>
        <ButtonLink href="/shop" className="mt-4">
          Continue shopping
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <div className="hidden border-b border-line pb-3 text-[11px] font-medium tracking-(--tracking-label) text-muted uppercase md:block">
          Product
        </div>
        <ul className="divide-y divide-line border-b border-line">
          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}
        </ul>
      </div>

      <aside className="lg:col-span-5">
        <div className="bg-white p-6 md:p-8 lg:sticky lg:top-28">
          <h2 className="mb-6 text-2xl">Summary</h2>
          <div className="mb-6">
            <FreeShippingProgress subtotal={subtotal} />
          </div>
          <OrderTotals subtotal={subtotal} />
          <ButtonLink href="/checkout" size="lg" fullWidth className="mt-8">
            Proceed to checkout
          </ButtonLink>
          <ButtonLink href="/shop" variant="ghost" fullWidth className="mt-2">
            Continue shopping
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}
