import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { siteContent } from "@lib/site-content"
import { getRegion } from "@lib/data/regions"
import EditorialHome from "@modules/home/templates/editorial-home"

export const metadata: Metadata = {
  title: "Technical Wardrobe Essentials",
  description: siteContent.description,
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 100,
      fields:
        "*categories,*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
    },
  })

  if (!region) {
    return null
  }

  return <EditorialHome products={response.products} region={region} />
}
