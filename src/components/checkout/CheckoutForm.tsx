"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Loader2, Lock } from "lucide-react";
import { useCart } from "@/store/cart-store";
import { placeOrder } from "@/lib/orders";
import { PAKISTAN_CITIES, checkoutSchema, type CheckoutInput } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/FormField";
import { Turnstile, turnstileSiteKey, type TurnstileHandle } from "./Turnstile";

type Errors = Partial<Record<keyof CheckoutInput, string>>;

const initial: CheckoutInput = { fullName: "", phone: "", email: "", city: "", address: "", notes: "" };

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const removeItem = useCart((s) => s.removeItem);
  const setPrices = useCart((s) => s.setPrices);
  const [values, setValues] = useState<CheckoutInput>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const turnstile = useRef<TurnstileHandle>(null);
  const onToken = useCallback((t: string | undefined) => setTurnstileToken(t), []);

  const set = (key: keyof CheckoutInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(undefined);

    // Validate in the browser first for instant feedback (server validates again).
    const parsed = checkoutSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof CheckoutInput;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }

    const website = (new FormData(e.currentTarget).get("website") as string) || "";
    if (turnstileSiteKey && !turnstileToken) {
      setFormError("Please complete the security check above the button.");
      return;
    }

    startTransition(async () => {
      const res = await placeOrder(
        { ...values, website, turnstileToken },
        items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
      );
      if (res.ok) {
        clear();
        router.push(`/order-success?id=${encodeURIComponent(res.orderId)}`);
      } else {
        if (res.fieldErrors) setErrors(res.fieldErrors);
        res.unavailable?.forEach(removeItem);
        if (res.priceChanges) setPrices(res.priceChanges);
        turnstile.current?.reset(); // tokens are single-use
        setFormError(res.message ?? "Please check the highlighted fields.");
      }
    });
  };

  const err = (k: keyof CheckoutInput) => errors[k];

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      {/* Contact */}
      <fieldset className="space-y-5">
        <legend className="mb-5 font-serif text-2xl">Contact details</legend>
        <FieldWrapper label="Full name" htmlFor="fullName" error={err("fullName")}>
          <Input id="fullName" name="fullName" autoComplete="name" value={values.fullName} onChange={set("fullName")} invalid={!!err("fullName")} aria-describedby={err("fullName") ? "fullName-error" : undefined} />
        </FieldWrapper>
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="Mobile number" htmlFor="phone" error={err("phone")} hint="We'll call this number to confirm your order">
            <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567" value={values.phone} onChange={set("phone")} invalid={!!err("phone")} aria-describedby={err("phone") ? "phone-error" : undefined} />
          </FieldWrapper>
          <FieldWrapper label="Email" htmlFor="email" optional error={err("email")} hint="For your order confirmation">
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={set("email")} invalid={!!err("email")} aria-describedby={err("email") ? "email-error" : undefined} />
          </FieldWrapper>
        </div>
      </fieldset>

      {/* Delivery */}
      <fieldset className="space-y-5">
        <legend className="mb-5 font-serif text-2xl">Delivery address</legend>
        <FieldWrapper label="City" htmlFor="city" error={err("city")}>
          <Select id="city" name="city" autoComplete="address-level2" value={values.city} onChange={set("city")} invalid={!!err("city")} aria-describedby={err("city") ? "city-error" : undefined}>
            <option value="">Select your city</option>
            {PAKISTAN_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Complete address" htmlFor="address" error={err("address")} hint="House / flat number, street, area and any nearby landmark">
          <Textarea id="address" name="address" autoComplete="street-address" rows={3} value={values.address} onChange={set("address")} invalid={!!err("address")} aria-describedby={err("address") ? "address-error" : undefined} />
        </FieldWrapper>
        <FieldWrapper label="Order notes" htmlFor="notes" optional>
          <Textarea id="notes" name="notes" rows={2} placeholder="Preferred call time, gift message, etc." value={values.notes} onChange={set("notes")} />
        </FieldWrapper>
      </fieldset>

      {/* Payment */}
      <fieldset>
        <legend className="mb-5 font-serif text-2xl">Payment</legend>
        <div className="flex items-start gap-4 border border-ink bg-white p-5">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-ink">
            <span className="size-2.5 rounded-full bg-ink" />
          </span>
          <div className="flex-1">
            <p className="flex items-center gap-2 font-medium">
              <Banknote className="size-4 text-terracotta" /> Cash on delivery
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              Pay in cash when your order arrives. We&apos;ll call you to confirm your order before dispatch.
            </p>
          </div>
        </div>
      </fieldset>

      {/* Honeypot (hidden from humans) */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Turnstile ref={turnstile} onToken={onToken} />

      {formError && (
        <p role="alert" className="border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {formError}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" fullWidth disabled={pending || items.length === 0}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Placing order…
            </>
          ) : (
            "Place order"
          )}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
          <Lock className="size-3" /> Your details are only used to deliver your order.
        </p>
      </div>
    </form>
  );
}
