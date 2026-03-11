import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container relative grid gap-6 py-8 lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:items-start"
        data-testid="product-container"
      >
        <div className="flex w-full flex-col gap-y-6 py-4 lg:sticky lg:top-28 lg:max-w-[340px] lg:py-0">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="relative block w-full">
          <ImageGallery product={product} images={images} />
        </div>
        <div className="flex w-full flex-col gap-y-6 py-4 lg:sticky lg:top-28 lg:max-w-[340px] lg:py-0">
          <div className="rounded-[1.8rem] border border-[var(--brand-line)] bg-white/92 p-6">
            <ProductOnboardingCta />
          </div>
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <div className="rounded-[1.8rem] border border-[var(--brand-line)] bg-white/92 p-6 shadow-[0_18px_50px_rgba(16,21,31,0.05)]">
              <ProductActionsWrapper id={product.id} region={region} />
            </div>
          </Suspense>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
