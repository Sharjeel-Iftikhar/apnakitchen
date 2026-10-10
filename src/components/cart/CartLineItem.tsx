"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

export function CartLineItem({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <li className="flex gap-4 py-5">
      <Link href={`/product/${item.slug}`} onClick={onNavigate} className="relative aspect-4/5 w-20 shrink-0 overflow-hidden bg-sand sm:w-24">
        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <Link href={`/product/${item.slug}`} onClick={onNavigate} className="font-serif text-lg leading-snug hover:text-terracotta">
            {item.name}
          </Link>
          <p className="shrink-0 text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</p>
        </div>
        <p className="mt-0.5 text-xs text-muted">{formatPrice(item.price)} each</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantitySelector size="sm" value={item.quantity} onChange={(q) => updateQuantity(item.productId, q)} />
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="-mr-2 px-2 py-3 text-xs text-muted underline underline-offset-4 hover:text-ink"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
