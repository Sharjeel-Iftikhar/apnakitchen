"use client";

import Image from "next/image";
import { selectSubtotal, useCart } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { OrderTotals } from "@/components/cart/OrderTotals";

export function CheckoutSummary() {
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);

  return (
    <div className="bg-white p-6 md:p-8">
      <h2 className="mb-6 text-2xl">Order summary</h2>
      <ul className="mb-6 space-y-4 border-b border-line pb-6">
        {items.map((i) => (
          <li key={i.productId} className="flex items-center gap-4">
            <div className="relative aspect-4/5 w-14 shrink-0 bg-sand">
              <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
              <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-cream">
                {i.quantity}
              </span>
            </div>
            <p className="flex-1 text-sm leading-snug">{i.name}</p>
            <p className="text-sm tabular-nums">{formatPrice(i.price * i.quantity)}</p>
          </li>
        ))}
      </ul>
      <OrderTotals subtotal={subtotal} />
    </div>
  );
}
