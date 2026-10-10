import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Banknote, PhoneCall, Truck } from "lucide-react";
import { getCategory, getProduct, getProducts, getRelatedProducts } from "@/lib/api";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductDetails } from "@/components/product/ProductDetails";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategory(product.categorySlug),
    getRelatedProducts(product, 4),
  ]);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <>
      <Container className="pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </Container>

      <Container className="grid gap-10 py-8 md:py-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            {category && <p className="eyebrow">{category.name}</p>}
            <h1 className="mt-3 text-4xl leading-[1.05] md:text-5xl">{product.name}</h1>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-2xl font-medium tabular-nums">{formatPrice(product.price)}</span>
              {onSale && (
                <>
                  <span className="text-muted line-through tabular-nums">{formatPrice(product.compareAtPrice!)}</span>
                  <span className="text-xs font-semibold tracking-wide text-terracotta uppercase">
                    Save {formatPrice(product.compareAtPrice! - product.price)}
                  </span>
                </>
              )}
            </div>
            {product.pieces && <p className="mt-2 text-sm text-muted">{product.pieces}</p>}

            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">{product.description}</p>

            <div className="mt-8">
              <AddToCart product={product} />
            </div>

            <ul className="mt-8 grid gap-3 border-y border-line py-6 text-sm">
              <li className="flex items-center gap-3"><Banknote className="size-4 text-terracotta" /> Cash on delivery available</li>
              <li className="flex items-center gap-3"><Truck className="size-4 text-terracotta" /> Delivered in {siteConfig.shipping.deliveryEstimate}</li>
              <li className="flex items-center gap-3"><PhoneCall className="size-4 text-terracotta" /> We call to confirm every order</li>
            </ul>

            <ProductDetails product={product} />
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="pt-16 md:pt-24">
          <Container>
            <SectionHeading eyebrow="You may also like" title="Complete the table" />
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
    </>
  );
}
