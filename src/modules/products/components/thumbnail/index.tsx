import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

import { isExternalImageUrl, normalizeImageUrl } from "@lib/util/images"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = normalizeImageUrl(thumbnail || images?.[0]?.url)

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden rounded-[1.35rem] border border-black/5 bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(243,232,218,0.88))] shadow-[0_18px_45px_rgba(16,21,31,0.08)] transition-all duration-300 ease-in-out group-hover:shadow-[0_24px_60px_rgba(16,21,31,0.12)]",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center"
      draggable={false}
      quality={50}
      unoptimized={isExternalImageUrl(image)}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(182,130,62,0.18),transparent_32%),linear-gradient(180deg,rgba(255,250,244,0.98),rgba(241,232,220,0.9))]">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
