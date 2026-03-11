"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useMemo } from "react"
import { useSearchParams } from "next/navigation"

import { isExternalImageUrl, normalizeImageUrl } from "@lib/util/images"

type ImageGalleryProps = {
  product: HttpTypes.StoreProduct
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ product, images }: ImageGalleryProps) => {
  const searchParams = useSearchParams()

  const resolvedImages = useMemo(() => {
    const selectedVariantId = searchParams.get("v_id")

    if (!selectedVariantId || !product.variants?.length) {
      return images
    }

    const variant = product.variants.find((item) => item.id === selectedVariantId)

    if (!variant?.images?.length) {
      return images
    }

    const selectedColor =
      variant.title?.split(" / ")[0]?.trim().toLowerCase() || ""
    const colorTokens = selectedColor
      .split(/[\/\s-]+/u)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3)

    const filteredImages =
      colorTokens.length > 0
        ? variant.images.filter((image) => {
            const url = image.url?.toLowerCase() || ""
            return (
              url.includes(selectedColor.replace(/\s+/gu, "-")) ||
              colorTokens.some((token) => url.includes(token))
            )
          })
        : []

    return filteredImages.length ? filteredImages : variant.images
  }, [images, product.variants, searchParams])

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {resolvedImages.map((image, index) => {
          const imageUrl = normalizeImageUrl(image.url)

          return (
            <Container
              key={image.id}
              className="relative aspect-[29/34] w-full overflow-hidden rounded-[1.8rem] border border-black/5 bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(243,232,218,0.88))] shadow-[0_18px_55px_rgba(16,21,31,0.08)]"
              id={image.id}
            >
              {!!imageUrl && (
                <Image
                  src={imageUrl}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-rounded"
                  alt={`Product image ${index + 1}`}
                  fill
                  unoptimized={isExternalImageUrl(imageUrl)}
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
