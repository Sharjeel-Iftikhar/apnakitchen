import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategories, getCategory, getProducts } from "@/lib/api";
import type { SortOption } from "@/types";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductToolbar } from "@/components/product/ProductToolbar";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: SortOption }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, { sort }] = await Promise.all([params, searchParams]);
  const category = await getCategory(slug);
  if (!category) notFound();

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: slug, sort }),
  ]);

  return (
    <>
      <PageHeader
        title={category.name}
        description={category.description}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]}
      />
      <Container className="py-10 md:py-14">
        <Suspense>
          <ProductToolbar categories={categories} activeCategory={slug} count={products.length} />
        </Suspense>
        <ProductGrid products={products} />
      </Container>
    </>
  );
}
