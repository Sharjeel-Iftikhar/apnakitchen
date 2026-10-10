import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <Container className="py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-4 text-5xl md:text-6xl">Checkout</h1>
      <p className="mt-3 mb-10 text-[15px] text-muted">No account needed. We&apos;ll call you to confirm before dispatch.</p>
      <CheckoutView />
    </Container>
  );
}
