import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { siteContent } from "@lib/site-content"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <div className="hidden border-b border-black/5 bg-[rgba(28,21,16,0.92)] text-white/72 backdrop-blur-xl md:block">
        <div className="content-container flex min-h-10 items-center justify-between gap-4 text-[10px] uppercase tracking-[0.24em]">
          <span>178 curated textiles</span>
          <span>Sold in 1 yard units</span>
          <span>Leather and vinyl priced at USD 45</span>
        </div>
      </div>
      <header className="relative mx-auto border-b border-[var(--brand-line)] bg-[rgba(243,238,230,0.88)] backdrop-blur-xl duration-200">
        <nav className="content-container flex min-h-[5.25rem] items-center justify-between gap-4 text-small-regular text-[var(--brand-muted)]">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center h-full justify-center">
            <LocalizedClientLink
              href="/"
              className="group flex items-center gap-3 text-center"
              data-testid="nav-store-link"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(16,21,31,0.12)] bg-white/80 font-display text-sm uppercase tracking-[0.28em] text-[var(--brand-ink)] shadow-[0_10px_24px_rgba(16,21,31,0.08)]">
                {siteContent.shortName}
              </span>
              <span className="block">
                <span className="block font-display text-xl uppercase tracking-[0.24em] text-[var(--brand-ink)] md:text-2xl">
                  {siteContent.name}
                </span>
                <span className="mt-1 hidden text-[10px] uppercase tracking-[0.26em] text-[var(--brand-soft)] md:block">
                  {siteContent.tagline}
                </span>
              </span>
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-5 h-full flex-1 basis-0 justify-end">
            <div className="hidden items-center gap-x-6 h-full md:flex">
              {siteContent.navLinks.map((link) => (
                <LocalizedClientLink
                  key={link.href}
                  className="text-xs uppercase tracking-[0.22em] text-[var(--brand-soft)] transition hover:text-[var(--brand-ink)]"
                  href={link.href}
                >
                  {link.label}
                </LocalizedClientLink>
              ))}
              <LocalizedClientLink
                className="rounded-full border border-[var(--brand-line)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--brand-soft)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-ink)]"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 text-xs uppercase tracking-[0.22em] text-[var(--brand-soft)] transition hover:text-[var(--brand-ink)]"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
