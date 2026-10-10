import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { HowItWorks } from "@/components/home/HowItWorks";

export const metadata: Metadata = {
  title: "About us",
  description: `The story behind ${siteConfig.name} and how delivery works.`,
};

export default function AboutPage() {
  const { shipping } = siteConfig;
  return (
    <>
      <PageHeader title="About us" crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <Container className="grid items-center gap-12 py-16 md:grid-cols-2 md:gap-20 md:py-24">
        <div className="relative aspect-10/11 bg-sand">
          <Image src="/images/story.svg" alt="Stoneware bowls" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow mb-4">Our story</p>
          <h2 className="text-4xl leading-[1.05] md:text-5xl">Beautiful crockery, made easy to buy</h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
            <p>
              {siteConfig.name} brings together dinner sets, stoneware and serveware we&apos;d happily use in our own
              homes. We look for pieces with a lovely finish, a good weight and the durability to handle everyday
              family meals.
            </p>
            <p>
              We keep ordering simple: no account, no card. Add what you like to your cart, share your address and
              we&apos;ll call you to confirm. You pay in cash when it arrives.
            </p>
          </div>
        </div>
      </Container>

      <div className="bg-white">
        <HowItWorks />
      </div>

      <Container id="delivery" className="scroll-mt-28 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Good to know</p>
            <h2 className="text-4xl leading-[1.05]">Delivery & returns</h2>
          </div>
          <dl className="grid gap-8 sm:grid-cols-2 md:col-span-8">
            <Info title="Delivery time">Orders are usually delivered in {shipping.deliveryEstimate} after confirmation.</Info>
            <Info title="Delivery charges">
              Free on orders over {formatPrice(shipping.freeShippingThreshold)}. Otherwise a flat {formatPrice(shipping.flatRate)}.
            </Info>
            <Info title="Payment">Cash on delivery only. Please keep the exact amount ready if possible.</Info>
            <Info title="Damaged items">
              Every piece is carefully packed. If anything arrives damaged, contact us within 48 hours with a photo and
              we&apos;ll replace it.
            </Info>
          </dl>
        </div>
      </Container>
    </>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-ink pt-5">
      <dt className="font-serif text-2xl">{title}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-muted">{children}</dd>
    </div>
  );
}
