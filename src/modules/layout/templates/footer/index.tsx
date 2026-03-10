import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { siteContent } from "@lib/site-content"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

type FooterProps = {
  countryCode: string
}

export default async function Footer({ countryCode }: FooterProps) {
  const [allCategories, { response: siteProducts }] = await Promise.all([
    listCategories(),
    listProducts({
      countryCode,
      queryParams: {
        limit: 100,
        fields: "*categories",
      },
    }),
  ])

  const siteCategoryIds = new Set(
    siteProducts.products.flatMap((product) =>
      (product.categories ?? []).map((category) => category.id).filter(Boolean)
    )
  )

  const productCategories = allCategories.filter((category) => {
    if (!category.parent_category) {
      return (
        siteCategoryIds.has(category.id) ||
        (category.category_children ?? []).some((child) =>
          siteCategoryIds.has(child.id)
        )
      )
    }

    return siteCategoryIds.has(category.id)
  })

  return (
    <footer className="mt-8 w-full border-t border-[var(--brand-line)] bg-[rgba(255,250,244,0.72)]">
      <div className="content-container flex w-full flex-col">
        <div className="grid gap-10 py-16 md:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-md">
            <p className="eyebrow">{siteContent.eyebrow}</p>
            <LocalizedClientLink
              href="/"
              className="mt-4 inline-block font-display text-4xl uppercase tracking-[0.2em] text-[var(--brand-ink)]"
            >
              {siteContent.name}
            </LocalizedClientLink>
            <p className="mt-5 text-sm leading-7 text-[var(--brand-muted)]">
              {siteContent.footerNote}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-small-regular md:grid-cols-3 md:gap-x-16">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-[var(--brand-ink)]">
                  Categories
                </span>
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
              <span className="txt-small-plus text-[var(--brand-ink)]">
                Navigate
              </span>
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
              <span className="txt-small-plus text-[var(--brand-ink)]">
                Notes
              </span>
              <ul className="grid grid-cols-1 gap-y-2 txt-small text-[var(--brand-muted)]">
                <li>
                  Designer materials organized for faster sourcing.
                </li>
                <li>
                  Priced around a clear 1 yard selling unit.
                </li>
                <li>
                  Built for upholstery, panels, trim, and custom fabrication.
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
