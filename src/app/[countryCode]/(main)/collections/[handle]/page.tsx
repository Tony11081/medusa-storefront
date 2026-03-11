import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listProductsWithSort } from "@lib/data/products"
import { listRegions } from "@lib/data/regions"
import { absoluteUrl, buildCollectionPageJsonLd } from "@lib/util/seo"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import JsonLd from "@modules/common/components/json-ld"
import CollectionTemplate from "@modules/collections/templates"
import { siteContent } from "@lib/site-content"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const description = `Browse ${collection.title} at ${siteContent.name}. Designer fabrics sold by the yard for upholstery, wall panels, soft goods, and custom work.`

  return {
    title: `${collection.title} Designer Fabric`,
    description,
    alternates: {
      canonical: absoluteUrl(`/${params.countryCode}/collections/${collection.handle}`),
    },
    openGraph: {
      title: `${collection.title} Designer Fabric | ${siteContent.name}`,
      description,
      url: absoluteUrl(`/${params.countryCode}/collections/${collection.handle}`),
    },
  }
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  const products = await listProductsWithSort({
    sortBy: sort,
    page: pageNumber,
    queryParams: {
      collection_id: [collection.id],
    },
    countryCode: params.countryCode,
  }).then(({ response }) => response.products)

  const jsonLd = buildCollectionPageJsonLd({
    name: collection.title || "Collection",
    description: `Browse ${collection.title} at ${siteContent.name}. Designer fabrics sold by the yard for upholstery, wall panels, soft goods, and custom work.`,
    path: `/${params.countryCode}/collections/${collection.handle}`,
    products,
    countryCode: params.countryCode,
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={params.countryCode}
      />
    </>
  )
}
