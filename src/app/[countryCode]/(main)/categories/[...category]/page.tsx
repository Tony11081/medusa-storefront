import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listProductsWithSort } from "@lib/data/products"
import { listRegions } from "@lib/data/regions"
import { getCategoryPageCopy } from "@lib/util/archive-copy"
import {
  absoluteUrl,
  buildCollectionPageJsonLd,
  buildFaqJsonLd,
} from "@lib/util/seo"
import { StoreRegion } from "@medusajs/types"
import JsonLd from "@modules/common/components/json-ld"
import CategoryTemplate from "@modules/categories/templates"
import { siteContent } from "@lib/site-content"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)
    const copy = getCategoryPageCopy(productCategory)

    const title = `${productCategory.name} Fabric by the Yard`
    const description = copy.intro

    return {
      title,
      description,
      alternates: {
        canonical: absoluteUrl(
          `/${params.countryCode}/categories/${params.category.join("/")}`
        ),
      },
      openGraph: {
        title: `${title} | ${siteContent.name}`,
        description,
        url: absoluteUrl(
          `/${params.countryCode}/categories/${params.category.join("/")}`
        ),
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const jsonLd = buildCollectionPageJsonLd({
    name: productCategory.name || "Category",
    description: getCategoryPageCopy(productCategory).intro,
    path: `/${params.countryCode}/categories/${params.category.join("/")}`,
    products: [],
    countryCode: params.countryCode,
  })
  const faqJsonLd = buildFaqJsonLd(getCategoryPageCopy(productCategory).faqItems)

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqJsonLd} />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}
