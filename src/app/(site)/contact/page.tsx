import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonStyles } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

export const metadata: Metadata = { title: "Contact", description: `Get in touch with ${siteConfig.name}.` };

export default function ContactPage() {
  const { contact } = siteConfig;
  const rows = [
    { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: "Showroom", value: contact.address },
    { icon: Clock, label: "Hours", value: contact.hours },
  ];

  return (
    <>
      <PageHeader
        title="Contact us"
        description="Questions about a product, an order or bulk orders for events? We're happy to help."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Container className="grid gap-12 py-16 md:grid-cols-2 md:gap-20 md:py-24">
        <div>
          <h2 className="text-4xl">Talk to us</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            The quickest way to reach us is WhatsApp. For order changes, please include your order number.
          </p>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles({ size: "lg", variant: "secondary" }) + " mt-8"}
          >
            <WhatsAppIcon className="size-5" /> Message on WhatsApp
          </a>
        </div>
        <dl className="divide-y divide-line border-y border-line">
          {rows.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-5 py-6">
              <Icon className="mt-0.5 size-5 shrink-0 text-terracotta" strokeWidth={1.5} />
              <div>
                <dt className="text-[11px] font-medium tracking-(--tracking-label) text-muted uppercase">{label}</dt>
                <dd className="mt-1 text-[15px]">
                  {href ? <a href={href} className="hover:text-terracotta">{value}</a> : value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}
