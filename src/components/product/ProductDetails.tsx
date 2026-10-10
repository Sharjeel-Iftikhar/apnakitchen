import { ChevronDown } from "lucide-react";
import type { Product } from "@/types";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

// Native <details> accordions — accessible and no JS needed.
export function ProductDetails({ product }: { product: Product }) {
  const sections = [
    {
      title: "Details",
      open: true,
      content: (
        <dl className="grid grid-cols-[110px_1fr] gap-y-2 text-sm">
          <dt className="text-muted">Material</dt>
          <dd>{product.material}</dd>
          {product.pieces && (
            <>
              <dt className="text-muted">Includes</dt>
              <dd>{product.pieces}</dd>
            </>
          )}
          {product.dimensions && (
            <>
              <dt className="text-muted">Size</dt>
              <dd>{product.dimensions}</dd>
            </>
          )}
        </dl>
      ),
    },
    { title: "Care", content: <p className="text-sm leading-relaxed text-muted">{product.care}</p> },
    {
      title: "Delivery & returns",
      content: (
        <p className="text-sm leading-relaxed text-muted">
          Delivery across Pakistan in {siteConfig.shipping.deliveryEstimate}. Free delivery on orders over{" "}
          {formatPrice(siteConfig.shipping.freeShippingThreshold)}, otherwise {formatPrice(siteConfig.shipping.flatRate)}.
          If anything arrives damaged, let us know within 48 hours and we&apos;ll replace it.
        </p>
      ),
    },
  ];

  return (
    <div className="divide-y divide-line border-b border-line">
      {sections.map((s) => (
        <details key={s.title} open={s.open} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
            {s.title}
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="pt-4">{s.content}</div>
        </details>
      ))}
    </div>
  );
}
