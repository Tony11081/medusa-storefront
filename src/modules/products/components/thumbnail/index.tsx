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
  alt?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  alt,
  "data-testid": dataTestid,
}) => {
  const initialImage = normalizeImageUrl(thumbnail || images?.[0]?.url)

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden rounded-[2px] bg-[linear-gradient(160deg,rgba(252,251,248,0.98),rgba(241,237,230,0.94))] transition-all duration-500 ease-out",
        className,
        {
          "aspect-[4/5]": isFeatured,
          "aspect-[4/5]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} alt={alt} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  alt,
}: Pick<ThumbnailProps, "size" | "alt"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt={alt || "Product thumbnail"}
      className="absolute inset-0 object-cover object-center transition duration-700 ease-out group-hover:scale-[1.03]"
      draggable={false}
      quality={50}
      unoptimized={isExternalImageUrl(image)}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(215,199,171,0.22),transparent_32%),linear-gradient(180deg,rgba(252,251,248,0.98),rgba(241,237,230,0.9))]">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
