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
    <div className="content-container py-6 md:py-10" data-testid="category-container">
      <section className="editorial-surface overflow-hidden rounded-[2px] px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-soft)]">
              {parents.map((parent) => (
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
              className="max-w-4xl font-display text-[3rem] leading-[0.96] tracking-[-0.05em] text-[var(--brand-ink)] sm:text-5xl md:text-7xl"
              data-testid="category-page-title"
            >
              {category.name} as an editorial category, not just a filter bucket.
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

      {category.category_children && (
        <section className="mt-10">
          <p className="soft-caption mb-4">Sub-categories</p>
          <ul className="flex flex-wrap gap-3">
            {category.category_children?.map((c) => (
              <li key={c.id}>
                <InteractiveLink href={`/categories/${c.handle}`}>
                  {c.name}
                </InteractiveLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="section-divider mt-10 pt-10">
        <RefinementList sortBy={sort} data-testid="sort-by-container" />
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
            editorialInterlude={{
              eyebrow: copy.eyebrow,
              title: `Why ${category.name.toLowerCase()} works in a premium DTC setting.`,
              body:
                "Strong category pages should do more than filter products. They should frame mood, material use, and buying confidence so the shopper feels guided rather than overwhelmed.",
              ctaLabel: "Read the category guide",
              ctaHref: `/${countryCode}/guide`,
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
