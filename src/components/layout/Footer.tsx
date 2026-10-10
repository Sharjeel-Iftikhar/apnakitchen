import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, type NavItem } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

const helpLinks = [
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Delivery & returns", href: "/about#delivery" },
  { label: "Your cart", href: "/cart" },
];

export function Footer({ nav }: { nav: NavItem[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-ink text-cream/80 md:mt-32">
      <Container className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Link href="/" className="font-serif text-3xl font-semibold text-cream">
            {siteConfig.name}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{siteConfig.description}</p>
          <div className="mt-6 flex gap-3">
            <a href={siteConfig.social.instagram} aria-label="Instagram" className="flex size-10 items-center justify-center border border-cream/20 transition-colors hover:border-cream hover:text-cream" target="_blank" rel="noreferrer">
              <InstagramIcon className="size-4" />
            </a>
            <a href={siteConfig.social.facebook} aria-label="Facebook" className="flex size-10 items-center justify-center border border-cream/20 transition-colors hover:border-cream hover:text-cream" target="_blank" rel="noreferrer">
              <FacebookIcon className="size-4" />
            </a>
          </div>
        </div>

        <FooterColumn title="Shop" className="md:col-span-2">
          {nav.map((l) => (
            <li key={l.href}><Link href={l.href} className="hover:text-cream">{l.label}</Link></li>
          ))}
        </FooterColumn>

        <FooterColumn title="Help" className="md:col-span-2">
          {helpLinks.map((l) => (
            <li key={l.href}><Link href={l.href} className="hover:text-cream">{l.label}</Link></li>
          ))}
        </FooterColumn>

        <FooterColumn title="Get in touch" className="md:col-span-4">
          <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0" /> <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="hover:text-cream">{siteConfig.contact.phone}</a></li>
          <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0" /> <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-cream">{siteConfig.contact.email}</a></li>
          <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0" /> {siteConfig.contact.address}</li>
          <li className="text-cream/50">{siteConfig.contact.hours}</li>
        </FooterColumn>
      </Container>

      <div className="border-t border-cream/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-cream/50 sm:flex-row sm:justify-between">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <p>Cash on delivery · Delivery across Pakistan</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-5 font-sans text-[11px] font-semibold tracking-(--tracking-label) text-cream uppercase">{title}</h3>
      <ul className="flex flex-col gap-3 text-sm">{children}</ul>
    </div>
  );
}
