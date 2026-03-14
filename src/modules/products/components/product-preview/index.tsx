import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { getProductDisplayTitle } from "@lib/util/product-content"
import { HttpTypes } from "@medusajs/types"
import { countryNames } from "@lib/site-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })
  const displayTitle = getProductDisplayTitle(product)

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block h-full">
      <article data-testid="product-wrapper" className="flex h-full flex-col">
        <div className="editorial-frame">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured
            className="rounded-none"
            alt={`${product.title} fabric preview`}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-5 items-center justify-between border-t border-white/20 bg-[linear-gradient(180deg,rgba(17,23,20,0),rgba(17,23,20,0.92))] px-4 py-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
            <span className="text-[10px] uppercase tracking-[0.26em] text-white/70">
              View details
            </span>
            <span className="brand-link !text-[10px] !tracking-[0.24em] !text-white !decoration-white/25">
              Enter PDP
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-4 pt-3 md:gap-5 md:pt-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-5">
            <div className="min-w-0">
              <p className="soft-caption">
                {product.material ?? "Designer textile"}
              </p>
              <Text
                className="mt-2 line-clamp-2 text-base font-medium leading-6 text-[var(--brand-ink)] md:text-lg md:leading-7"
                data-testid="product-title"
              >
                {displayTitle}
              </Text>
            </div>
            <div className="pt-0.5 text-left text-[var(--brand-ink)] md:text-right">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
          <div className="flex flex-col items-start gap-1.5 border-t border-[var(--brand-line)] pt-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-soft)]">
              {product.origin_country
                ? countryNames[product.origin_country] ??
                  product.origin_country.toUpperCase()
                : "Archive selection"}
            </p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--brand-accent-soft)]">
              Sold by the yard
            </p>
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
