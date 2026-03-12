import { Metadata } from "next"

import { getStoreFaqItems } from "@lib/util/archive-copy"
import {
  absoluteUrl,
  buildCollectionPageJsonLd,
  buildFaqJsonLd,
} from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import { siteContent } from "@lib/site-content"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listProductsWithSort } from "@lib/data/products"
import StoreTemplate from "@modules/store/templates"

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params

  return {
    title: "Designer Fabric Archive",
    description:
      "Browse designer jacquard, vinyl, leather, lining, denim, cotton, and upholstery fabric by the yard from Atelier Fabrics.",
    alternates: {
      canonical: absoluteUrl(`/${params.countryCode}/store`),
    },
    openGraph: {
      title: `Designer Fabric Archive | ${siteContent.name}`,
      description:
        "Browse designer jacquard, vinyl, leather, lining, denim, cotton, and upholstery fabric by the yard from Atelier Fabrics.",
      url: absoluteUrl(`/${params.countryCode}/store`),
    },
  }
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const products = await listProductsWithSort({
    sortBy: sort,
    page: pageNumber,
    countryCode: params.countryCode,
  }).then(({ response }) => response.products)

  const jsonLd = buildCollectionPageJsonLd({
    name: "Designer Fabric Archive",
    description:
      "Browse designer jacquard, vinyl, leather, lining, denim, cotton, and upholstery fabric by the yard from Atelier Fabrics.",
    path: `/${params.countryCode}/store`,
    products,
    countryCode: params.countryCode,
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={buildFaqJsonLd(getStoreFaqItems())} />
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}
