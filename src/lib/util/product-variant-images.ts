import { HttpTypes } from "@medusajs/types"

import { resolveDefaultVariant } from "@lib/util/product-content"

function getVariantMetadata(variant?: HttpTypes.StoreProductVariant) {
  return (variant?.metadata || {}) as Record<string, unknown>
}

function getSelectedColor(variant?: HttpTypes.StoreProductVariant) {
  const metadata = getVariantMetadata(variant)
  const metadataColor =
    typeof metadata.color_label === "string" ? metadata.color_label.trim() : ""

  if (metadataColor) {
    return metadataColor.toLowerCase()
  }

  return variant?.title?.split(" / ")[0]?.trim().toLowerCase() || ""
}

function getColorTokens(selectedColor: string) {
  return selectedColor
    .split(/[\/\s-]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3)
}

function filterImagesByColor(
  images: HttpTypes.StoreProductImage[] = [],
  selectedColor: string
) {
  if (!selectedColor) {
    return []
  }

  const colorTokens = getColorTokens(selectedColor)

  return images.filter((image) => {
    const url = image.url?.toLowerCase() || ""

    return (
      url.includes(selectedColor.replace(/\s+/gu, "-")) ||
      colorTokens.some((token) => url.includes(token))
    )
  })
}

function getMetadataImageUrls(variant?: HttpTypes.StoreProductVariant) {
  const metadata = getVariantMetadata(variant)
  const urls: string[] = []

  const pushUrl = (value: unknown) => {
    if (typeof value === "string" && value.trim()) {
      urls.push(value.trim())
    }
  }

  pushUrl(metadata.image_url)

  const metadataImageUrls = metadata.image_urls

  if (Array.isArray(metadataImageUrls)) {
    metadataImageUrls.forEach(pushUrl)
  } else if (typeof metadataImageUrls === "string" && metadataImageUrls.trim()) {
    try {
      const parsed = JSON.parse(metadataImageUrls)
      if (Array.isArray(parsed)) {
        parsed.forEach(pushUrl)
      } else {
        pushUrl(metadataImageUrls)
      }
    } catch {
      pushUrl(metadataImageUrls)
    }
  }

  return [...new Set(urls)]
}

function buildSyntheticImages(
  variant: HttpTypes.StoreProductVariant,
  urls: string[]
) {
  return urls.map(
    (url, index) =>
      ({
        id: `${variant.id}-meta-image-${index + 1}`,
        url,
      } as HttpTypes.StoreProductImage)
  )
}

export function resolveImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string,
  fallbackImages: HttpTypes.StoreProductImage[] = product.images || []
) {
  const variant = resolveDefaultVariant(product, selectedVariantId)

  if (!variant) {
    return fallbackImages
  }

  const selectedColor = getSelectedColor(variant)

  const metadataImageUrls = getMetadataImageUrls(variant)
  if (metadataImageUrls.length) {
    const productImagesByUrl = new Map(
      (product.images || []).map((image) => [(image.url || "").toLowerCase(), image])
    )

    const resolvedImages = metadataImageUrls.map((url) => {
      return productImagesByUrl.get(url.toLowerCase()) || null
    })

    const existingImages = resolvedImages.filter(Boolean) as HttpTypes.StoreProductImage[]
    if (existingImages.length) {
      return existingImages
    }

    return buildSyntheticImages(variant, metadataImageUrls)
  }

  if (variant.images?.length) {
    const matchedVariantImages = filterImagesByColor(variant.images, selectedColor)
    return matchedVariantImages.length ? matchedVariantImages : variant.images
  }

  const matchedProductImages = filterImagesByColor(product.images || [], selectedColor)
  if (matchedProductImages.length) {
    return matchedProductImages
  }

  return fallbackImages
}
