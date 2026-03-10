import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
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

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="h-full rounded-[1.6rem] border border-[var(--brand-line)] bg-white/88 p-4 shadow-[0_18px_50px_rgba(16,21,31,0.05)] transition duration-300 hover:-translate-y-1"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-accent)]">
              {product.material ?? "Capsule essential"}
            </p>
            <Text
              className="mt-2 text-base font-medium text-[var(--brand-ink)]"
              data-testid="product-title"
            >
              {product.title}
            </Text>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--brand-soft)]">
              {product.origin_country
                ? countryNames[product.origin_country] ??
                  product.origin_country.toUpperCase()
                : "Global issue"}
            </p>
          </div>
          <div className="flex items-center gap-x-2 text-[var(--brand-ink)]">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
