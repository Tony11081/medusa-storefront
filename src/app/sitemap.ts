import { MetadataRoute } from "next"

import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { listAllProducts } from "@lib/data/products"
import { siteContent } from "@lib/site-content"
import { absoluteUrl } from "@lib/util/seo"

const COUNTRY_CODE = "gb"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections] = await Promise.all([
    listAllProducts({
      countryCode: COUNTRY_CODE,
      queryParams: {
        limit: 100,
        fields: "handle,updated_at",
      },
    }),
    listCategories({
      limit: 100,
    }),
    listCollections({
      limit: "100",
    }),
  ])

  return [
    {
      url: absoluteUrl(`/${COUNTRY_CODE}`),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl(`/${COUNTRY_CODE}/store`),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: absoluteUrl(`/${COUNTRY_CODE}/guide`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl(`/${COUNTRY_CODE}/about`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...products
      .filter((product) => product.handle)
      .map((product) => ({
        url: absoluteUrl(`/${COUNTRY_CODE}/products/${product.handle}`),
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })),
    ...categories
      .filter((category) => category.handle)
      .map((category) => ({
        url: absoluteUrl(`/${COUNTRY_CODE}/categories/${category.handle}`),
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
    ...collections.collections
      .filter((collection) => collection.handle)
      .map((collection) => ({
        url: absoluteUrl(`/${COUNTRY_CODE}/collections/${collection.handle!}`),
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  ]
}
