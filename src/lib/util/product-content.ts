import { HttpTypes } from "@medusajs/types"

import { getPricesForVariant } from "@lib/util/get-product-price"
import {
  getArchiveNotes,
  getContinuousYardageNote,
  getPriceRuleLabel,
  getSellingUnitLabel,
  getUseCaseLabel,
  getWidthLabel,
} from "@lib/util/product-details"

const BRANDS = [
  "Louis Vuitton",
  "Loro Piana",
  "Bottega Veneta",
  "Burberry",
  "Versace",
  "Goyard",
  "Gucci",
  "Fendi",
  "Dior",
  "Coach",
  "Guess",
  "MCM",
]

const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

const sentenceCase = (value: string) => {
  if (!value) {
    return value
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

const normalizeTitle = (value: string) =>
  value
    .replace(/\|.*$/u, "")
    .replace(/!/gu, "")
    .replace(/BrownJacquard/giu, "Brown Jacquard")
    .replace(/\s*,\s*/gu, ", ")
    .replace(/\s+/gu, " ")
    .trim()

const trimUseCaseTail = (value: string) =>
  value.replace(
    /\s+for\s+(?:bags?|shoes?|upholstery|crafting|clothing|clothes|multipurpose)(?:[\s,/-]*(?:and|or)?[\s,/-]*(?:bags?|shoes?|upholstery|crafting|clothing|clothes|multipurpose))*$/iu,
    ""
  )

export const resolveDefaultVariant = (
  product: HttpTypes.StoreProduct,
  requestedVariantId?: string
) => {
  if (!product.variants?.length) {
    return undefined
  }

  if (requestedVariantId) {
    const matchedVariant = product.variants.find(
      (variant) =>
        variant.id === requestedVariantId || variant.sku === requestedVariantId
    )

    if (matchedVariant) {
      return matchedVariant
    }
  }

  return product.variants[0]
}

export const getVariantColorLabel = (
  variant?: HttpTypes.StoreProductVariant
) => {
  const metadata = (variant?.metadata || {}) as Record<string, unknown>
  const metadataColor =
    typeof metadata.color_label === "string" ? metadata.color_label.trim() : ""

  if (metadataColor) {
    return metadataColor
  }

  const colorOption = variant?.options?.find(
    (option) => option.option?.title?.toLowerCase() === "color"
  )

  if (colorOption?.value?.trim()) {
    return colorOption.value.trim()
  }

  return variant?.title?.split("/")[0]?.trim() || ""
}

export const getProductDisplayTitle = (product: HttpTypes.StoreProduct) => {
  const normalized = normalizeTitle(product.title || "")

  return trimUseCaseTail(normalized) || normalized || product.title || ""
}

export const getProductBrand = (product: HttpTypes.StoreProduct) => {
  const haystack = [product.title, product.handle].filter(Boolean).join(" ")

  return BRANDS.find((brand) =>
    new RegExp(brand.replace(/\s+/gu, "\\s+"), "iu").test(haystack)
  )
}

export const getProductColorwayCount = (product: HttpTypes.StoreProduct) => {
  const colorOption = product.options?.find(
    (option) => option.title?.toLowerCase() === "color"
  )

  if (colorOption?.values?.length) {
    return new Set(
      colorOption.values.map((value) => value.value).filter(Boolean)
    ).size
  }

  return product.variants?.length || 0
}

export const getProductEditorialSummary = (product: HttpTypes.StoreProduct) => {
  const sellingUnit = getSellingUnitLabel(product).toLowerCase()
  const width = getWidthLabel(product)
  const colorwayCount = getProductColorwayCount(product)
  const useCase = getUseCaseLabel(product).replace(/^Best for\s*/iu, "").replace(/\.$/u, "")
  const displayTitle = getProductDisplayTitle(product)

  const parts = [`${displayTitle} is sold by the ${sellingUnit}.`]

  if (width) {
    parts.push(`Approx. ${width} wide.`)
  } else {
    parts.push("Sold in easy-to-plan yard increments.")
  }

  if (colorwayCount > 1) {
    parts.push(`Available in ${colorwayCount} colorways.`)
  }

  parts.push(`${sentenceCase(useCase)}.`)

  return parts.join(" ").replace(/\s+/gu, " ").trim()
}

export const getProductSeoTitle = (product: HttpTypes.StoreProduct) => {
  const title = getProductDisplayTitle(product)

  if (!title.toLowerCase().includes("by the yard")) {
    return `${title} by the Yard`
  }

  return title
}

export const getProductSeoDescription = (product: HttpTypes.StoreProduct) => {
  const width = getWidthLabel(product)
  const priceRule = getPriceRuleLabel(product)
  const archiveNotes = getContinuousYardageNote(product)
  const useCase = getUseCaseLabel(product)
  const colorwayCount = getProductColorwayCount(product)
  const title = getProductDisplayTitle(product)

  return truncate(
    [
      `${title}.`,
      width ? `${width} wide.` : null,
      colorwayCount > 1 ? `${colorwayCount} colorways available.` : null,
      useCase,
      `${priceRule}.`,
      archiveNotes,
    ]
      .filter(Boolean)
      .join(" "),
    170
  )
}

export const getProductImageAlt = ({
  product,
  index = 0,
  variant,
}: {
  product: HttpTypes.StoreProduct
  index?: number
  variant?: HttpTypes.StoreProductVariant
}) => {
  const color = getVariantColorLabel(variant)
  const title = getProductDisplayTitle(product)
  const includesColor = color && title.toLowerCase().includes(color.toLowerCase())
  const base = color && !includesColor ? `${title} in ${color}` : title

  if (index === 0) {
    return `${base} product image`
  }

  return `${base} detail view ${index + 1}`
}

export const getProductArchiveNoteBlock = (product: HttpTypes.StoreProduct) => {
  return truncate(getArchiveNotes(product), 520)
}

export const getProductFaqItems = (product: HttpTypes.StoreProduct) => {
  const width = getWidthLabel(product)
  const sellingUnit = getSellingUnitLabel(product)

  return [
    {
      question: "How is this fabric sold?",
      answer: `This listing is sold by the ${sellingUnit}. ${getContinuousYardageNote(
        product
      )}`,
    },
    {
      question: "What projects is this material best suited for?",
      answer: getUseCaseLabel(product),
    },
    {
      question: "What key product details should I review before ordering?",
      answer: width
        ? `Review the width, finish, and intended use before placing larger orders. Current source notes indicate an approximate width of ${width}.`
        : "Review the finish, intended use, and project requirements before placing larger orders or committing to upholstery yardage.",
    },
  ]
}

export const getProductPriceData = (
  product: HttpTypes.StoreProduct,
  variant?: HttpTypes.StoreProductVariant
) => {
  const resolvedVariant = variant || resolveDefaultVariant(product)
  const resolvedPrice = resolvedVariant ? getPricesForVariant(resolvedVariant) : null

  if (resolvedPrice) {
    return resolvedPrice
  }

  const fallbackPrice = getPriceRuleLabel(product).match(/USD\s+([0-9]+(?:\.[0-9]+)?)/iu)

  return {
    calculated_price_number: fallbackPrice ? Number(fallbackPrice[1]) : 0,
    currency_code: "USD",
  }
}
