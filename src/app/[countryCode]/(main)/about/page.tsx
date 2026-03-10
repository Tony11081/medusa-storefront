import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { siteContent } from "@lib/site-content"

export const metadata: Metadata = {
  title: "About",
  description: siteContent.description,
}

export default function AboutPage() {
  return (
    <div className="content-container py-10 md:py-16">
      <section className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">{siteContent.eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl leading-none tracking-[-0.04em] text-[var(--brand-ink)] md:text-7xl">
            About {siteContent.name}
          </h1>
        </div>
        <div className="space-y-6">
          <p className="text-lg leading-8 text-[var(--brand-muted)]">
            {siteContent.about.lead}
          </p>
          {siteContent.about.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-8 text-[var(--brand-muted)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-3">
        {siteContent.valueProps.map((item) => (
          <div
            key={item.title}
            className="rounded-[1.6rem] border border-[var(--brand-line)] bg-white/85 p-6 shadow-[0_18px_50px_rgba(16,21,31,0.05)]"
          >
            <p className="eyebrow">{item.title}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--brand-muted)]">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-14 rounded-[2rem] border border-[var(--brand-line)] bg-[var(--brand-ink)] px-6 py-8 text-white md:px-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow text-[rgba(255,245,230,0.75)]">
              Next step
            </p>
            <h2 className="mt-4 font-display text-4xl leading-none tracking-[-0.03em] md:text-5xl">
              Browse the textile archive in full.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(255,245,230,0.76)]">
              Move from jacquard to leather to vinyl, compare the material
              direction, and source yardage for projects that need a clearer
              luxury finish.
            </p>
          </div>
          <LocalizedClientLink href="/store" className="brand-button">
            Enter the archive
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
