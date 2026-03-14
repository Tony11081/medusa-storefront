import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

type EditorialInterlude = {
  eyebrow: string
  title: string
  body: string
  ctaLabel?: string
  ctaHref?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  editorialInterlude,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  editorialInterlude?: EditorialInterlude
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid w-full grid-cols-1 gap-x-4 gap-y-10 xsmall:grid-cols-2 md:gap-x-8 md:gap-y-14 large:grid-cols-2 2xlarge:grid-cols-3"
        data-testid="products-list"
      >
        {products.flatMap((p, index) => {
          const items = [
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>,
          ]

          if (editorialInterlude && index === 5) {
            items.push(
              <li
                key={`${editorialInterlude.title}-${index}`}
                className="col-span-full"
              >
                <article className="editorial-surface grid gap-6 rounded-[2px] px-5 py-6 md:px-8 md:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
                  <div className="space-y-4">
                    <p className="eyebrow">{editorialInterlude.eyebrow}</p>
                    <h3 className="font-display text-[2.35rem] leading-[0.98] tracking-[-0.04em] text-[var(--brand-ink)] md:text-5xl">
                      {editorialInterlude.title}
                    </h3>
                  </div>
                  <div className="flex flex-col justify-between gap-5">
                    <p className="max-w-2xl text-base leading-8 text-[var(--brand-muted)]">
                      {editorialInterlude.body}
                    </p>
                    {editorialInterlude.ctaHref && editorialInterlude.ctaLabel ? (
                      <a href={editorialInterlude.ctaHref} className="brand-link">
                        {editorialInterlude.ctaLabel}
                      </a>
                    ) : null}
                  </div>
                </article>
              </li>
            )
          }

          return items
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
