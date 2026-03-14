"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useMemo } from "react"
import { useSearchParams } from "next/navigation"

import { isExternalImageUrl, normalizeImageUrl } from "@lib/util/images"
import {
  getProductImageAlt,
  resolveDefaultVariant,
} from "@lib/util/product-content"
import { resolveImagesForVariant } from "@lib/util/product-variant-images"

type ImageGalleryProps = {
  product: HttpTypes.StoreProduct
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ product, images }: ImageGalleryProps) => {
  const searchParams = useSearchParams()

  const resolvedImages = useMemo(() => {
    return resolveImagesForVariant(
      product,
      searchParams.get("v_id") || undefined,
      images
    )
  }, [images, product, searchParams])

  return (
    <div className="flex items-start relative">
      <div className="flex flex-1 flex-col gap-y-5 md:gap-y-6">
        {resolvedImages.map((image, index) => {
          const imageUrl = normalizeImageUrl(image.url)
          const variant = resolveDefaultVariant(
            product,
            searchParams.get("v_id") || undefined
          )

          return (
            <div
              key={image.id}
              className="editorial-frame relative aspect-[4/5] w-full bg-[var(--brand-panel-strong)]"
              id={image.id}
            >
              {!!imageUrl && (
                <Image
                  src={imageUrl}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-rounded"
                  alt={getProductImageAlt({
                    product,
                    index,
                    variant,
                  })}
                  fill
                  unoptimized={isExternalImageUrl(imageUrl)}
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[linear-gradient(180deg,rgba(18,22,20,0),rgba(18,22,20,0.82))] px-4 py-3">
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/68">
                  Image {index + 1}
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/68">
                  High-resolution detail
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
