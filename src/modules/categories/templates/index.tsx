import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { getCategoryPageCopy } from "@lib/util/archive-copy"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const copy = getCategoryPageCopy(category)

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} data-testid="sort-by-container" />
      <div className="w-full">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[var(--brand-line)] bg-[linear-gradient(145deg,rgba(255,250,244,0.98),rgba(238,226,212,0.92))] shadow-[0_22px_60px_rgba(16,21,31,0.08)]">
          <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[var(--brand-soft)]">
                {parents &&
                  parents.map((parent) => (
                    <LocalizedClientLink
                      key={parent.id}
                      className="transition hover:text-[var(--brand-ink)]"
                      href={`/categories/${parent.handle}`}
                      data-testid="sort-by-link"
                    >
                      {parent.name}
                    </LocalizedClientLink>
                  ))}
                <span>{copy.eyebrow}</span>
              </div>
              <h1
                className="font-display text-4xl leading-none tracking-[-0.03em] text-[var(--brand-ink)] md:text-5xl"
                data-testid="category-page-title"
              >
                {category.name} fabric by the yard
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
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
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
