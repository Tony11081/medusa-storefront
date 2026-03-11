import { MetadataRoute } from "next"

import { siteContent } from "@lib/site-content"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/account",
        "/cart",
        "/checkout",
        "/gb/account",
        "/gb/cart",
        "/gb/checkout",
      ],
    },
    sitemap: `${siteContent.siteUrl}/sitemap.xml`,
    host: siteContent.siteUrl,
  }
}
