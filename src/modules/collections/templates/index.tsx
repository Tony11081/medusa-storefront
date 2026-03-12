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
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[var(--brand-line)] bg-[linear-gradient(145deg,rgba(255,250,244,0.98),rgba(238,226,212,0.92))] shadow-[0_22px_60px_rgba(16,21,31,0.08)]">
          <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1 className="mt-3 font-display text-4xl leading-none tracking-[-0.03em] text-[var(--brand-ink)] md:text-5xl">
                {collection.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
                {copy.intro}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {copy.buyerPoints.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.4rem] border border-black/5 bg-white/82 px-4 py-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--brand-soft)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-ink)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
          />
        </Suspense>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-[1.4rem] border border-[var(--brand-line)] bg-white/88 p-5"
            >
              <p className="text-sm font-medium text-[var(--brand-ink)]">
                {item.question}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
