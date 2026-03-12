import { HttpTypes } from "@medusajs/types"

import { siteContent } from "@lib/site-content"

export type ArchiveFaqItem = {
  question: string
  answer: string
}

type ArchiveBuyerPoint = {
  label: string
  value: string
}

type ArchivePageCopy = {
  eyebrow: string
  intro: string
  buyerPoints: ArchiveBuyerPoint[]
  faqItems: ArchiveFaqItem[]
}

const matchMaterialFamily = (value?: string | null) => {
  const normalized = String(value || "").toLowerCase()

  if (normalized.includes("jacquard")) {
    return "jacquard"
  }

  if (normalized.includes("leather")) {
    return "leather"
  }

  if (normalized.includes("vinyl")) {
    return "vinyl"
  }

  if (normalized.includes("lining")) {
    return "lining"
  }

  if (normalized.includes("denim")) {
    return "denim"
  }

  if (normalized.includes("canvas")) {
    return "canvas"
  }

  if (normalized.includes("cotton")) {
    return "cotton"
  }

  if (normalized.includes("upholstery")) {
    return "upholstery"
  }

  return "designer textile"
}

const getFamilyIntro = (family: string, label: string) => {
  switch (family) {
    case "jacquard":
      return `${label} pieces lean toward decorative upholstery, headboards, benches, cushions, and statement panels where pattern scale matters as much as color.`
    case "leather":
      return `${label} is presented for trim-heavy projects, bespoke seating accents, bags, panels, and interiors that need a sharper tactile finish.`
    case "vinyl":
      return `${label} brings a coated surface better suited to upholstery accents, wall panels, bags, and custom fabrication where durability matters.`
    case "lining":
      return `${label} is better suited to soft goods, bag interiors, lighter custom work, and detail-led applications rather than heavy upholstery.`
    case "denim":
      return `${label} offers a softer casual surface for lighter upholstery, soft goods, and fashion-led custom work.`
    case "canvas":
      return `${label} is geared toward bags, trim, light upholstery, and projects that benefit from a firmer structured base cloth.`
    case "cotton":
      return `${label} is best reviewed as a lighter designer textile for soft goods, lining, decorative accents, and selected custom projects.`
    case "upholstery":
      return `${label} is organized for interior projects first, with clearer notes around yardage, project fit, and when to request extra imagery before ordering.`
    default:
      return `${label} is arranged like a buying archive, with emphasis on material family, project fit, and clearer yardage planning before checkout.`
  }
}

const getFamilyBuyerPoints = (family: string): ArchiveBuyerPoint[] => {
  switch (family) {
    case "jacquard":
      return [
        { label: "Selling unit", value: "Ordered in 1 yard increments." },
        {
          label: "Best for",
          value: "Statement upholstery, cushions, benches, and decorative panels.",
        },
        {
          label: "Before you buy",
          value: "Request close-up imagery if you need to confirm weave scale or sheen.",
        },
      ]
    case "leather":
    case "vinyl":
      return [
        { label: "Selling unit", value: "Ordered in 1 yard increments." },
        {
          label: "Best for",
          value: "Headboards, trim, wall panels, bags, and upholstery accents.",
        },
        {
          label: "Before you buy",
          value: "Confirm finish, backing, and project suitability before larger cuts.",
        },
      ]
    default:
      return [
        { label: "Selling unit", value: "Ordered in 1 yard increments." },
        {
          label: "Best for",
          value: "Soft goods, lighter upholstery, trim, and decorative custom work.",
        },
        {
          label: "Before you buy",
          value: "Ask for extra imagery or project guidance before committing to volume.",
        },
      ]
  }
}

const getFamilyFaqItems = (family: string, label: string): ArchiveFaqItem[] => {
  const fitAnswer =
    family === "leather" || family === "vinyl"
      ? `${label} is generally better suited to trim, panels, bags, and upholstery accents than loose drapery. Review finish and backing before larger orders.`
      : family === "jacquard"
      ? `${label} is typically selected for decorative upholstery, cushions, benches, and headboards. For heavy-wear seating, confirm suitability before placing a larger order.`
      : `${label} is best reviewed against your specific project. Lighter material families are usually better for soft goods, lining, trim, and selective upholstery use.`

  return [
    {
      question: `How is ${label.toLowerCase()} sold?`,
      answer:
        "Listings are sold by the yard. Multiple yards are usually prepared as one continuous cut whenever the roll allows.",
    },
    {
      question: `What projects is ${label.toLowerCase()} best for?`,
      answer: fitAnswer,
    },
    {
      question: "Should I request a swatch or extra imagery first?",
      answer: `Yes. Email ${siteContent.supportEmail} if you want a closer texture check, project guidance, or help confirming suitability before a larger order.`,
    },
  ]
}

export const getStoreFaqItems = (): ArchiveFaqItem[] => [
  {
    question: "How are products sold?",
    answer:
      "Products are sold by the yard, with quantity representing the number of yards ordered. Multiple yards are usually prepared as one continuous cut whenever the roll allows.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Fabric listings typically sit at USD 35 per yard, while leather and vinyl listings typically sit at USD 45 per yard.",
  },
  {
    question: "When should I contact support before ordering?",
    answer: `If you need a closer texture check, project-fit advice, or extra imagery before a larger order, email ${siteContent.supportEmail}.`,
  },
]

export const getCategoryPageCopy = (
  category: HttpTypes.StoreProductCategory
): ArchivePageCopy => {
  const label = `${category.name} fabric by the yard`
  const family = matchMaterialFamily(category.handle || category.name)

  return {
    eyebrow: "Material Archive",
    intro:
      category.description ||
      getFamilyIntro(family, label.charAt(0).toUpperCase() + label.slice(1)),
    buyerPoints: getFamilyBuyerPoints(family),
    faqItems: getFamilyFaqItems(family, category.name),
  }
}

export const getCollectionPageCopy = (
  collection: HttpTypes.StoreCollection
): ArchivePageCopy => {
  const family = matchMaterialFamily(collection.handle || collection.title)
  const label = collection.title || "Designer textile collection"

  return {
    eyebrow: "Curated Collection",
    intro: `${label} groups designer materials with a similar visual direction so buyers can compare texture, pattern, and project fit without leaving the archive.`,
    buyerPoints: getFamilyBuyerPoints(family),
    faqItems: [
      {
        question: `What kind of assortment is included in ${label.toLowerCase()}?`,
        answer:
          "Collections group related archive materials so you can compare finishes, color stories, and pattern direction more quickly than browsing the full catalog.",
      },
      ...getFamilyFaqItems(family, label).slice(0, 2),
    ],
  }
}
