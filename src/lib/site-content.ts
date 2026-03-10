export const siteContent = {
  name: "AI Live Control",
  shortName: "ALC",
  tagline: "Technical wardrobe essentials for city movement.",
  description:
    "AI Live Control builds a compact capsule of elevated staples, travel-ready layers, and refined accessories for movement between studio, street, and terminal.",
  eyebrow: "Editorial Capsule 001",
  navLinks: [
    { label: "Store", href: "/store" },
    { label: "About", href: "/about" },
  ],
  featureHandles: [
    "ai-utility-hoodie",
    "ai-studio-tee",
    "ai-crossbody-pack",
    "ai-transit-joggers",
  ],
  categoryCards: [
    {
      title: "Tops",
      href: "/categories/tops",
      handle: "ai-utility-hoodie",
      description:
        "Layering pieces that move from early flights to late studio sessions without losing structure.",
    },
    {
      title: "Bottoms",
      href: "/categories/bottoms",
      handle: "ai-transit-joggers",
      description:
        "Relaxed silhouettes calibrated for travel days, city miles, and clean everyday repetition.",
    },
    {
      title: "Accessories",
      href: "/categories/accessories",
      handle: "ai-crossbody-pack",
      description:
        "Small carry essentials that keep the system tight, functional, and visually quiet.",
    },
  ],
  valueProps: [
    {
      title: "Capsule Logic",
      body: "Each piece is selected to layer cleanly, travel lightly, and repeat often without feeling basic.",
    },
    {
      title: "Material Restraint",
      body: "Cotton, fleece, nylon, and steel keep the assortment tactile, durable, and easy to live with.",
    },
    {
      title: "Urban Utility",
      body: "The visual language is spare, the silhouettes are flexible, and the function stays front and center.",
    },
  ],
  about: {
    lead:
      "AI Live Control is a compact wardrobe system for people who move through different settings without changing their visual standards.",
    paragraphs: [
      "The collection is intentionally tight: structured tops, relaxed bottoms, and low-profile accessories that work together rather than compete for attention.",
      "Instead of trend-driven product drops, the site is framed like a permanent capsule. The atmosphere is editorial, the pacing is calm, and the details matter more than noise.",
      "Everything on the storefront is arranged to feel usable, premium, and quietly precise, with enough utility for travel and enough restraint for everyday city wear.",
    ],
  },
  footerNote:
    "A compact capsule for studio days, city movement, and travel between both.",
} as const

export const countryNames: Record<string, string> = {
  cn: "China",
  gb: "United Kingdom",
  pt: "Portugal",
}
