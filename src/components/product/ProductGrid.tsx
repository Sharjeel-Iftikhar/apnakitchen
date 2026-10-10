import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-line py-20 text-center">
        <p className="font-serif text-2xl">No products here yet</p>
        <p className="mt-2 text-sm text-muted">Check back soon — new pieces are added regularly.</p>
      </div>
    );
  }
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-14", className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
