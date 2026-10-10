import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const threshold = siteConfig.shipping.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div>
      <p className="text-[13px]">
        {remaining > 0 ? (
          <>
            You&apos;re <span className="font-semibold">{formatPrice(remaining)}</span> away from free delivery
          </>
        ) : (
          <span className="font-medium text-success">You&apos;ve unlocked free delivery</span>
        )}
      </p>
      <div className="mt-2.5 h-1 w-full overflow-hidden bg-sand-dark" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-terracotta transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
