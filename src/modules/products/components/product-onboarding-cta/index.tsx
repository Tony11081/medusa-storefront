import { Text } from "@medusajs/ui"

function ProductOnboardingCta() {
  return (
    <div className="space-y-5">
      <p className="eyebrow">Capsule notes</p>
      <Text className="font-display text-3xl leading-none tracking-[-0.03em] text-[var(--brand-ink)]">
        Designed to sit cleanly inside a repeat rotation.
      </Text>
      <Text className="text-sm leading-7 text-[var(--brand-muted)]">
        Built for wardrobe continuity rather than novelty drops. Every piece is
        framed to layer easily, travel well, and keep the styling language
        consistent.
      </Text>
      <div className="grid gap-3 border-t border-[var(--brand-line)] pt-4 text-sm leading-6 text-[var(--brand-muted)]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
            Dispatch
          </span>
          <span>Prepared for fast fulfillment</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
            Returns
          </span>
          <span>Clean exchange and return flow</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-soft)]">
            Styling
          </span>
          <span>Works with the wider capsule</span>
        </div>
      </div>
    </div>
  )
}

export default ProductOnboardingCta
