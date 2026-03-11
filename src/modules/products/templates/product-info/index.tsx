import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { countryNames } from "@lib/site-content"
import { siteContent } from "@lib/site-content"
import {
  getCompositionLabel,
  getContinuousYardageNote,
  getPriceRuleLabel,
  getSellingUnitLabel,
  getThicknessLabel,
  getUseCaseLabel,
  getWidthLabel,
} from "@lib/util/product-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const categories = (product.categories ?? []).map((category) => category.name)
  const width = getWidthLabel(product)
  const thickness = getThicknessLabel(product)
  const composition = getCompositionLabel(product)
  const sellingUnit = getSellingUnitLabel(product)
  const continuousYardageNote = getContinuousYardageNote(product)
  const useCaseLabel = getUseCaseLabel(product)
  const priceRuleLabel = getPriceRuleLabel(product)

  return (
    <div id="product-info">
      <div className="mx-auto flex flex-col gap-y-5 rounded-[1.8rem] border border-[var(--brand-line)] bg-[linear-gradient(160deg,rgba(255,250,244,0.98),rgba(243,232,218,0.92))] p-6 shadow-[0_18px_55px_rgba(16,21,31,0.06)] lg:max-w-[520px]">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-[var(--brand-soft)] transition hover:text-[var(--brand-ink)]"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <div className="flex flex-wrap gap-2">
          {categories.length ? (
            categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-[var(--brand-line)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-accent)]"
              >
                {category}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-[var(--brand-line)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-accent)]">
              Designer textile
            </span>
          )}
          <span className="rounded-full border border-[var(--brand-line)] bg-white/72 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-ink)]">
            {sellingUnit} unit
          </span>
        </div>
        <Heading
          level="h2"
          className="font-display text-5xl leading-[0.95] tracking-[-0.04em] text-[var(--brand-ink)]"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="whitespace-pre-line text-base leading-7 text-[var(--brand-muted)]"
          data-testid="product-description"
        >
          {product.description}
        </Text>
        <div className="grid gap-3 border-t border-[var(--brand-line)] pt-4 text-sm leading-6 text-[var(--brand-muted)]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
              Price
            </span>
            <span>{priceRuleLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
              Material
            </span>
            <span>{product.material ?? "Not specified"}</span>
          </div>
          {width && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
                Width
              </span>
              <span>{width}</span>
            </div>
          )}
          {thickness && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
                Thickness
              </span>
              <span>{thickness}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
              Origin
            </span>
            <span>
              {product.origin_country
                ? countryNames[product.origin_country] ??
                  product.origin_country.toUpperCase()
                : "Not specified"}
            </span>
          </div>
        </div>
        {(composition || continuousYardageNote || useCaseLabel) && (
          <div className="grid gap-3 border-t border-[var(--brand-line)] pt-4 text-sm leading-6 text-[var(--brand-muted)]">
            {composition && (
              <div>
                <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
                  Composition
                </span>
                <p className="mt-1">{composition}</p>
              </div>
            )}
            <div>
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
                Yardage
              </span>
              <p className="mt-1">{continuousYardageNote}</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
                Recommended use
              </span>
              <p className="mt-1">{useCaseLabel}</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
                Support
              </span>
              <p className="mt-1">
                Swatch and project questions:
                {" "}
                <a
                  className="text-[var(--brand-ink)] underline decoration-[rgba(16,21,31,0.25)] underline-offset-4"
                  href={`mailto:${siteContent.supportEmail}`}
                >
                  {siteContent.supportEmail}
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
