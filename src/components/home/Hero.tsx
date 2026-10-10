import Image from "next/image";
import type { Homepage } from "@/types";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/** Headline with one word set in the italic accent (chosen in Studio → Homepage). */
function Headline({ text, highlight }: { text: string; highlight?: string }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <em className="text-terracotta">{highlight}</em>
      {text.slice(at + highlight.length)}
    </>
  );
}

export function Hero({ hero }: { hero: Homepage["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-sand">
      <Container className="grid items-center gap-10 py-14 md:grid-cols-12 md:gap-8 md:py-0">
        <div className="md:col-span-5 md:py-24 lg:py-32">
          {hero.eyebrow && <p className="eyebrow mb-5">{hero.eyebrow}</p>}
          <h1 className="text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
            <Headline text={hero.heading} highlight={hero.highlight} />
          </h1>
          {hero.text && (
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted md:text-base">{hero.text}</p>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/shop" size="lg">
              Shop the collection
            </ButtonLink>
            {hero.category && (
              <ButtonLink href={`/category/${hero.category.slug}`} size="lg" variant="outline">
                {hero.category.name}
              </ButtonLink>
            )}
          </div>
          <dl className="mt-12 flex gap-10 border-t border-ink/10 pt-6 text-sm">
            <div>
              <dt className="text-muted">Payment</dt>
              <dd className="mt-1 font-medium">Cash on delivery</dd>
            </div>
            <div>
              <dt className="text-muted">Delivery</dt>
              <dd className="mt-1 font-medium">Across Pakistan</dd>
            </div>
          </dl>
        </div>

        <div className="relative -mx-4 aspect-5/6 sm:mx-0 md:col-span-7 md:-mr-10 md:aspect-auto md:h-full md:min-h-[640px] lg:-mr-10">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover"
            style={hero.image.position ? { objectPosition: hero.image.position } : undefined}
          />
        </div>
      </Container>
    </section>
  );
}
