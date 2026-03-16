"use client"

import Image from "next/image"
import { CSSProperties, useMemo, useState } from "react"

import { getNormalizedImageCandidates, isExternalImageUrl } from "@lib/util/images"

type ImageWithFallbackProps = {
  src?: string | null
  fallbackSrcs?: Array<string | null | undefined>
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  style?: CSSProperties
  draggable?: boolean
}

const ImageWithFallback = ({
  src,
  fallbackSrcs = [],
  alt,
  className,
  sizes,
  priority,
  quality,
  fill,
  style,
  draggable,
}: ImageWithFallbackProps) => {
  const candidates = useMemo(
    () => getNormalizedImageCandidates(src, ...fallbackSrcs),
    [fallbackSrcs, src]
  )
  const [candidateIndex, setCandidateIndex] = useState(0)

  const activeSrc = candidates[candidateIndex]

  if (!activeSrc) {
    return null
  }

  return (
    <Image
      src={activeSrc}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
      fill={fill}
      style={style}
      draggable={draggable}
      unoptimized={isExternalImageUrl(activeSrc)}
      onError={() => {
        setCandidateIndex((current) =>
          current < candidates.length - 1 ? current + 1 : current
        )
      }}
    />
  )
}

export default ImageWithFallback
