import { listAllProducts } from "@lib/data/products"
import { siteContent } from "@lib/site-content"
import {
  getProductEditorialSummary,
  getProductSeoDescription,
} from "@lib/util/product-content"
import { absoluteUrl } from "@lib/util/seo"

const COUNTRY_CODE = "gb"

export async function GET() {
  const products = await listAllProducts({
    countryCode: COUNTRY_CODE,
    queryParams: {
      limit: 100,
      fields: "handle,title,description,*categories,+metadata",
    },
  })

  const highlighted = products.slice(0, 24)

  const content = [
    `# ${siteContent.name}`,
    "",
    siteContent.description,
    "",
    "## Business",
    "- Luxury designer fabrics, vinyl, leather, lining, denim, cotton, and upholstery materials.",
    "- Standard selling unit: 1 yard.",
    "- Typical pricing: USD 35 per yard for fabric, USD 45 per yard for leather and vinyl.",
    `- Support: ${siteContent.supportEmail}`,
    "",
    "## Priority Pages",
    `- Home: ${absoluteUrl(`/${COUNTRY_CODE}`)}`,
    `- Store: ${absoluteUrl(`/${COUNTRY_CODE}/store`)}`,
    `- Guide: ${absoluteUrl(`/${COUNTRY_CODE}/guide`)}`,
    `- Product feed: ${absoluteUrl("/feeds/products.json")}`,
    "",
    "## Product Highlights",
    ...highlighted.flatMap((product) => [
      `- ${product.title}: ${absoluteUrl(`/${COUNTRY_CODE}/products/${product.handle}`)}`,
      `  Summary: ${getProductEditorialSummary(product)}`,
      `  SEO Description: ${getProductSeoDescription(product)}`,
    ]),
  ].join("\n")

  return new Response(content, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
