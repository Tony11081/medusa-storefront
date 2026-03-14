import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import { siteContent } from "@lib/site-content"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full bg-[var(--brand-panel)] small:min-h-screen">
      <div className="h-16 border-b border-[var(--brand-line)] bg-[var(--brand-panel)]">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-soft)]"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block hover:text-[var(--brand-ink)]">
              Back to shopping cart
            </span>
            <span className="mt-px block small:hidden hover:text-[var(--brand-ink)]">
              Back
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="font-display text-[1.05rem] uppercase tracking-[0.16em] text-[var(--brand-ink)] hover:text-[var(--brand-ink)] md:text-[1.2rem]"
            data-testid="store-link"
          >
            {siteContent.name}
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      <div className="py-4 w-full flex items-center justify-center">
        <MedusaCTA />
      </div>
    </div>
  )
}
