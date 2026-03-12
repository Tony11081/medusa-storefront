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
  isFeatured,
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
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="h-full overflow-hidden rounded-[1.8rem] border border-[var(--brand-line)] bg-[linear-gradient(155deg,rgba(255,250,244,0.98),rgba(243,232,218,0.9))] p-4 shadow-[0_18px_50px_rgba(16,21,31,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(16,21,31,0.1)]"
      >
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            alt={`${product.title} fabric preview`}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(15,12,10,0.72)] to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-[rgba(20,16,13,0.58)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
            {product.material ?? "Designer textile"}
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <Text
              className="line-clamp-2 text-base font-medium text-[var(--brand-ink)]"
              data-testid="product-title"
            >
              {displayTitle}
            </Text>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--brand-soft)]">
              {product.origin_country
                ? countryNames[product.origin_country] ??
                  product.origin_country.toUpperCase()
                : "Archive selection"}
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-accent)]">
              Sold in 1 yard units
            </p>
          </div>
          <div className="rounded-full border border-[var(--brand-line)] bg-white/78 px-3 py-2 text-[var(--brand-ink)]">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
