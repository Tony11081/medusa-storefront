import { siteContent } from "@lib/site-content"
import { HttpTypes } from "@medusajs/types"

const normalizeText = (value?: string | null) =>
  (value || "").replace(/\s+/gu, " ").trim()

const cleanSourceText = (value: string) =>
  value
    .replace(/\bcontinious\b/giu, "continuous")
    .replace(/\buncutten\b/giu, "uncut")
    .replace(/\blether\b/giu, "leather")
    .replace(/\bwidht\b/giu, "width")
    .replace(/\bsuch as denim\b/giu, "denim-effect")
    .replace(/\bbigger patterns\b/giu, "larger pattern scale")
    .replace(/\bbig patterns\b/giu, "large pattern scale")
    .replace(/\s+([,.;!?])/gu, "$1")
    .trim()

const pickFirstMatch = (text: string, patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = text.match(pattern)

    if (match?.[1]) {
      return match[1].trim()
    }
  }

  return null
}

export const getSellingUnitLabel = (product: HttpTypes.StoreProduct) => {
  const sizeOption = product.options?.find(
    (option) => option.title?.toLowerCase() === "size"
  )
  const sizeValue = sizeOption?.values?.[0]?.value?.trim()

  if (sizeValue) {
    return sizeValue
  }

  const variantTitle = product.variants?.[0]?.title || ""
  const parts = variantTitle.split("/").map((part) => part.trim())

  if (parts.length > 1 && parts[parts.length - 1]) {
    return parts[parts.length - 1]
  }

  return "1 yard"
}

export const getWidthLabel = (product: HttpTypes.StoreProduct) => {
  const description = normalizeText(product.description)

  return pickFirstMatch(description, [
    /width(?: of item)?(?: is|:)?\s*([^.;,]+(?:inches|inch|cm))/iu,
    /([0-9]+(?:\.[0-9]+)?\s*(?:inches|inch|cm))\s+wide/iu,
  ])
}

export const getThicknessLabel = (product: HttpTypes.StoreProduct) => {
  const description = normalizeText(product.description)

  return pickFirstMatch(description, [
    /thickness(?: of item)?(?: is|:)?\s*([^.;]+)/iu,
  ])
}

export const getWeightLabel = (product: HttpTypes.StoreProduct) => {
  const description = normalizeText(product.description)

  return pickFirstMatch(description, [
    /([0-9]+(?:\.[0-9]+)?\s*(?:gr|g)\s*(?:\/|per)\s*(?:square meter|sqm))/iu,
    /([0-9]+(?:\.[0-9]+)?\s*(?:oz\/yd²|oz\/yd2))/iu,
  ])
}

export const getCareLabel = (product: HttpTypes.StoreProduct) => {
  const description = normalizeText(product.description).toLowerCase()

  if (description.includes("cold machine wash is possible")) {
    return "Cold machine wash possible."
  }

  if (description.includes("dry clean")) {
    return "Dry clean recommended."
  }

  return null
}

export const getArchiveNotes = (product: HttpTypes.StoreProduct) => {
  return cleanSourceText(normalizeText(product.description))
}

export const getMaterialLabel = (product: HttpTypes.StoreProduct) => {
  if (product.material?.trim()) {
    return product.material.trim()
  }

  const haystack = [
    ...(product.categories ?? []).map((category) => category.name),
    product.title,
    product.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (haystack.includes("jacquard")) {
    return "Jacquard"
  }

  if (haystack.includes("vinyl")) {
    return "Vinyl"
  }

  if (haystack.includes("leather")) {
    return "Leather"
  }

  if (haystack.includes("lining")) {
    return "Lining"
  }

  if (haystack.includes("denim")) {
    return "Denim"
  }

  if (haystack.includes("cotton")) {
    return "Cotton"
  }

  if (haystack.includes("canvas")) {
    return "Canvas"
  }

  return "Designer textile"
}

export const getCompositionLabel = (product: HttpTypes.StoreProduct) => {
  const description = normalizeText(product.description)
  const sentences = description
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  const compositionSentences = sentences.filter((sentence) =>
    /\d+\s*%/u.test(sentence)
  )

  if (!compositionSentences.length) {
    return null
  }

  return compositionSentences
    .slice(0, 2)
    .join(" ")
    .replace(/\.$/u, "")
}

export const getContinuousYardageNote = (product: HttpTypes.StoreProduct) => {
  const description = normalizeText(product.description).toLowerCase()

  if (
    description.includes("more than a yard") ||
    description.includes("continuous") ||
    description.includes("continious") ||
    description.includes("uncut")
  ) {
    return "Multiple yards are usually prepared as one continuous cut whenever the roll allows."
  }

  return "Sold by the yard for project planning and upholstery quantity estimates."
}

export const getUseCaseLabel = (product: HttpTypes.StoreProduct) => {
  const haystack = [
    product.material,
    ...(product.categories ?? []).map((category) => category.name),
    product.title,
    product.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (/(leather|vinyl|upholstery)/u.test(haystack)) {
    return "Best for upholstery accents, headboards, wall panels, trim, and custom fabrication."
  }

  if (/(jacquard|brocade|boucle)/u.test(haystack)) {
    return "Best for statement upholstery, cushions, benches, decorative panels, and soft furnishings."
  }

  if (/(lining|canvas|denim|cotton)/u.test(haystack)) {
    return "Best for lining, soft goods, bag making, decorative trim, and lighter custom projects."
  }

  return "Suitable for interiors, soft furnishings, and custom decorative work."
}

export const getPriceRuleLabel = (product: HttpTypes.StoreProduct) => {
  const haystack = [
    product.material,
    ...(product.categories ?? []).map((category) => category.name),
    product.title,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (/(leather|vinyl)/u.test(haystack)) {
    return "USD 45 per yard"
  }

  return "USD 35 per yard"
}

export const getSwatchRequestHref = (product: HttpTypes.StoreProduct) => {
  const subject = encodeURIComponent(`Swatch request for ${product.title}`)
  const body = encodeURIComponent(
    `Hello Atelier Fabrics,\n\nI would like more information about ${product.title} (${product.handle}). Please let me know about swatch availability and project guidance.\n`
  )

  return `mailto:${siteContent.supportEmail}?subject=${subject}&body=${body}`
}
