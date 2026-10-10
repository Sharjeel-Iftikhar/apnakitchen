"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const addItem = useCart((s) => s.addItem);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-4/5 overflow-hidden bg-sand">
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5">
          {!product.inStock && <Badge tone="muted">Sold out</Badge>}
          {product.inStock && onSale && <Badge tone="sale">Sale</Badge>}
          {product.inStock && !onSale && product.isNew && <Badge>New</Badge>}
        </div>

        {product.inStock && (
          <button
            type="button"
            onClick={() =>
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
              })
            }
            className="absolute inset-x-3 bottom-3 hidden h-11 translate-y-2 items-center justify-center gap-2 bg-cream/95 text-[13px] font-medium opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ink hover:text-cream focus-visible:translate-y-0 focus-visible:opacity-100 md:flex"
          >
            <Plus className="size-4" /> Add to cart
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-serif text-lg leading-snug md:text-xl">
          <Link href={`/product/${product.slug}`} className="hover:text-terracotta">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-[13px] text-muted">{product.shortDescription}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-medium tabular-nums">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-xs text-muted line-through tabular-nums">{formatPrice(product.compareAtPrice!)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
