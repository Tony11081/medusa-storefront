import { Text } from "@medusajs/ui"

function ProductOnboardingCta() {
  return (
    <div className="space-y-5">
      <p className="eyebrow">Archive Notes</p>
      <Text className="font-display text-3xl leading-none tracking-[-0.03em] text-[var(--brand-ink)]">
        Selected for upholstery, trim, panels, and custom fabrication.
      </Text>
      <Text className="text-sm leading-7 text-[var(--brand-muted)]">
        Each listing is presented as a sourcing-ready fabric entry rather than
        a trend drop. Use the archive to compare texture, pattern, and finish
        before committing yardage to a project.
      </Text>
      <div className="grid gap-3 border-t border-[var(--brand-line)] pt-4 text-sm leading-6 text-[var(--brand-muted)]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
            Selling unit
          </span>
          <span>Priced per 1 yard</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
            Use case
          </span>
          <span>Suitable for interiors and specialty craft</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
            Support
          </span>
          <span>Review project yardage before purchase</span>
        </div>
      </div>
    </div>
  )
}

export default ProductOnboardingCta
