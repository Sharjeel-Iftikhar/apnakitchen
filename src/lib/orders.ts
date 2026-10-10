"use server";

// Server action that receives the checkout form: validates, re-prices the cart
// from the CMS, saves the order to Sanity and emails it to the shop.

import { checkoutSchema, normalizePkMobile, type CheckoutInput } from "@/lib/validation";
import { getProductsByIds } from "@/lib/api";
import { getShippingCost } from "@/lib/utils";
import { hasOrderDestination, saveOrder, sendOrderEmails } from "@/lib/order-notify";
import { verifyTurnstile } from "@/lib/turnstile";

/** `price` is what the customer saw — used only to detect changes, never to charge. */
type OrderLine = { productId: string; quantity: number; price?: number };

export type PlaceOrderResult =
  | { ok: true; orderId: string; total: number }
  | {
      ok: false;
      fieldErrors?: Partial<Record<keyof CheckoutInput, string>>;
      message?: string;
      /** Cart items that can't be ordered any more (removed or sold out). */
      unavailable?: string[];
      /** Current prices for items whose price changed since they were added to the cart. */
      priceChanges?: Record<string, number>;
    };

/** e.g. ORD-261003-K7QM: date for the client's reference + 4 random chars. */
function createOrderNumber() {
  const now = new Date();
  const date = now.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" }).replace(/-/g, "").slice(2);
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid misreading on calls
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => alphabet[b % alphabet.length]).join("");
  return `ORD-${date}-${rand}`;
}

export async function placeOrder(
  input: CheckoutInput & { website?: string; turnstileToken?: string },
  lines: OrderLine[],
): Promise<PlaceOrderResult> {
  // Honeypot: real users never fill this hidden field. Pretend success so bots move on.
  if (input.website) return { ok: true, orderId: "ORD-000000", total: 0 };

  if (!(await verifyTurnstile(input.turnstileToken))) {
    return { ok: false, message: "Please complete the security check and try again." };
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof CheckoutInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof CheckoutInput;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  if (lines.length === 0 || lines.length > 50) return { ok: false, message: "Your cart is empty." };

  // Never trust prices from the browser — look them up again (uncached).
  const products = await getProductsByIds([...new Set(lines.map((l) => String(l.productId)))]);
  const unavailable: string[] = [];
  const priceChanges: Record<string, number> = {};
  const items = lines.flatMap((l) => {
    const p = products.find((x) => x.id === l.productId);
    if (!p || !p.inStock) {
      unavailable.push(l.productId);
      return [];
    }
    if (l.price !== undefined && l.price !== p.price) priceChanges[p.id] = p.price;
    const quantity = Math.max(1, Math.min(20, Math.floor(Number(l.quantity) || 1)));
    return [{ productId: p.id, name: p.name, price: p.price, quantity, lineTotal: p.price * quantity }];
  });

  // Don't silently drop items: the customer should see a correct total before ordering.
  if (unavailable.length > 0) {
    return {
      ok: false,
      unavailable,
      priceChanges,
      message:
        items.length === 0
          ? "The items in your cart are no longer available. Please refresh the shop and add them again."
          : "Some items in your cart are sold out or no longer available. We've removed them; please review your order and place it again.",
    };
  }

  // Same for prices: the total the customer confirms must match what we'll collect.
  if (Object.keys(priceChanges).length > 0) {
    return {
      ok: false,
      priceChanges,
      message: "Some prices have changed since you added these items. We've updated your order; please review the total and place it again.",
    };
  }

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;
  const orderNumber = createOrderNumber();
  const { notes, email, ...rest } = parsed.data;

  const order = {
    orderNumber,
    placedAt: new Date().toISOString(),
    customer: { ...rest, phone: normalizePkMobile(rest.phone), email, ...(notes ? { notes } : {}) },
    items,
    subtotal,
    shipping,
    total,
  };

  // Save first (the record of truth), then email. A failed email never loses the order.
  const saved = await saveOrder(order);
  const emailed = await sendOrderEmails(order, saved);

  if (!saved && !emailed) {
    console.error("[order] NOT saved or emailed", order);
    // In production, tell the customer rather than show a false "order placed".
    if (hasOrderDestination) {
      return { ok: false, message: "Sorry, we couldn't place your order just now. Please try again, or message us on WhatsApp." };
    }
    // Local dev with no Sanity token / Resend key: the server log above is the record.
  } else {
    console.info("[order]", orderNumber, { saved, emailed, total });
  }

  return { ok: true, orderId: orderNumber, total };
}
