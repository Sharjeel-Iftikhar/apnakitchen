import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            {c.href ? (
              <Link href={c.href} className="hover:text-ink">{c.label}</Link>
            ) : (
              <span className="text-ink" aria-current="page">{c.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight className="size-3" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ title, description, crumbs }: { title: string; description?: string; crumbs?: Crumb[] }) {
  return (
    <div className="border-b border-line bg-sand">
      <Container className="py-12 md:py-16">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="mt-4 text-5xl leading-none md:text-6xl">{title}</h1>
        {description && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">{description}</p>}
      </Container>
    </div>
  );
}
