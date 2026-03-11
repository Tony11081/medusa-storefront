import JsonLd from "@modules/common/components/json-ld"
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@lib/util/seo"
import { siteContent } from "@lib/site-content"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import { Metadata } from "next"
import "styles/globals.css"

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteContent.siteUrl),
  title: {
    default: `${siteContent.name} | ${siteContent.tagline}`,
    template: `%s | ${siteContent.name}`,
  },
  description: siteContent.description,
  keywords: [
    "designer fabric by the yard",
    "luxury upholstery fabric",
    "designer jacquard fabric",
    "designer leather fabric",
    "designer vinyl fabric",
  ],
  openGraph: {
    title: siteContent.name,
    description: siteContent.description,
    siteName: siteContent.name,
    type: "website",
    url: siteContent.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.name,
    description: siteContent.description,
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <JsonLd data={buildOrganizationJsonLd()} />
        <JsonLd data={buildWebsiteJsonLd()} />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
