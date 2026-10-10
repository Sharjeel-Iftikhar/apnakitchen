import Image from "next/image";
import type { SiteImage } from "@/types";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function StorySection({ image }: { image: SiteImage }) {
  return (
    <section className="bg-sand py-20 md:py-0">
      <Container className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-10/11 md:-ml-10 md:aspect-auto md:h-full md:min-h-[600px]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            style={image.position ? { objectPosition: image.position } : undefined}
          />
        </div>
        <div className="md:py-24">
          <p className="eyebrow mb-4">Our story</p>
          <h2 className="text-4xl leading-[1.05] md:text-5xl">Chosen piece by piece, for homes that love to host</h2>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            We started with a simple idea: good crockery shouldn&apos;t be hard to find. Every set in our collection is
            selected for its finish, its weight and how well it holds up to everyday family life — from Sunday
            breakfasts to Eid dinners.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Order online, and we&apos;ll personally call you to confirm your order before it&apos;s packed and sent.
          </p>
          <ButtonLink href="/about" variant="outline" className="mt-8">
            Read more about us
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
