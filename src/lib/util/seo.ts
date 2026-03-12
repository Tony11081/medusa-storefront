import { HttpTypes } from "@medusajs/types"

import { siteContent } from "@lib/site-content"
import { normalizeImageUrl } from "@lib/util/images"
import {
  getCompositionLabel,
  getMaterialLabel,
  getPriceRuleLabel,
  getSellingUnitLabel,
  getThicknessLabel,
  getUseCaseLabel,
  getWidthLabel,
} from "@lib/util/product-details"
import {
  getProductDisplayTitle,
  getProductBrand,
  getProductFaqItems,
  getProductImageAlt,
  getProductPriceData,
  getProductSeoDescription,
  getVariantColorLabel,
  resolveDefaultVariant,
} from "@lib/util/product-content"

export const absoluteUrl = (path = "/") => {
  const baseUrl = siteContent.siteUrl.replace(/\/$/u, "")

  if (!path) {
    return baseUrl
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

export const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</gu, "\\u003c")

export const buildBreadcrumbJsonLd = (
  items: Array<{ name: string; path: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export const buildCollectionPageJsonLd = ({
  name,
  description,
  path,
  products,
  countryCode,
}: {
  name: string
  description: string
  path: string
  products: HttpTypes.StoreProduct[]
  countryCode: string
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => {
        const price = getProductPriceData(product)

        return {
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/${countryCode}/products/${product.handle}`),
          item: {
            "@type": "Product",
            name: getProductDisplayTitle(product),
            image: product.thumbnail ? [normalizeImageUrl(product.thumbnail)] : undefined,
            offers: {
              "@type": "Offer",
              price: price.calculated_price_number,
              priceCurrency: price.currency_code || "USD",
            },
          },
        }
      }),
    },
  }
}

export const buildFaqJsonLd = (
  items: Array<{ question: string; answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
})

export const buildOrganizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteContent.name,
  url: siteContent.siteUrl,
  email: siteContent.supportEmail,
  description: siteContent.description,
})

export const buildWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteContent.name,
  url: siteContent.siteUrl,
  description: siteContent.description,
})

export const buildProductJsonLd = ({
  product,
  countryCode,
  requestedVariantId,
  images,
}: {
  product: HttpTypes.StoreProduct
  countryCode: string
  requestedVariantId?: string
  images: HttpTypes.StoreProductImage[]
}) => {
  const variant = resolveDefaultVariant(product, requestedVariantId)
  const price = getProductPriceData(product, variant)
  const faq = getProductFaqItems(product)
  const width = getWidthLabel(product)
  const thickness = getThicknessLabel(product)
  const composition = getCompositionLabel(product)
  const material = getMaterialLabel(product)
  const imageUrls = images
    .map((image) => normalizeImageUrl(image.url))
    .filter(Boolean)
  const color = getVariantColorLabel(variant)

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: getProductDisplayTitle(product),
    description: getProductSeoDescription(product),
    sku: variant?.sku || undefined,
    image: imageUrls,
    brand: {
      "@type": "Brand",
      name: getProductBrand(product) || siteContent.name,
    },
    category:
      product.categories?.map((category) => category.name).filter(Boolean).join(", ") ||
      undefined,
    material,
    color: color || undefined,
    additionalProperty: [
      width
        ? {
            "@type": "PropertyValue",
            name: "Width",
            value: width,
          }
        : null,
      thickness
        ? {
            "@type": "PropertyValue",
            name: "Thickness",
            value: thickness,
          }
        : null,
      composition
        ? {
            "@type": "PropertyValue",
            name: "Composition",
            value: composition,
          }
        : null,
      {
        "@type": "PropertyValue",
        name: "Selling Unit",
        value: getSellingUnitLabel(product),
      },
      {
        "@type": "PropertyValue",
        name: "Use",
        value: getUseCaseLabel(product),
      },
      {
        "@type": "PropertyValue",
        name: "Pricing",
        value: getPriceRuleLabel(product),
      },
    ].filter(Boolean),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/${countryCode}/products/${product.handle}`),
      price: price.calculated_price_number,
      priceCurrency: price.currency_code || "USD",
      availability:
        variant?.manage_inventory &&
        !variant.allow_backorder &&
        (variant.inventory_quantity || 0) <= 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: price.calculated_price_number,
        priceCurrency: price.currency_code || "USD",
        unitCode: "YRD",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitText: getSellingUnitLabel(product),
        },
      },
    },
    subjectOf: buildFaqJsonLd(faq),
  }
}

export const buildProductImageMetadata = ({
  product,
  images,
  requestedVariantId,
}: {
  product: HttpTypes.StoreProduct
  images: HttpTypes.StoreProductImage[]
  requestedVariantId?: string
}) => {
  const variant = resolveDefaultVariant(product, requestedVariantId)
  const primaryImage = images[0]?.url ? normalizeImageUrl(images[0].url) : undefined

  return primaryImage
    ? [
        {
          url: primaryImage,
          alt: getProductImageAlt({
            product,
            index: 0,
            variant,
          }),
        },
      ]
    : []
}
