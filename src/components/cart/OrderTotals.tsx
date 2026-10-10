import { formatPrice, getShippingCost } from "@/lib/utils";

export function OrderTotals({ subtotal }: { subtotal: number }) {
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Delivery</dt>
        <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Payment</dt>
        <dd>Cash on delivery</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <dt className="font-medium">Total</dt>
        <dd className="text-xl font-semibold tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}
