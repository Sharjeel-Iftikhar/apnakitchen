"use client";

import { useCart } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { ButtonLink } from "@/components/ui/Button";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutSummary } from "./CheckoutSummary";

export function CheckoutView() {
  const mounted = useMounted();
  const count = useCart((s) => s.items.length);

  if (!mounted) return <div className="h-96" aria-busy />;

  if (count === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="font-serif text-3xl">There&apos;s nothing to check out yet</p>
        <p className="text-sm text-muted">Add a few pieces to your cart first.</p>
        <ButtonLink href="/shop" className="mt-4">Browse the shop</ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="order-2 lg:order-1 lg:col-span-7">
        <CheckoutForm />
      </div>
      <aside className="order-1 lg:order-2 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <CheckoutSummary />
        </div>
      </aside>
    </div>
  );
}
