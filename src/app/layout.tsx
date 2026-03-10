import { getBaseURL } from "@lib/util/env"
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
  metadataBase: new URL(getBaseURL()),
  title: {
    default: `${siteContent.name} | ${siteContent.tagline}`,
    template: `%s | ${siteContent.name}`,
  },
  description: siteContent.description,
  openGraph: {
    title: siteContent.name,
    description: siteContent.description,
    siteName: siteContent.name,
    type: "website",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
