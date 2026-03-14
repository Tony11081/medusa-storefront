"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { countryNames } from "@lib/site-content"
import { siteContent } from "@lib/site-content"
import { getProductDisplayTitle } from "@lib/util/product-content"
import {
  getArchiveNotes,
  getCompositionLabel,
  getContinuousYardageNote,
  getCareLabel,
  getMaterialLabel,
  getSellingUnitLabel,
  getThicknessLabel,
  getUseCaseLabel,
  getWeightLabel,
  getWidthLabel,
} from "@lib/util/product-details"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Fabric Details",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & Project Notes",
      component: <ShippingInfoTab product={product} />,
    },
    {
      label: "Swatches & Support",
      component: <SupportInfoTab product={product} />,
    },
  ]

  return (
    <div className="w-full rounded-[2px] border border-[var(--brand-line)] bg-[rgba(252,251,248,0.88)] p-4 md:p-5">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const displayTitle = getProductDisplayTitle(product)
  const sellingUnit = getSellingUnitLabel(product)
  const width = getWidthLabel(product)
  const thickness = getThicknessLabel(product)
  const composition = getCompositionLabel(product)
  const useCaseLabel = getUseCaseLabel(product)
  const weight = getWeightLabel(product)
  const care = getCareLabel(product)
  const archiveNotes = getArchiveNotes(product)
  const materialLabel = getMaterialLabel(product)

  return (
    <div className="text-small-regular py-6">
      <div className="grid gap-8 md:grid-cols-2 md:gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Material</span>
            <p>{materialLabel}</p>
          </div>
          <div>
            <span className="font-semibold">Category</span>
            <p>
              {(product.categories ?? []).length
                ? product.categories?.map((category) => category.name).join(", ")
                : "-"}
            </p>
          </div>
          <div>
            <span className="font-semibold">Country of origin</span>
            <p>
              {product.origin_country
                ? countryNames[product.origin_country] ??
                  product.origin_country.toUpperCase()
                : "-"}
            </p>
          </div>
          <div>
            <span className="font-semibold">Recommended use</span>
            <p>{useCaseLabel}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Selling unit</span>
            <p>{sellingUnit}</p>
          </div>
          <div>
            <span className="font-semibold">Width</span>
            <p>{width ?? "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Thickness</span>
            <p>{thickness ?? "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Composition</span>
            <p>{composition ?? "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Weight</span>
            <p>{weight ?? (product.weight ? `${product.weight} g` : "-")}</p>
          </div>
          <div>
            <span className="font-semibold">Care</span>
            <p>{care ?? "-"}</p>
          </div>
        </div>
      </div>
      {archiveNotes && (
        <div className="mt-6 border-t border-[var(--brand-line)] pt-6">
          <span className="font-semibold">Source notes for {displayTitle}</span>
          <p className="mt-2 max-w-xl text-[var(--brand-muted)]">
            {archiveNotes}
          </p>
        </div>
      )}
    </div>
  )
}

const ShippingInfoTab = ({ product }: ProductTabsProps) => {
  const continuousYardageNote = getContinuousYardageNote(product)

  return (
    <div className="text-small-regular py-6">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Continuous yardage planning</span>
            <p className="max-w-sm">
              {continuousYardageNote}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Review suitability before larger runs</span>
            <p className="max-w-sm">
              Color and texture can shift by screen and lighting. For upholstery,
              trim, headboards, or other larger installations, confirm finish
              and intended use before placing multi-yard orders.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Archive-led purchasing</span>
            <p className="max-w-sm">
              These listings are presented as designer archive materials rather
              than mass-market replenishment stock, so project questions are
              worth clarifying before checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const SupportInfoTab = ({ product }: ProductTabsProps) => {
  const swatchHref = `mailto:${siteContent.supportEmail}?subject=${encodeURIComponent(
    `Project help for ${product.title}`
  )}`

  return (
    <div className="text-small-regular py-6">
      <div className="grid gap-y-4 text-[var(--brand-muted)]">
        <p>
          Need a swatch check, more close-up imagery, or help confirming whether
          this fabric suits upholstery, decorative panels, trim, or bag making?
        </p>
        <p>
          Email
          {" "}
          <a
            className="text-[var(--brand-ink)] underline decoration-[rgba(16,21,31,0.25)] underline-offset-4"
            href={swatchHref}
          >
            {siteContent.supportEmail}
          </a>
          {" "}
          and reference
          {" "}
          <span className="font-semibold">{product.handle}</span>
          .
        </p>
      </div>
    </div>
  )
}

export default ProductTabs
