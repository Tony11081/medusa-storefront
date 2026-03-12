import { NextResponse } from "next/server"

import { listAllProducts } from "@lib/data/products"
import { siteContent } from "@lib/site-content"
import {
  getProductBrand,
  getProductColorwayCount,
  getProductDisplayTitle,
  getProductEditorialSummary,
  getProductPriceData,
  getProductSeoDescription,
  getProductSeoTitle,
} from "@lib/util/product-content"
import {
  getCompositionLabel,
  getMaterialLabel,
  getSellingUnitLabel,
  getThicknessLabel,
  getUseCaseLabel,
  getWidthLabel,
} from "@lib/util/product-details"
import { absoluteUrl } from "@lib/util/seo"

const COUNTRY_CODE = "gb"

export async function GET() {
  const products = await listAllProducts({
    countryCode: COUNTRY_CODE,
    queryParams: {
      limit: 100,
      fields:
        "handle,title,description,thumbnail,*categories,*variants,*variants.options,*variants.prices,*variants.price_set,*variants.calculated_price,+variants.metadata",
    },
  })

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      site: {
        name: siteContent.name,
        url: siteContent.siteUrl,
        supportEmail: siteContent.supportEmail,
      },
      products: products.map((product) => {
        const price = getProductPriceData(product)

        return {
          handle: product.handle,
          title: getProductDisplayTitle(product),
          seoTitle: getProductSeoTitle(product),
          url: absoluteUrl(`/${COUNTRY_CODE}/products/${product.handle}`),
          brand: getProductBrand(product),
          categories: (product.categories ?? []).map((category) => category.name),
          material: getMaterialLabel(product),
          width: getWidthLabel(product),
          thickness: getThicknessLabel(product),
          composition: getCompositionLabel(product),
          use: getUseCaseLabel(product),
          sellingUnit: getSellingUnitLabel(product),
          colorways: getProductColorwayCount(product),
          price: price.calculated_price_number,
          currency: price.currency_code || "USD",
          summary: getProductEditorialSummary(product),
          seoDescription: getProductSeoDescription(product),
          thumbnail: product.thumbnail,
          guideUrl: absoluteUrl(`/${COUNTRY_CODE}/guide`),
        }
      }),
    },
    {
      headers: {
        "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  )
}
