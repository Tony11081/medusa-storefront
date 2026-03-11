export const siteContent = {
  name: "Atelier Fabrics",
  shortName: "AF",
  tagline: "Luxury designer fabrics by the yard.",
  supportEmail: "support@upholsteryfabric.net",
  description:
    "Atelier Fabrics presents a focused archive of luxury designer textiles, upholstery fabric, leather, and vinyl sold by the yard for interiors, soft furnishings, and custom projects.",
  eyebrow: "Designer Textile Archive",
  navLinks: [
    { label: "Archive", href: "/store" },
    { label: "About", href: "/about" },
  ],
  featureHandles: [
    "gucci-jacquard-fabric-brown-gj06",
    "fendi-brown-and-black-jacquard-fabric-fj01",
    "dior-dark-blue-leather-fabric-dl02",
    "louis-vuitton-white-embossed-vinyl-ll35",
  ],
  categoryCards: [
    {
      title: "Jacquard",
      href: "/categories/jacquard",
      handle: "gucci-jacquard-fabric-brown-gj06",
      description:
        "Statement woven textiles for headboards, accent seating, panels, and fashion-led upholstery work.",
    },
    {
      title: "Leather",
      href: "/categories/leather",
      handle: "dior-dark-blue-leather-fabric-dl02",
      description:
        "Embossed and smooth leather options selected for trim details, bags, seating accents, and bespoke interiors.",
    },
    {
      title: "Vinyl",
      href: "/categories/vinyl",
      handle: "louis-vuitton-white-embossed-vinyl-ll35",
      description:
        "Durable coated materials with bold pattern and color for upholstery, wall panels, and custom fabrication.",
    },
  ],
  valueProps: [
    {
      title: "By The Yard",
      body: "Every listing is structured around a clear 1 yard selling unit, making project planning simpler from sample order to full run.",
    },
    {
      title: "Interior Focus",
      body: "The archive is oriented toward upholstery, headboards, wall panels, soft goods, and craft-led custom work rather than generic apparel browsing.",
    },
    {
      title: "Designer Texture",
      body: "Jacquard, leather, vinyl, lining, denim, and cotton are grouped to help you source tactile finishes with a stronger luxury point of view.",
    },
  ],
  about: {
    lead:
      "Atelier Fabrics is built as a sourcing-led storefront for luxury designer textiles, with emphasis on tactile surfaces, upholstery potential, and decisive material direction.",
    paragraphs: [
      "The catalog centers on recognizable luxury fashion-house materials recontextualized for interiors, furniture accents, custom fabrication, and specialty craft applications.",
      "Rather than presenting products like a discount marketplace, the storefront is arranged like an editorial archive: quieter typography, stronger texture, and clearer navigation by material family.",
      "The goal is direct sourcing clarity. You can move from jacquard to leather to vinyl quickly, compare tactile direction, and buy yardage without losing the premium tone of the collection.",
    ],
  },
  footerNote:
    "An editorial archive of designer fabrics, upholstery materials, leather, and vinyl sold by the yard.",
} as const

export const countryNames: Record<string, string> = {
  cn: "China",
  gb: "United Kingdom",
  pt: "Portugal",
}
