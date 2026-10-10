import type { Metadata } from "next";
import { Check, PhoneCall, Package, Banknote } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

const next = [
  { icon: PhoneCall, title: "We'll call you", text: "Our team will call your mobile number shortly to confirm your order and address." },
  { icon: Package, title: "Packed with care", text: `Once confirmed, your order is packed and dispatched — usually delivered in ${siteConfig.shipping.deliveryEstimate}.` },
  { icon: Banknote, title: "Pay on delivery", text: "Pay in cash to the rider when your order arrives." },
];

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;

  return (
    <Container className="max-w-3xl py-16 text-center md:py-24">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success text-cream">
        <Check className="size-7" strokeWidth={2} />
      </span>
      <p className="eyebrow mt-8">Thank you</p>
      <h1 className="mt-3 text-5xl leading-none md:text-6xl">Your order is placed</h1>
      {id && (
        <p className="mt-5 text-[15px] text-muted">
          Order number <span className="font-medium text-ink">{id}</span>
        </p>
      )}

      <ol className="mt-14 grid gap-6 text-left sm:grid-cols-3">
        {next.map(({ icon: Icon, title, text }) => (
          <li key={title} className="bg-white p-6">
            <Icon className="size-5 text-terracotta" strokeWidth={1.5} />
            <h2 className="mt-4 text-xl">{title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm text-muted">
        Questions about your order? Call us on{" "}
        <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="text-ink underline underline-offset-4">
          {siteConfig.contact.phone}
        </a>
      </p>
      <ButtonLink href="/shop" variant="outline" className="mt-8">
        Continue shopping
      </ButtonLink>
    </Container>
  );
}
