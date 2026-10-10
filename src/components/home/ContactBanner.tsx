import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { buttonStyles } from "@/components/ui/Button";

export function ContactBanner() {
  return (
    <section>
      <Container>
        <div className="flex flex-col items-start gap-8 bg-terracotta px-6 py-12 text-cream md:flex-row md:items-center md:justify-between md:px-14 md:py-16">
          <div className="max-w-xl">
            <h2 className="text-4xl leading-tight md:text-5xl">Need help choosing?</h2>
            <p className="mt-3 text-[15px] text-cream/85">
              Ordering for a wedding, a gift or a new home? Message us and we&apos;ll help you put together the perfect set.
            </p>
          </div>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles({ size: "lg", variant: "light" })}
          >
            <WhatsAppIcon className="size-5" /> Chat on WhatsApp
          </a>
        </div>
      </Container>
    </section>
  );
}
