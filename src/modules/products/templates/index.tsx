import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div className="content-container pt-4 md:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-soft)]"
        >
          <LocalizedClientLink href="/">Home</LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink href="/store">Archive</LocalizedClientLink>
          {product.categories?.[0]?.handle && product.categories?.[0]?.name ? (
            <>
              <span>/</span>
              <LocalizedClientLink href={`/categories/${product.categories[0].handle}`}>
                {product.categories[0].name}
              </LocalizedClientLink>
            </>
          ) : null}
          <span>/</span>
          <span className="text-[var(--brand-ink)]">{product.title}</span>
        </nav>
      </div>
      <section
        className="content-container relative grid gap-6 py-6 pb-[calc(env(safe-area-inset-bottom)+7rem)] md:gap-8 md:py-8 md:pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start lg:gap-10 lg:pb-8"
        data-testid="product-container"
      >
        <div className="relative block w-full">
          <ImageGallery product={product} images={images} />
        </div>
        <div className="flex w-full flex-col gap-y-5 md:gap-y-6 lg:sticky lg:top-28">
          <div className="editorial-surface rounded-[2px] p-6 md:p-7">
            <ProductInfo product={product} />
          </div>
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <div className="editorial-surface rounded-[2px] p-6 md:p-7">
              <ProductActionsWrapper id={product.id} region={region} />
            </div>
          </Suspense>
          <div className="hidden rounded-[2px] border border-[var(--brand-line)] bg-[rgba(252,251,248,0.84)] px-5 py-5 md:block">
            <p className="soft-caption">Trust elements</p>
            <div className="mt-4 grid gap-3">
              <p className="text-sm leading-7 text-[var(--brand-muted)]">
                Free shipping messaging, easy-return reassurance, and project
                support are surfaced here to keep the sticky module conversion-focused.
              </p>
              <div className="grid gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-soft)]">
                <span>Free shipping over qualifying orders</span>
                <span>Project guidance before larger purchases</span>
                <span>Clear unit-based pricing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-container pb-[calc(env(safe-area-inset-bottom)+7rem)] pt-4 md:pb-10 md:pt-8">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <ProductTabs product={product} />
          </div>
          <article className="editorial-surface rounded-[2px] px-6 py-8 md:px-8">
            <p className="eyebrow">Behind the design</p>
            <h2 className="mt-4 max-w-2xl font-display text-[2.35rem] leading-[0.98] tracking-[-0.05em] text-[var(--brand-ink)] md:text-5xl">
              A product detail page should feel immersive before it asks for the add-to-cart.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">
              The left column is intentionally media-led, while the right column
              keeps variant selection, price, and reassurance fixed in view. That
              balance is the core of the new editorial commerce direction.
            </p>
            <div className="mt-8 grid gap-5 border-t border-[var(--brand-line)] pt-6 md:grid-cols-2">
              <div>
                <p className="soft-caption">Materials & care</p>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                  Accordions below the fold keep technical information available
                  without crowding the purchase module.
                </p>
              </div>
              <div>
                <p className="soft-caption">Related products</p>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                  Cross-sell appears after confidence is established, not before.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div
        className="content-container my-12 small:my-24"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
