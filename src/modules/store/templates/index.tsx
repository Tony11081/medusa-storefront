import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[var(--brand-line)] bg-[linear-gradient(145deg,rgba(255,250,244,0.98),rgba(238,226,212,0.92))] shadow-[0_22px_60px_rgba(16,21,31,0.08)]">
          <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="eyebrow">Textile Archive</p>
              <h1
                className="mt-3 font-display text-4xl leading-none tracking-[-0.03em] text-[var(--brand-ink)] md:text-5xl"
                data-testid="store-page-title"
              >
                Designer fabrics by the yard
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
                Browse jacquard, leather, vinyl, lining, denim, cotton, and
                upholstery materials from the Atelier Fabrics catalog.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.4rem] border border-black/5 bg-white/82 px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--brand-soft)]">
                  Units
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-ink)]">
                  1 yard per order line
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-black/5 bg-white/82 px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--brand-soft)]">
                  Pricing
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-ink)]">
                  Fabric USD 35, leather and vinyl USD 45
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-black/5 bg-white/82 px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--brand-soft)]">
                  Focus
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-ink)]">
                  Upholstery, soft goods, wall panels, and bespoke projects
                </p>
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
