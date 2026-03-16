"use client"

import { siteContent } from "@lib/site-content"
import { trackEvent } from "@modules/analytics/lib/track-event"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type ProductShareProps = {
  productId: string
  productTitle: string
  imageUrl?: string | null
}

const getAbsoluteUrl = (pathname: string, search: string) => {
  return `${siteContent.siteUrl}${pathname}${search}`
}

const openShareWindow = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer,width=720,height=720")
}

export default function ProductShare({
  productId,
  productTitle,
  imageUrl,
}: ProductShareProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)

  const shareUrl = useMemo(() => {
    const query = searchParams.toString()
    return getAbsoluteUrl(pathname, query ? `?${query}` : "")
  }, [pathname, searchParams])

  const shareText = useMemo(() => {
    return `Take a look at ${productTitle} on ${siteContent.name}.`
  }, [productTitle])

  useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      trackEvent("copy_link_clicked", {
        item_id: productId,
        item_name: productTitle,
        source: "pdp_share_fallback",
      })
      return
    }

    await navigator.share({
      title: productTitle,
      text: shareText,
      url: shareUrl,
    })

    trackEvent("native_share_clicked", {
      item_id: productId,
      item_name: productTitle,
      source: "pdp_share",
    })
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    trackEvent("copy_link_clicked", {
      item_id: productId,
      item_name: productTitle,
      source: "pdp_share",
    })
  }

  const handleOpenNetwork = (network: "pinterest" | "facebook" | "x") => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)
    const encodedMedia = encodeURIComponent(imageUrl || "")

    const destinations = {
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}${imageUrl ? `&media=${encodedMedia}` : ""}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    }

    openShareWindow(destinations[network])

    trackEvent("share_clicked", {
      item_id: productId,
      item_name: productTitle,
      network,
      source: "pdp_share",
    })
  }

  return (
    <div className="mt-4 border-t border-[var(--brand-line)] pt-4">
      <div className="flex items-center justify-between gap-4">
        <p className="soft-caption">Share this fabric</p>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-muted)]">
          Save or send
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={handleNativeShare}
          className="rounded-[2px] border border-[var(--brand-line-strong)] px-3 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-ink)] transition hover:border-[var(--brand-ink)] hover:bg-[rgba(34,34,34,0.03)]"
        >
          Share
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="rounded-[2px] border border-[var(--brand-line)] px-3 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-ink)] transition hover:border-[var(--brand-ink)] hover:bg-[rgba(34,34,34,0.03)]"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={() => handleOpenNetwork("pinterest")}
          className="rounded-[2px] border border-[var(--brand-line)] px-3 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-ink)] transition hover:border-[var(--brand-ink)] hover:bg-[rgba(34,34,34,0.03)]"
        >
          Pinterest
        </button>
        <button
          type="button"
          onClick={() => handleOpenNetwork("facebook")}
          className="rounded-[2px] border border-[var(--brand-line)] px-3 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-ink)] transition hover:border-[var(--brand-ink)] hover:bg-[rgba(34,34,34,0.03)]"
        >
          Facebook
        </button>
      </div>
    </div>
  )
}
