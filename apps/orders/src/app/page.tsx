import { formatEGP, isLowStock, isPurchasable } from "@portfolio/orders-core";
import Link from "next/link";
import { store } from "@/lib/store";
import { ProductImage } from "@/components/ProductImage";
import { PersistenceBanner } from "@/components/PersistenceBanner";

// Product stock changes as orders are placed, so the catalogue is read per
// request rather than frozen at build time.
export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await store.listProducts();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <PersistenceBanner />

      <div className="mt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">/ the roastery</p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-[clamp(38px,6vw,68px)] font-semibold leading-[1.02] tracking-[-0.02em] text-[var(--color-neutral-800)]">
          Small-lot coffee, roasted to order.
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--color-neutral-600)]">
          Twelve single origins and blends. Free delivery over {formatEGP(100_000)}. Every bag ships within two days of roasting.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const soldOut = !isPurchasable(product);
          const low = isLowStock(product);
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/40 hover:shadow-[0_18px_40px_-24px_rgba(44,30,18,0.6)]"
            >
              <div className="relative aspect-square overflow-hidden">
                <ProductImage
                  name={product.name}
                  imageKey={product.imageKey}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {soldOut && (
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--color-neutral-950)]/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
                    Sold out
                  </span>
                )}
                {!soldOut && low && (
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--color-warning)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
                    Low stock — {product.stockQty} left
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)] transition-colors group-hover:text-[var(--color-accent)]">
                  {product.name}
                </h2>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--color-neutral-600)]">
                  {product.description}
                </p>
                <p className="mt-4 font-mono text-lg font-medium text-[var(--color-neutral-800)]">
                  {formatEGP(product.priceCents)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
