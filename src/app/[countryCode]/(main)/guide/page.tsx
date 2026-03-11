import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { siteContent } from "@lib/site-content"

export const metadata: Metadata = {
  title: "Shipping, Swatches & Sourcing",
  description:
    "Read how Atelier Fabrics handles swatch questions, continuous yardage, project guidance, and order planning before checkout.",
}

const guideCards = [
  {
    title: "Swatches & Pre-Purchase Questions",
    body:
      "If you need help judging color, texture, project suitability, or want closer imagery before placing a larger order, contact support before checkout. This is especially important for upholstery, trim, headboards, and custom fabrication work.",
  },
  {
    title: "Continuous Yardage",
    body:
      "Listings are sold by the yard. When multiple yards are ordered, we usually prepare them as one continuous cut whenever the roll allows. If a project depends on a single continuous run, it is worth confirming before purchase.",
  },
  {
    title: "Project-Led Buying",
    body:
      "Different materials behave differently once specified. Jacquard, leather, vinyl, lining, denim, and upholstery-weight fabric each carry different expectations for wear, backing, trim work, and visual finish.",
  },
] as const

const detailRows = [
  {
    label: "Selling unit",
    value: "1 yard",
  },
  {
    label: "Typical price range",
    value: "USD 35 per yard for fabric, USD 45 per yard for leather and vinyl",
  },
  {
    label: "Support",
    value: siteContent.supportEmail,
  },
] as const

export default function GuidePage() {
  return (
    <div className="content-container py-10 md:py-16">
      <section className="grid gap-8 md:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="eyebrow">Customer Guide</p>
          <h1 className="mt-4 font-display text-5xl leading-none tracking-[-0.04em] text-[var(--brand-ink)] md:text-7xl">
            Shipping, swatches, sourcing, and purchase notes.
          </h1>
        </div>
        <div className="space-y-6">
          <p className="text-lg leading-8 text-[var(--brand-muted)]">
            This page answers the questions a careful buyer usually has before
            placing a fabric order: how yardage is handled, when to ask for
            project guidance, and how to contact us before committing to a
            larger cut.
          </p>
          <p className="text-base leading-8 text-[var(--brand-muted)]">
            Atelier Fabrics is presented as an archive-led sourcing storefront,
            not a generic mass-market catalogue. That means product selection is
            curated around material direction, upholstery use, decorative
            application, and visual finish rather than commodity-style browsing.
          </p>
          <div className="grid gap-3 border-t border-[var(--brand-line)] pt-4 text-sm leading-7 text-[var(--brand-muted)]">
            {detailRows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-6"
              >
                <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-soft)]">
                  {row.label}
                </span>
                <span className="max-w-[28rem] text-right text-[var(--brand-ink)]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-3">
        {guideCards.map((item) => (
          <div
            key={item.title}
            className="rounded-[1.6rem] border border-[var(--brand-line)] bg-white/88 p-6 shadow-[0_18px_50px_rgba(16,21,31,0.05)]"
          >
            <p className="eyebrow">{item.title}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--brand-muted)]">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[1.8rem] border border-[var(--brand-line)] bg-[rgba(255,250,244,0.82)] p-6">
          <p className="eyebrow">Shipping & Yardage</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--brand-muted)]">
            <p>
              Orders are structured around a clear 1 yard selling unit so you
              can estimate upholstery and decorative project quantities more
              easily.
            </p>
            <p>
              For multiple-yard orders, continuous cuts are generally prepared
              when the roll allows. If a project depends on exact continuous
              length, checking before checkout is the safest approach.
            </p>
            <p>
              Because material color, sheen, embossing, and handfeel can read
              differently across screens, larger orders are best placed only
              after you are confident in finish and intended use.
            </p>
          </div>
        </div>
        <div className="rounded-[1.8rem] border border-[var(--brand-line)] bg-[rgba(255,250,244,0.82)] p-6">
          <p className="eyebrow">Support & Suitability</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--brand-muted)]">
            <p>
              If you are deciding between upholstery, wall panels, trim, bag
              making, or decorative soft furnishings, contact support before you
              place a larger order.
            </p>
            <p>
              Swatch questions, finish confirmation, and project planning
              questions can be sent to
              {" "}
              <a
                className="text-[var(--brand-ink)] underline decoration-[rgba(16,21,31,0.25)] underline-offset-4"
                href={`mailto:${siteContent.supportEmail}`}
              >
                {siteContent.supportEmail}
              </a>
              .
            </p>
            <p>
              The clearest message to send is the product name or handle, your
              intended use, and whether you are planning a single-yard purchase
              or a larger project quantity.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-[var(--brand-line)] bg-[var(--brand-ink)] px-6 py-8 text-white md:px-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow text-[rgba(255,245,230,0.75)]">
              Next step
            </p>
            <h2 className="mt-4 font-display text-4xl leading-none tracking-[-0.03em] md:text-5xl">
              Browse the archive with fewer unknowns.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(255,245,230,0.76)]">
              Explore fabric by material family, review project-fit information,
              and contact us before checkout if you need swatch or yardage
              guidance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LocalizedClientLink href="/store" className="brand-button">
              Browse fabrics
            </LocalizedClientLink>
            <a
              href={`mailto:${siteContent.supportEmail}`}
              className="brand-button brand-button-secondary"
            >
              Email support
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
