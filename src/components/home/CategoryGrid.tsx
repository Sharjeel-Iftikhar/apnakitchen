import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Shop by category"
          title="Everything for the table"
          link={{ href: "/shop", label: "View all products" }}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="group block">
              <div className="relative aspect-4/5 overflow-hidden bg-sand md:aspect-5/6">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex items-start justify-between gap-3 pt-4">
                <div>
                  <h3 className="text-2xl leading-tight transition-colors group-hover:text-terracotta md:text-3xl">{c.name}</h3>
                  <p className="mt-1 hidden text-[13px] text-muted md:block">{c.description}</p>
                </div>
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-line transition-all group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-cream md:size-10">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
