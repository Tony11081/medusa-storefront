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
        <div className="mb-8">
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
