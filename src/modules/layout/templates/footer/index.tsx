import { listCategories } from "@lib/data/categories"
import { siteContent } from "@lib/site-content"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

type FooterProps = {
  countryCode: string
}

export default async function Footer({ countryCode }: FooterProps) {
  const allCategories = await listCategories({ limit: 24 })
  const productCategories = allCategories.filter((category) => !category.parent_category)

  return (
    <footer className="mt-12 w-full border-t border-[var(--brand-line)] bg-[rgba(252,251,248,0.84)]">
      <div className="content-container flex w-full flex-col">
        <div className="grid gap-10 py-12 md:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:py-20">
          <div className="max-w-xl">
            <p className="eyebrow">Join for early access and stories</p>
            <LocalizedClientLink
              href="/"
              className="mt-5 inline-block font-display text-[2.4rem] uppercase tracking-[0.14em] text-[var(--brand-ink)] md:text-5xl md:tracking-[0.18em]"
            >
              {siteContent.name}
            </LocalizedClientLink>
            <p className="mt-6 text-base leading-8 text-[var(--brand-muted)]">
              {siteContent.footerNote}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={`mailto:${siteContent.supportEmail}`} className="brand-button">
                Contact the studio
              </a>
              <LocalizedClientLink href="/guide" className="brand-button brand-button-secondary">
                Shipping & sourcing guide
              </LocalizedClientLink>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-10 text-small-regular md:grid-cols-3 md:gap-x-14">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="soft-caption text-[var(--brand-ink)]">Categories</span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "transition hover:text-[var(--brand-ink)]",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="transition hover:text-[var(--brand-ink)]"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="soft-caption text-[var(--brand-ink)]">Navigate</span>
              <ul className="grid grid-cols-1 gap-y-2 txt-small text-[var(--brand-muted)]">
                {siteContent.navLinks.map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink
                      className="transition hover:text-[var(--brand-ink)]"
                      href={link.href}
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
                <li>
                  <LocalizedClientLink
                    className="transition hover:text-[var(--brand-ink)]"
                    href="/account"
                  >
                    Account
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="transition hover:text-[var(--brand-ink)]"
                    href="/cart"
                  >
                    Cart
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="soft-caption text-[var(--brand-ink)]">Notes</span>
              <ul className="grid grid-cols-1 gap-y-2 txt-small text-[var(--brand-muted)]">
                <li>
                  Sold by the yard for upholstery, soft goods, trim, and custom projects.
                </li>
                <li>
                  Continuous cuts are usually prepared whenever the roll allows.
                </li>
                <li>
                  Swatch and project questions are handled directly through the studio.
                </li>
                <li>
                  <LocalizedClientLink
                    className="transition hover:text-[var(--brand-ink)]"
                    href="/guide"
                  >
                    Shipping, swatches, and sourcing guide
                  </LocalizedClientLink>
                </li>
                <li>
                  <a
                    className="transition hover:text-[var(--brand-ink)]"
                    href={`mailto:${siteContent.supportEmail}`}
                  >
                    {siteContent.supportEmail}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mb-10 flex w-full flex-col justify-between gap-4 border-t border-[var(--brand-line)] pt-6 text-[var(--brand-soft)] md:flex-row md:items-center">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} {siteContent.name}. All rights reserved.
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
