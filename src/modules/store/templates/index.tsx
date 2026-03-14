import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getStoreFaqItems } from "@lib/util/archive-copy"

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
  const faqItems = getStoreFaqItems()

  return (
    <div className="content-container py-6 md:py-10" data-testid="category-container">
      <section className="editorial-surface overflow-hidden rounded-[2px] px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow">The Archive</p>
            <h1
              className="mt-4 max-w-4xl font-display text-[3rem] leading-[0.96] tracking-[-0.05em] text-[var(--brand-ink)] sm:text-5xl md:text-7xl"
              data-testid="store-page-title"
            >
              Designer fabrics, leather, and vinyl by the yard.
            </h1>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <div className="border-b border-[var(--brand-line)] pb-4 lg:border-b-0 lg:border-l lg:pl-6">
              <p className="soft-caption">Units</p>
              <p className="mt-3 text-base leading-7 text-[var(--brand-muted)]">
                Every listing is structured around a clear 1 yard order line.
              </p>
            </div>
            <div className="border-b border-[var(--brand-line)] pb-4 lg:border-b-0 lg:border-l lg:pl-6">
              <p className="soft-caption">Pricing</p>
              <p className="mt-3 text-base leading-7 text-[var(--brand-muted)]">
                Straightforward pricing, with fabric and coated materials presented clearly.
              </p>
            </div>
            <div className="lg:border-l lg:pl-6">
              <p className="soft-caption">Use cases</p>
              <p className="mt-3 text-base leading-7 text-[var(--brand-muted)]">
                Upholstery, decorative panels, soft goods, and custom interior projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider mt-10 pt-10">
        <RefinementList sortBy={sort} />
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            editorialInterlude={{
              eyebrow: "Buying Note",
              title: "Compare finish, scale, and use before you commit.",
              body:
                "Use the archive to narrow the right material family first. Then move into product detail pages for width, composition, color options, and project guidance.",
              ctaLabel: "Read the buying guide",
              ctaHref: `/${countryCode}/guide`,
            }}
          />
        </Suspense>
      </section>

      <section className="mt-12 editorial-surface rounded-[2px] px-5 py-7 md:mt-16 md:px-8 md:py-10">
        <div className="max-w-2xl">
          <p className="eyebrow">Buyer Questions</p>
          <h2 className="mt-4 font-display text-[2.35rem] leading-[0.98] tracking-[-0.04em] text-[var(--brand-ink)] md:text-5xl">
            Answers that help you order with less hesitation.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 xl:grid-cols-3">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-[2px] border border-[var(--brand-line)] bg-[rgba(252,251,248,0.78)] p-5"
            >
              <p className="text-base font-medium text-[var(--brand-ink)]">
                {item.question}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default StoreTemplate
