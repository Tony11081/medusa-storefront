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
      <div className="hidden border-b border-[rgba(255,255,255,0.12)] bg-[rgba(20,25,22,0.94)] text-white/72 backdrop-blur-xl md:block">
        <div className="content-container flex min-h-10 items-center justify-between gap-4 text-[10px] uppercase tracking-[0.24em]">
          <span>Designer fabrics sold by the yard</span>
          <span>Project guidance available before larger orders</span>
          <span>Shipping, swatches, and sourcing guidance</span>
        </div>
      </div>
      <header className="relative mx-auto border-b border-[var(--brand-line)] bg-[rgba(248,247,244,0.84)] backdrop-blur-xl duration-200">
        <nav className="content-container flex min-h-[4.5rem] items-center justify-between gap-3 text-small-regular text-[var(--brand-muted)] md:min-h-[5.4rem] md:gap-4">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center h-full justify-center">
            <LocalizedClientLink
              href="/"
              className="group flex items-center gap-2 text-center md:gap-3"
              data-testid="nav-store-link"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-[var(--brand-line-strong)] bg-white/88 font-display text-xs uppercase tracking-[0.24em] text-[var(--brand-ink)] shadow-[0_12px_28px_rgba(16,21,31,0.06)] md:h-11 md:w-11 md:text-sm md:tracking-[0.28em]">
                {siteContent.shortName}
              </span>
              <span className="block min-w-0">
                <span className="block truncate font-display text-[1.05rem] uppercase tracking-[0.16em] text-[var(--brand-ink)] sm:text-[1.15rem] md:text-2xl md:tracking-[0.22em]">
                  {siteContent.name}
                </span>
                <span className="mt-1 hidden text-[10px] uppercase tracking-[0.26em] text-[var(--brand-soft)] md:block">
                  {siteContent.tagline}
                </span>
              </span>
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-3 h-full flex-1 basis-0 justify-end md:gap-x-5">
            <div className="hidden items-center gap-x-6 h-full md:flex">
              {siteContent.navLinks.map((link) => (
                <LocalizedClientLink
                  key={link.href}
                  className="text-[11px] uppercase tracking-[0.24em] text-[var(--brand-soft)] transition hover:text-[var(--brand-ink)]"
                  href={link.href}
                >
                  {link.label}
                </LocalizedClientLink>
              ))}
              <LocalizedClientLink
                className="rounded-[2px] border border-[var(--brand-line-strong)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[var(--brand-soft)] transition hover:border-[var(--brand-ink)] hover:text-[var(--brand-ink)]"
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
