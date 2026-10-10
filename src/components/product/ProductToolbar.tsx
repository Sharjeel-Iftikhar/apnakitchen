"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category, SortOption } from "@/types";
import { cn } from "@/lib/utils";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "New arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

type Props = {
  categories: Category[];
  activeCategory?: string;
  count: number;
};

export function ProductToolbar({ categories, activeCategory, count }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const sort = (params.get("sort") as SortOption) ?? "featured";

  const onSort = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "featured") next.delete("sort");
    else next.set("sort", value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const chip = (active: boolean) =>
    cn(
      "shrink-0 border px-4 py-2 text-[13px] transition-colors",
      active ? "border-ink bg-ink text-cream" : "border-line bg-white hover:border-ink",
    );

  return (
    <div className="mb-10 flex flex-col gap-5 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
      <nav aria-label="Categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0 md:pb-0">
        <Link href="/shop" className={chip(!activeCategory)}>
          All
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className={chip(activeCategory === c.slug)}>
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-4 md:justify-end">
        <p className="whitespace-nowrap text-[13px] text-muted">{count} {count === 1 ? "product" : "products"}</p>
        <label className="flex items-center gap-2 text-[13px]">
          <span className="whitespace-nowrap text-muted">Sort by</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="border-b border-ink bg-transparent py-1 pr-1 font-medium focus:outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
