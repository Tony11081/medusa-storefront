import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listAllProducts, listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { siteContent } from "@lib/site-content"
import { resolveImagesForVariant } from "@lib/util/product-variant-images"
import {
  getProductFaqItems,
  getProductDisplayTitle,
  getProductSeoDescription,
  getProductSeoTitle,
  resolveDefaultVariant,
} from "@lib/util/product-content"
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildProductImageMetadata,
  buildProductJsonLd,
} from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const products = await listAllProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const selectedVariant = resolveDefaultVariant(product)
  const images = resolveImagesForVariant(product, selectedVariant?.id)
  const seoTitle = getProductSeoTitle(product)
  const seoDescription = getProductSeoDescription(product)

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: absoluteUrl(`/${params.countryCode}/products/${handle}`),
    },
    openGraph: {
      title: `${seoTitle} | ${siteContent.name}`,
      description: seoDescription,
      url: absoluteUrl(`/${params.countryCode}/products/${handle}`),
      images: buildProductImageMetadata({
        product,
        images,
        requestedVariantId: selectedVariant?.id,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | ${siteContent.name}`,
      description: seoDescription,
      images: images[0]?.url ? [images[0].url] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const resolvedVariant = resolveDefaultVariant(pricedProduct, selectedVariantId)
  const images = resolveImagesForVariant(pricedProduct, resolvedVariant?.id)
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", path: `/${params.countryCode}` },
    { name: "Archive", path: `/${params.countryCode}/store` },
    ...(pricedProduct.categories?.[0]?.handle && pricedProduct.categories?.[0]?.name
      ? [
          {
            name: pricedProduct.categories[0].name,
            path: `/${params.countryCode}/categories/${pricedProduct.categories[0].handle}`,
          },
        ]
      : []),
    {
      name: getProductDisplayTitle(pricedProduct) || siteContent.name,
      path: `/${params.countryCode}/products/${pricedProduct.handle}`,
    },
  ])
  const faq = buildFaqJsonLd(getProductFaqItems(pricedProduct))
  const productJsonLd = buildProductJsonLd({
    product: pricedProduct,
    countryCode: params.countryCode,
    requestedVariantId: resolvedVariant?.id,
    images,
  })

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />
      <JsonLd data={productJsonLd} />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images}
      />
    </>
  )
}
