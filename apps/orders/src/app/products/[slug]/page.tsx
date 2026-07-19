import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEGP, isLowStock, isPurchasable } from "@portfolio/orders-core";
import { store } from "@/lib/store";
import { ProductImage } from "@/components/ProductImage";
import { AddToCart } from "@/components/AddToCart";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await store.getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Kahwa Supply`,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await store.getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const soldOut = !isPurchasable(product);
  const low = isLowStock(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "EGP",
      availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)]">
        ← All coffee
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="overflow-hidden rounded-3xl border border-[var(--color-neutral-200)]">
          <ProductImage name={product.name} imageKey={product.imageKey} className="aspect-square w-full" />
        </div>

        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(30px,4.5vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--color-neutral-800)]">
            {product.name}
          </h1>
          <p className="mt-4 font-mono text-2xl font-medium text-[var(--color-neutral-800)]">
            {formatEGP(product.priceCents)}
          </p>
          <p className="mt-5 text-[16px] leading-relaxed text-[var(--color-neutral-700)]">{product.description}</p>

          {soldOut ? (
            <p className="mt-8 rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] px-4 py-3 font-mono text-xs text-[var(--color-neutral-600)]">
              Sold out. This lot has shipped — check back after the next roast.
            </p>
          ) : (
            <>
              {low && (
                <p className="mt-6 font-mono text-xs text-[var(--color-warning)]">
                  Only {product.stockQty} bag{product.stockQty === 1 ? "" : "s"} left in this roast.
                </p>
              )}
              <div className="mt-6">
                <AddToCart
                  product={{
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    unitPriceCents: product.priceCents,
                    imageKey: product.imageKey,
                  }}
                  maxQty={product.stockQty}
                />
              </div>
            </>
          )}

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-[var(--color-neutral-200)] pt-6 font-mono text-xs text-[var(--color-neutral-600)]">
            <div>
              <dt className="text-[var(--color-neutral-400)]">Delivery</dt>
              <dd className="mt-1">Free over {formatEGP(100_000)}, else {formatEGP(6_000)}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-neutral-400)]">Roasted</dt>
              <dd className="mt-1">To order, ships within 2 days</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
