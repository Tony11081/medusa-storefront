"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { countryNames } from "@lib/site-content"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Fabric Details",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & Project Notes",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full rounded-[1.8rem] border border-[var(--brand-line)] bg-white/88 p-4">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const sellingUnit = product.variants?.[0]?.title || "1 yard"

  return (
    <div className="text-small-regular py-6">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Material</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Category</span>
            <p>
              {(product.categories ?? []).length
                ? product.categories?.map((category) => category.name).join(", ")
                : "-"}
            </p>
          </div>
          <div>
            <span className="font-semibold">Country of origin</span>
            <p>
              {product.origin_country
                ? countryNames[product.origin_country] ??
                  product.origin_country.toUpperCase()
                : "-"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Selling unit</span>
            <p>{sellingUnit}</p>
          </div>
          <div>
            <span className="font-semibold">Weight</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-6">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Cut-to-order handling</span>
            <p className="max-w-sm">
              Fabric orders are prepared against the listed yardage unit. Review
              quantity carefully before placing larger upholstery or interior
              project orders.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Project planning first</span>
            <p className="max-w-sm">
              Match finish, intended use, and material type before finalizing
              larger runs. Jacquard, leather, vinyl, and lining each behave
              differently once specified.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Need sourcing guidance?</span>
            <p className="max-w-sm">
              Use the archive detail, category context, and product imagery to
              confirm whether a material fits upholstery, bag-making, trim, or
              decorative panel work before purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
