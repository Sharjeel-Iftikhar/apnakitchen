"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

export function AddToCart({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  if (!product.inStock) {
    return (
      <div className="space-y-3">
        <Button disabled size="lg" fullWidth variant="outline">
          Sold out
        </Button>
        <p className="text-center text-xs text-muted">Contact us to be notified when it&apos;s back.</p>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(
      { productId: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0] },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex gap-3">
      <QuantitySelector value={qty} onChange={setQty} />
      <Button size="lg" className="flex-1" onClick={handleAdd}>
        {added ? (
          <>
            <Check className="size-4" /> Added
          </>
        ) : (
          "Add to cart"
        )}
      </Button>
    </div>
  );
}
