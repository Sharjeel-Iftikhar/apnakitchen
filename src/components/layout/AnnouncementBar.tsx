import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2.5 text-center text-[11px] font-medium tracking-[0.12em] text-cream uppercase">
      <span className="hidden sm:inline">Cash on delivery nationwide</span>
      <span className="mx-3 hidden text-cream/40 sm:inline">·</span>
      <span>Free delivery on orders over {formatPrice(siteConfig.shipping.freeShippingThreshold)}</span>
    </div>
  );
}
