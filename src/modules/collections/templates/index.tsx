import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { getCollectionPageCopy } from "@lib/util/archive-copy"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const copy = getCollectionPageCopy(collection)

  return (
    <div className="content-container py-6 md:py-10">
      <section className="editorial-surface overflow-hidden rounded-[2px] px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-display text-[3rem] leading-[0.96] tracking-[-0.05em] text-[var(--brand-ink)] sm:text-5xl md:text-7xl">
              {collection.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--brand-muted)]">
              {copy.intro}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {copy.buyerPoints.map((item) => (
              <div
                key={item.label}
                className="border-b border-[var(--brand-line)] pb-4 last:border-b-0 lg:border-l lg:pl-6"
              >
                <p className="soft-caption">{item.label}</p>
                <p className="mt-3 text-base leading-7 text-[var(--brand-muted)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider mt-10 pt-10">
        <RefinementList sortBy={sort} />
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            editorialInterlude={{
              eyebrow: "Collection Story",
              title: "An editorial collection page should pace the shopper, not rush them.",
              body:
                "This collection is framed like a small campaign: hero copy first, then refined sorting, then a product grid broken by a narrative moment that keeps the brand voice alive.",
              ctaLabel: "See the full archive",
              ctaHref: `/${countryCode}/store`,
            }}
          />
        </Suspense>
      </section>

      <section className="mt-12 grid gap-4 xl:mt-16 xl:grid-cols-3">
        {copy.faqItems.map((item) => (
          <div
            key={item.question}
            className="rounded-[2px] border border-[var(--brand-line)] bg-[rgba(252,251,248,0.82)] p-5"
          >
            <p className="text-base font-medium text-[var(--brand-ink)]">
              {item.question}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              {item.answer}
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}
