import Image from "next/image"

import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { countryNames, siteContent } from "@lib/site-content"

type EditorialHomeProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const EditorialHome = ({ products, region }: EditorialHomeProps) => {
  const productMap = new Map(
    products
      .filter((product): product is HttpTypes.StoreProduct & { handle: string } =>
        Boolean(product.handle)
      )
      .map((product) => [product.handle, product])
  )

  const featuredProducts = siteContent.featureHandles
    .map((handle) => productMap.get(handle))
    .filter(Boolean) as HttpTypes.StoreProduct[]

  const heroLead = featuredProducts[0]
  const range = collectPriceRange(products)

  return (
    <div className="pb-24">
      <section className="content-container pt-8 pb-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--brand-ink)] text-white shadow-[0_30px_90px_rgba(16,21,31,0.18)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,164,109,0.32),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
          <div className="relative grid gap-10 px-6 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-14 xl:px-14 xl:py-16">
            <div className="flex flex-col justify-between gap-10">
              <div className="max-w-2xl">
                <p className="eyebrow mb-5 text-[rgba(255,245,230,0.86)]">
                  {siteContent.eyebrow}
                </p>
                <h1 className="font-display text-5xl leading-[0.92] tracking-[-0.04em] md:text-7xl">
                  A precise wardrobe system for moving through the city.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-[rgba(255,245,230,0.78)] md:text-lg">
                  {siteContent.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <LocalizedClientLink href="/store" className="brand-button">
                    Shop the capsule
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/about"
                    className="brand-button brand-button-secondary"
                  >
                    Read the brand brief
                  </LocalizedClientLink>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard label="Range" value={range} />
                <StatCard label="Core pillars" value="Tops / Bottoms / Carry" />
                <StatCard label="Mood" value="Editorial, technical, restrained" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-rows-[minmax(340px,1fr)_auto]">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
                {heroLead?.thumbnail ? (
                  <Image
                    src={heroLead.thumbnail}
                    alt={heroLead.title ?? siteContent.name}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,15,22,0.94)] via-[rgba(10,15,22,0.4)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <div>
                    <p className="eyebrow text-[rgba(255,245,230,0.8)]">
                      Featured layer
                    </p>
                    <h2 className="mt-2 font-display text-4xl leading-none tracking-[-0.03em]">
                      {heroLead?.title ?? siteContent.name}
                    </h2>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-[rgba(255,245,230,0.8)]">
                      {heroLead?.description ??
                        "Built to move easily across studio sessions, airport gates, and everyday city routes."}
                    </p>
                  </div>
                  {heroLead?.handle ? (
                    <LocalizedClientLink
                      href={`/products/${heroLead.handle}`}
                      className="rounded-full border border-white/25 px-4 py-2 text-sm uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[var(--brand-ink)]"
                    >
                      View
                    </LocalizedClientLink>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {featuredProducts.slice(1, 3).map((product) => (
                  <MiniFeatureCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-container grid gap-6 py-8 md:grid-cols-3">
        {siteContent.categoryCards.map((card) => (
          <CategoryCard
            key={card.title}
            title={card.title}
            href={card.href}
            description={card.description}
            product={productMap.get(card.handle) ?? null}
          />
        ))}
      </section>

      <section className="content-container py-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <p className="eyebrow">Wardrobe Logic</p>
            <h2 className="font-display text-4xl leading-none tracking-[-0.03em] text-[var(--brand-ink)] md:text-5xl">
              Built as a tight rotation, not a noisy catalog.
            </h2>
            <p className="max-w-md text-base leading-7 text-[var(--brand-muted)]">
              The assortment is intentionally compact. Tops carry the visual
              weight, bottoms soften the silhouette, and accessories finish the
              system without overcomplicating it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {siteContent.valueProps.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[var(--brand-line)] bg-white/85 p-6 shadow-[0_18px_50px_rgba(16,21,31,0.06)]"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--brand-accent)]">
                  {item.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--brand-muted)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-container py-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Capsule Picks</p>
            <h2 className="font-display text-4xl leading-none tracking-[-0.03em] text-[var(--brand-ink)] md:text-5xl">
              The pieces that define the mood.
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="text-sm uppercase tracking-[0.22em] text-[var(--brand-accent)] transition hover:text-[var(--brand-ink)]"
          >
            View full store
          </LocalizedClientLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductPreview
              key={product.id}
              product={product}
              region={region}
              isFeatured
            />
          ))}
        </div>
      </section>

      <section className="content-container py-14">
        <div className="rounded-[2rem] border border-[var(--brand-line)] bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(244,237,226,0.92))] px-6 py-8 shadow-[0_18px_60px_rgba(16,21,31,0.07)] md:px-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow">From material to movement</p>
              <h2 className="font-display text-4xl leading-none tracking-[-0.03em] text-[var(--brand-ink)] md:text-5xl">
                Quietly premium. Easy to repeat. Ready to travel.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredProducts.slice(0, 2).map((product) => (
                <div
                  key={product.id}
                  className="rounded-[1.5rem] border border-[var(--brand-line)] bg-white p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand-accent)]">
                    {product.material ?? "Capsule essential"}
                  </p>
                  <h3 className="mt-3 text-xl font-medium text-[var(--brand-ink)]">
                    {product.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                    {product.description}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--brand-soft)]">
                    {product.origin_country
                      ? `Origin ${countryNames[product.origin_country] ?? product.origin_country.toUpperCase()}`
                      : "Global wardrobe staple"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[rgba(255,245,230,0.6)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[rgba(255,245,230,0.92)]">
        {value}
      </p>
    </div>
  )
}

function CategoryCard({
  title,
  href,
  description,
  product,
}: {
  title: string
  href: string
  description: string
  product: HttpTypes.StoreProduct | null
}) {
  return (
    <LocalizedClientLink
      href={href}
      className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--brand-line)] bg-white p-6 shadow-[0_18px_50px_rgba(16,21,31,0.05)] transition duration-300 hover:-translate-y-1"
    >
      <div className="relative z-10 max-w-[15rem]">
        <p className="eyebrow">{title}</p>
        <h3 className="mt-3 font-display text-4xl leading-none tracking-[-0.03em] text-[var(--brand-ink)]">
          {title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-[var(--brand-muted)]">
          {description}
        </p>
        <span className="mt-6 inline-flex text-xs uppercase tracking-[0.22em] text-[var(--brand-accent)]">
          Explore
        </span>
      </div>

      {product?.thumbnail ? (
        <div className="absolute bottom-0 right-0 h-40 w-36 overflow-hidden rounded-tl-[1.4rem] opacity-90 transition duration-500 group-hover:scale-[1.02]">
          <Image
            src={product.thumbnail}
            alt={product.title ?? title}
            fill
            className="object-cover"
          />
        </div>
      ) : null}
    </LocalizedClientLink>
  )
}

function MiniFeatureCard({ product }: { product: HttpTypes.StoreProduct }) {
  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-[rgba(255,245,230,0.58)]">
        {product.material ?? "Capsule essential"}
      </p>
      <p className="mt-3 text-lg font-medium text-white">{product.title}</p>
      <p className="mt-2 text-sm leading-6 text-[rgba(255,245,230,0.74)]">
        {product.description}
      </p>
    </LocalizedClientLink>
  )
}

function collectPriceRange(products: HttpTypes.StoreProduct[]) {
  const prices = products.flatMap((product) =>
    (product.variants ?? [])
      .map((variant) => variant.calculated_price?.calculated_amount)
      .filter((value): value is number => typeof value === "number")
  )

  if (!prices.length) {
    return "Curated essentials"
  }

  const min = Math.min(...prices) / 100
  const max = Math.max(...prices) / 100

  return `EUR ${min.toFixed(0)}-${max.toFixed(0)}`
}

export default EditorialHome
