import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { PRODUCT_CARD_FIELDS } from "@lib/data/product-fields"
import { siteContent } from "@lib/site-content"
import { getRegion } from "@lib/data/regions"
import JsonLd from "@modules/common/components/json-ld"
import EditorialHome from "@modules/home/templates/editorial-home"
import { absoluteUrl, buildCollectionPageJsonLd } from "@lib/util/seo"

type HomeProps = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: HomeProps): Promise<Metadata> {
  const { countryCode } = await props.params

  return {
    title: "Designer Fabric by the Yard",
    description: siteContent.description,
    alternates: {
      canonical: absoluteUrl(`/${countryCode}`),
    },
    openGraph: {
      title: `Designer Fabric by the Yard | ${siteContent.name}`,
      description: siteContent.description,
      url: absoluteUrl(`/${countryCode}`),
    },
    twitter: {
      card: "summary_large_image",
      title: `Designer Fabric by the Yard | ${siteContent.name}`,
      description: siteContent.description,
    },
  }
}

export default async function Home(props: HomeProps) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 24,
      fields: PRODUCT_CARD_FIELDS,
    },
  })

  if (!region) {
    return null
  }

  const jsonLd = buildCollectionPageJsonLd({
    name: `${siteContent.name} Home`,
    description: siteContent.description,
    path: `/${countryCode}`,
    products: response.products.slice(0, 8),
    countryCode,
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <EditorialHome products={response.products} region={region} />
    </>
  )
}
